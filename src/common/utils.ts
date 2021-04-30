import { isNil } from 'lodash'

/**
 * 和 isNil 结果相反
 *
 * @param value
 */
export function isNotNil(value: unknown) {
  return isNil(value) === false
}

/**
 * 断言，模拟 node api
 *
 * @param value
 * @param message
 */
/* istanbul ignore next */
export function assert(value: boolean, message: string | Error): never | void {
  if (value) return
  if (message instanceof Error) {
    throw message
  }
  throw new Error(message)
}

/**
 * 删除对象的 key，并返回它的值
 *
 * @param source       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
export function popKey<T extends object>(source: T, key: string, defaultValue?: unknown): T {
  // @ts-ignore
  const value = source[key]
  // @ts-ignore
  delete source[key]
  // 如果值不存在，那就返回默认值
  return isNil(value) ? defaultValue : value
}
