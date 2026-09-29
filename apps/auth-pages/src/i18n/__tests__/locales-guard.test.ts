import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 直接读盘、不走 i18n 实例：src/test/setup.ts 全局 mock 了 @/i18n/config，
// 经它取到的永远是 key 而非文案，无法校验 locale 内容。守卫必须读原始文件。
const localesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../locales');

const LOCALES = ['zh-CN.json', 'en-US.json'] as const;

function loadLocale(file: string): Record<string, unknown> {
	return JSON.parse(readFileSync(path.join(localesDir, file), 'utf8'));
}

/**
 * 禁用词 = 无法核实的能力/资质宣称，或法律正文里不该出现的营销措辞。
 * 出现在 locale 里即视为回归（法律正文的唯一权威源是
 * shared/service-compliance/db/seeds/legal_documents.go，前者不该有正文副本）。
 */
const BANNED_TERMS = [
	'SOC 2',
	'ISO 27001',
	'渗透测试',
	'penetration test',
	'AuthMS',
	'已认证',
	'certified',
	'certification',
	'端到端加密',
	'end-to-end encryption',
	'可下载',
	'downloadable',
];

/** 法律正文在 i18n 里的历史键族 —— 双源架构的一半，删除后不得回归 */
const BANNED_KEY_PREFIXES = ['privacy.sections.', 'terms.sections.'];

/** 法律页错误态依赖的键；缺任何一个，接口不可用时页面就没有可读文案 */
const REQUIRED_KEYS = [
	'privacy.title',
	'privacy.lastUpdated',
	'privacy.loadFailed',
	'privacy.backToLogin',
	'terms.title',
	'terms.lastUpdated',
	'terms.loadFailed',
	'terms.backToSignIn',
	'common.loadFailedDesc',
	'common.retry',
];

describe('i18n locale guard', () => {
	for (const file of LOCALES) {
		describe(file, () => {
			it('contains no banned claim wording', () => {
				const locale = loadLocale(file);
				const hits: string[] = [];
				for (const [key, value] of Object.entries(locale)) {
					const text = JSON.stringify(value);
					for (const term of BANNED_TERMS) {
						if (text.includes(term)) hits.push(`${key} → ${term}`);
					}
				}
				expect(hits, `禁用词命中：\n${hits.join('\n')}`).toEqual([]);
			});

			it('carries no legal-document body (single source of truth is the compliance seed)', () => {
				const locale = loadLocale(file);
				const offenders = Object.keys(locale).filter((key) =>
					BANNED_KEY_PREFIXES.some((prefix) => key.startsWith(prefix)),
				);
				expect(offenders, `法律正文不得内嵌于前端 i18n：\n${offenders.join('\n')}`).toEqual([]);
				// 嵌套对象同样不可达（config.ts keySeparator:false），一并禁掉防复活
				expect(locale).not.toHaveProperty('privacy');
				expect(locale).not.toHaveProperty('terms');
			});

			it('keeps every key the legal pages need', () => {
				const locale = loadLocale(file);
				const missing = REQUIRED_KEYS.filter((key) => typeof locale[key] !== 'string');
				expect(missing, `缺失键：\n${missing.join('\n')}`).toEqual([]);
			});
		});
	}

	it('keeps zh-CN and en-US key sets in sync', () => {
		const zh = Object.keys(loadLocale('zh-CN.json'));
		const en = Object.keys(loadLocale('en-US.json'));
		expect(zh.filter((k) => !en.includes(k))).toEqual([]);
		expect(en.filter((k) => !zh.includes(k))).toEqual([]);
	});
});
