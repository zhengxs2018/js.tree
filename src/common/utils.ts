import { isNil, defaultTo } from 'lodash'

import type { ID, Exporter } from '../types'

import { ROOT_ID } from './constants'

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
 * @param object       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
export function popKey<T extends Record<string, unknown>, K extends keyof T, U>(
  object: T,
  key: K,
  defaultValue: U
): U

/**
 * 删除对象的 key，并返回它的值
 *
 * @param object       - 普通对象
 * @param key          - 属性名
 */
export function popKey<T extends Record<string, unknown>, K extends keyof T, U>(
  object: T,
  key: K
): U

/**
 * 删除对象的 key，并返回它的值
 *
 * @param source       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
export function popKey<T extends Record<string, unknown>, K extends keyof T, U>(
  object: T,
  key: K,
  defaultValue?: U
): U | undefined {
  const value = object[key] as U
  delete object[key]
  return defaultTo(value, defaultValue)
}

/**
 * 数据导出，允许外部自定义根节点
 *
 * @public
 *
 * @param nodes - 包含所有层级的数据
 * @param root  - 根节点，支持自定义函数
 */
export function exporter<T>(nodes: Record<ID, T[]>, root?: ID | Exporter<T>): T[] {
  if (typeof root === 'function') {
    return root(nodes) || []
  }

  return nodes[defaultTo(root, ROOT_ID)] || []
}
