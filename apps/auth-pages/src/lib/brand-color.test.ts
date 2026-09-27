import { describe, it, expect } from 'vitest';
import {
	deriveDarkColor,
	deriveDarkHover,
	pickOnColor,
	hexToOklch,
	oklchToHex,
} from './brand-color';

// ── WCAG 2.x 对比度 helper（测试内自实现，与 brand-color.ts 内部逻辑一致）──
function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	const d =
		h.length === 3
			? h
					.split('')
					.map((c) => c + c)
					.join('')
			: h;
	return [0, 2, 4].map((i) => parseInt(d.slice(i, i + 2), 16) / 255) as [number, number, number];
}
function lin(c: number): number {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function lum(rgb: [number, number, number]): number {
	const [r, g, b] = rgb.map(lin) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
	const l1 = lum(hexToRgb(a));
	const l2 = lum(hexToRgb(b));
	const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
	return (hi + 0.05) / (lo + 0.05);
}

const REF_BG = '#0a2940';
const DARK_TEXT = '#0a0f1a';

// E9 快照期望值（TASK-101 target=4.55 首跑固化，禁止照抄脚本 4.5 hex）
// 验证：node --experimental-strip-types 直接跑 TASK-101 产物输出与此表一致（2026-08-01）
const SNAPSHOT: Record<string, { derived: string; hover: string }> = {
	'#003153': { derived: '#7a90a5', hover: '#8ea1b3' },
	'#87ceeb': { derived: '#87ceeb', hover: '#91d2ed' },
	'#ffbf00': { derived: '#ffbf00', hover: '#ffc53a' },
	'#10b981': { derived: '#10b981', hover: '#3cbf8b' },
	'#e11d48': { derived: '#ed5e6b', hover: '#f2707a' },
	'#000000': { derived: '#8d8d8d', hover: '#a6a6a6' },
	'#ff0000': { derived: '#ff4e3d', hover: '#ff6452' },
	'#0000ff': { derived: '#5289ff', hover: '#689aff' },
	'#7c3aed': { derived: '#9978f6', hover: '#a388f8' },
	'#0f172a': { derived: '#888e99', hover: '#9da1ab' },
	'#b45309': { derived: '#c87b4f', hover: '#cf8862' },
};

// 需推导的色（原色对 refBg 不达标，推导色 cr 收敛于 [4.47, 4.57]）
const NEEDS_DERIVE = new Set([
	'#003153',
	'#e11d48',
	'#000000',
	'#ff0000',
	'#0000ff',
	'#7c3aed',
	'#0f172a',
	'#b45309',
]);
// 已达标色（原色对 refBg 已超上界 → 推导色 = 原色，属算法正确行为），
// 其断言在 5 品牌色用例的 else 分支内联处理（cr ≥ 4.5 即可）。

const snapCases = Object.entries(SNAPSHOT) as Array<[string, { derived: string; hover: string }]>;

describe('deriveDarkColor — 5 品牌色（ADR-004 D5）', () => {
	const brandSeeds = ['#003153', '#87ceeb', '#ffbf00', '#10b981', '#e11d48'];

	it.each(brandSeeds)('%s → 推导色对 refBg(#0a2940) 达标', (seed) => {
		const derived = deriveDarkColor(seed);
		const cr = contrast(derived, REF_BG);
		if (NEEDS_DERIVE.has(seed)) {
			// 主断言（鲁棒性）: 需推导色收敛区间 [4.47, 4.57]
			expect(cr).toBeGreaterThanOrEqual(4.47);
			expect(cr).toBeLessThanOrEqual(4.57);
		} else {
			// 已达标色（原色达标）: cr ≥ 4.5 即可
			expect(cr).toBeGreaterThanOrEqual(4.5);
		}
	});

	it.each(brandSeeds)('%s → 深字 #0a0f1a on 推导色 ≥ 5.0', (seed) => {
		const derived = deriveDarkColor(seed);
		expect(contrast(DARK_TEXT, derived)).toBeGreaterThanOrEqual(5.0);
	});

	it.each(brandSeeds)('%s → 推导不发散（输出为合法 hex）', (seed) => {
		expect(deriveDarkColor(seed)).toMatch(/^#[0-9a-f]{6}$/);
	});
});

describe('deriveDarkColor — 6 边界色压力测试（ADR-004 D5 / AC-002）', () => {
	const edgeSeeds = ['#000000', '#ff0000', '#0000ff', '#7c3aed', '#0f172a', '#b45309'];

	it.each(edgeSeeds)('%s → 全收敛，cr ∈ [4.47, 4.57]', (seed) => {
		const derived = deriveDarkColor(seed);
		const cr = contrast(derived, REF_BG);
		expect(cr).toBeGreaterThanOrEqual(4.47);
		expect(cr).toBeLessThanOrEqual(4.57);
	});

	it.each(edgeSeeds)('%s → 深字 #0a0f1a on 推导色 ≥ 5.0', (seed) => {
		const derived = deriveDarkColor(seed);
		expect(contrast(DARK_TEXT, derived)).toBeGreaterThanOrEqual(5.0);
	});
});

describe('快照断言（防漂移，target=4.55 首跑固化）', () => {
	it.each(snapCases)('%s → derived hex 精确匹配', (seed, exp) => {
		expect(deriveDarkColor(seed)).toBe(exp.derived);
	});

	it.each(snapCases)('%s → hover hex 精确匹配', (seed, exp) => {
		expect(deriveDarkHover(seed)).toBe(exp.hover);
	});
});

describe('pickOnColor（design.md §2.4 表）', () => {
	it('#003153（深色 seed）→ #ffffff', () => {
		expect(pickOnColor('#003153')).toBe('#ffffff');
	});

	it('#e11d48（深红 seed）→ #ffffff', () => {
		expect(pickOnColor('#e11d48')).toBe('#ffffff');
	});

	it('#6d869c（浅灰蓝）→ #0a0f1a', () => {
		expect(pickOnColor('#6d869c')).toBe('#0a0f1a');
	});

	it('#87ceeb（亮天蓝）→ #0a0f1a', () => {
		expect(pickOnColor('#87ceeb')).toBe('#0a0f1a');
	});
});

describe('deriveDarkHover（ADR-003/D4）', () => {
	it.each(snapCases)('%s → hover 比 base 更亮（L 抬升）', (seed) => {
		const base = deriveDarkColor(seed);
		const hover = deriveDarkHover(seed);
		expect(hexToOklch(hover)[0]).toBeGreaterThan(hexToOklch(base)[0]);
	});

	it.each(snapCases)('%s → hover 对 refBg 对比度 ≥ 4.5', (seed) => {
		const hover = deriveDarkHover(seed);
		expect(contrast(hover, REF_BG)).toBeGreaterThanOrEqual(4.5);
	});

	it('#003153 → #8ea1b3（快照）', () => {
		expect(deriveDarkHover('#003153')).toBe('#8ea1b3');
	});
});

describe('N3 防御 — 非法输入不抛错返回原值', () => {
	it.each(['#xyz', '', 'red', '#12', 'not-a-color'])('deriveDarkColor(%j) → 返回原值', (input) => {
		expect(deriveDarkColor(input)).toBe(input);
		expect(deriveDarkHover(input)).toBe(input);
	});

	it('null / undefined → 返回原值不抛错', () => {
		expect(deriveDarkColor(null as any)).toBeNull();
		expect(deriveDarkColor(undefined as any)).toBeUndefined();
		expect(deriveDarkHover(null as any)).toBeNull();
		expect(deriveDarkHover(undefined as any)).toBeUndefined();
	});

	it('#123 是 3 位合法缩写（= #112233），正常推导不抛错', () => {
		const derived = deriveDarkColor('#123');
		expect(derived).toMatch(/^#[0-9a-f]{6}$/);
	});

	it('pickOnColor 非法输入 → #0a0f1a 安全默认，不抛错', () => {
		expect(pickOnColor('#xyz')).toBe('#0a0f1a');
		expect(pickOnColor('')).toBe('#0a0f1a');
		expect(pickOnColor(null as any)).toBe('#0a0f1a');
	});
});

describe('hexToOklch / oklchToHex 往返', () => {
	it('hexToOklch 返回 [L, C, H] 且 L ∈ [0, 1]', () => {
		const oklch = hexToOklch('#003153');
		expect(oklch).toHaveLength(3);
		oklch.forEach((v) => expect(typeof v).toBe('number'));
		expect(oklch[0]).toBeGreaterThanOrEqual(0);
		expect(oklch[0]).toBeLessThanOrEqual(1);
	});

	it('往返 #003153 → 接近原色（RGB 分量差 ≤ 2/255）', () => {
		const round = oklchToHex(hexToOklch('#003153'));
		const [r1, g1, b1] = hexToRgb('#003153');
		const [r2, g2, b2] = hexToRgb(round);
		expect(Math.abs(r1 - r2) * 255).toBeLessThanOrEqual(2);
		expect(Math.abs(g1 - g2) * 255).toBeLessThanOrEqual(2);
		expect(Math.abs(b1 - b2) * 255).toBeLessThanOrEqual(2);
	});

	it('oklchToHex 非法输入 → #000000 安全默认，不抛错', () => {
		expect(oklchToHex('bad' as any)).toBe('#000000');
		expect(oklchToHex(null as any)).toBe('#000000');
		expect(oklchToHex([1, 2] as any)).toBe('#000000');
	});
});
