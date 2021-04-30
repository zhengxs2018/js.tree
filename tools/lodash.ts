/**
 * 判断书叫是否为 null 或 undefined
 *
 * like lodash/isNil
 *
 * @param value 未知数据
 */
export function isNil(value: unknown): value is undefined | null {
  return value === undefined || value === null
}

/**
 * 如果值为 null 或 undefined，则使用默认值
 *
 * like lodash/defaultTo
 *
 * @param value 未知数据
 * @param defaultValue 默认值
 */
export function defaultTo<T>(value: T | undefined | null, defaultValue: T): T {
  return isNil(value) ? defaultValue : value
}
