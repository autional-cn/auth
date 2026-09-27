// brand-color.ts — OKLab (Ottosson) 颜色转换 + WCAG 2.x 对比度 + 暗色品牌推导
// 纯函数，零外部依赖。移植自 butler/requirements/design/brand-contrast.mjs（保留全部常数）
// 防御 (N3): 非法 hex 输入（非 #rgb/#rrggbb、空串、null/undefined）返回原值/安全默认，不抛错，
//            避免租户数据异常产生 invalid CSS 变量值。

type Rgb = [number, number, number];

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** 归一化为小写 #rrggbb（支持 #rgb 展开 + 大写 hex）；非法输入返回 null */
function normalizeHex(hex: unknown): string | null {
	if (typeof hex !== 'string') return null;
	const h = hex.trim();
	if (!HEX_RE.test(h)) return null;
	let digits = h.slice(1).toLowerCase();
	if (digits.length === 3)
		digits = digits
			.split('')
			.map((c) => c + c)
			.join('');
	return `#${digits}`;
}

// ── WCAG 2.x 相对亮度 / 对比度（脚本 L4-20）──
function hexToRgb(hex: string): Rgb {
	const norm = normalizeHex(hex);
	if (!norm) return [0, 0, 0];
	const d = norm.slice(1);
	return [0, 2, 4].map((i) => parseInt(d.slice(i, i + 2), 16) / 255) as Rgb;
}
function lin(c: number): number {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function lum(rgb: Rgb): number {
	const [r, g, b] = rgb.map(lin) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: Rgb, b: Rgb): number {
	const l1 = lum(a);
	const l2 = lum(b);
	const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
	return (hi + 0.05) / (lo + 0.05);
}

// ── sRGB ↔ OKLab (Ottosson，脚本 L22-46，含 Math.cbrt 与输出钳位) ──
function srgbToOklab(rgb: Rgb): [number, number, number] {
	const [r, g, b] = rgb.map(lin) as [number, number, number];
	let l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
	let m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
	let s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
	l = Math.cbrt(l);
	m = Math.cbrt(m);
	s = Math.cbrt(s);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}
function oklabToSrgb([L, a, b]: [number, number, number]): Rgb {
	const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
	const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
	const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
	const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
	const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
	const b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
	const conv = (c: number): number => {
		c = Math.min(1, Math.max(0, c)); // 钳位（脚本 L42）
		return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	};
	return [conv(r), conv(g), conv(b2)];
}
function rgbToHex(rgb: Rgb): string {
	return (
		'#' +
		rgb
			.map((c) =>
				Math.round(c * 255)
					.toString(16)
					.padStart(2, '0'),
			)
			.join('')
	);
}

/** hex → OKLCH [L, C, H]（防御: 非法输入返回 [0, 0, 0]，不抛错） */
export function hexToOklch(hex: string): [number, number, number] {
	if (normalizeHex(hex) === null) return [0, 0, 0];
	const [L, a, b] = srgbToOklab(hexToRgb(hex));
	return [L, Math.hypot(a, b), Math.atan2(b, a)];
}

/** OKLCH [L, C, H] → hex（防御: 非法输入返回 '#000000'，不抛错） */
export function oklchToHex(oklch: [number, number, number]): string {
	if (
		!Array.isArray(oklch) ||
		oklch.length < 3 ||
		oklch.slice(0, 3).some((v) => typeof v !== 'number' || Number.isNaN(v))
	) {
		return '#000000';
	}
	const [L, C, H] = oklch;
	return rgbToHex(oklabToSrgb([L, C * Math.cos(H), C * Math.sin(H)]));
}

/** 向白色混入比例 t: OKLCH[L+(1-L)·t, C·(1-t), H]（保持色相，抬升 L、压降 C，脚本 L58-63） */
function mixWhite(hex: string, t: number): string {
	const [L, C, H] = hexToOklch(hex);
	return oklchToHex([L + (1 - L) * t, C * (1 - t), H]);
}

/** 内部函数（不导出）: 二分 24 迭代求最小 t∈[0,cap]，使 mixWhite(hex,t) 对 refBg 对比度 ≥ target。
 *  供 deriveDarkColor / deriveDarkHover 复用，避免二次二分（ADR-003）。 */
function deriveT(hex: string, refBg: string, target: number, cap: number): number {
	let lo = 0;
	let hi = cap;
	const bgRgb = hexToRgb(refBg);
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (contrast(hexToRgb(mixWhite(hex, mid)), bgRgb) >= target) hi = mid;
		else lo = mid;
	}
	return (lo + hi) / 2;
}

/** 推导暗色品牌变体 = mixWhite(hex, deriveT(...))。
 *  D3 锁定默认参数: refBg='#0a2940', target=4.55, cap=0.85。
 *  防御 (N3): 非法 hex → 返回原值不抛错（不产生 invalid CSS 变量值）。 */
export function deriveDarkColor(hex: string, refBg = '#0a2940', target = 4.55, cap = 0.85): string {
	if (normalizeHex(hex) === null) return hex;
	const bg = normalizeHex(refBg) ?? '#0a2940';
	const tgt = typeof target === 'number' && !Number.isNaN(target) ? target : 4.55;
	const c = typeof cap === 'number' && !Number.isNaN(cap) ? Math.max(0, Math.min(cap, 1)) : 0.85;
	return mixWhite(hex, deriveT(hex, bg, tgt, c));
}

/** on-brand 文本色: 选 '#ffffff' 与 '#0a0f1a' 中对比度更高者（保证 ≥4.5）。
 *  防御: 非法 fill → '#0a0f1a'（安全默认，不抛错）。 */
export function pickOnColor(fill: string): '#ffffff' | '#0a0f1a' {
	if (normalizeHex(fill) === null) return '#0a0f1a';
	const white: Rgb = [1, 1, 1];
	const dark = hexToRgb('#0a0f1a');
	return contrast(white, hexToRgb(fill)) >= contrast(dark, hexToRgb(fill)) ? '#ffffff' : '#0a0f1a';
}

/** hover 暗色变体 = mixWhite(color, min(t+0.08, 0.92))，t 复用 deriveT（ADR-003/D4）。
 *  防御 (N3): 非法 hex → 返回原值不抛错。 */
export function deriveDarkHover(hex: string, refBg = '#0a2940', target = 4.55, cap = 0.85): string {
	if (normalizeHex(hex) === null) return hex;
	const bg = normalizeHex(refBg) ?? '#0a2940';
	const tgt = typeof target === 'number' && !Number.isNaN(target) ? target : 4.55;
	const c = typeof cap === 'number' && !Number.isNaN(cap) ? Math.max(0, Math.min(cap, 1)) : 0.85;
	const t = deriveT(hex, bg, tgt, c);
	return mixWhite(hex, Math.min(t + 0.08, 0.92));
}
