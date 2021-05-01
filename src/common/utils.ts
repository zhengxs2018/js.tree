import { isNil } from 'lodash'

import type { Row } from '../types'

/**
 * 和 isNil 结果相反
 *
 * @param value - 需要检查的值
 */
export function isNotNil(value: unknown): boolean {
  return isNil(value) === false
}

/**
 * 断言，模拟 node api
 *
 * @param value    - 断言结果
 * @param message  - 断言失败提示
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
export function popKey<T extends Row, U>(source: T, key: string, defaultValue?: U): U | undefined {
  const value = source[key] as U
  delete source[key]
  return isNil(value) ? defaultValue : value
}
