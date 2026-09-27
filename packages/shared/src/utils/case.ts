/**
 * 字段名大小写转换工具
 * 后端 Go 返回 PascalCase，前端统一使用 camelCase
 */

import { camelCase, isPlainObject, isArray } from 'lodash-es';

/**
 * 递归将对象的所有键从 PascalCase/snake_case 转换为 camelCase
 */
export function camelCaseKeys<T>(obj: T): T {
	if (isArray(obj)) {
		return obj.map(camelCaseKeys) as unknown as T;
	}
	if (!isPlainObject(obj) || obj === null) {
		return obj;
	}

	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
		result[camelCase(key)] = camelCaseKeys(value);
	}
	return result as T;
}

/**
 * 递归将对象的所有键从 camelCase 转换为 snake_case
 * 用于发送请求到后端
 */
export function snakeCaseKeys<T>(obj: T): T {
	if (isArray(obj)) {
		return obj.map(snakeCaseKeys) as unknown as T;
	}
	if (!isPlainObject(obj) || obj === null) {
		return obj;
	}

	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
		const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
		result[snakeKey] = snakeCaseKeys(value);
	}
	return result as T;
}
