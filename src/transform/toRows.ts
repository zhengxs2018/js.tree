import { popKey } from '../common/utils'
import { CHILDREN_KEY } from '../common/constants'
import type { Row } from '../types'

/**
 * 树转行
 *
 * @public
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 */
export function toRows<T extends Row, U extends Row>(
  data: T[],
  childrenKey: string = CHILDREN_KEY
): U[] {
  const result: U[] = []

  function callback(source: T) {
    const target = { ...source } as U
    result.push(target)

    const children = popKey(target as U, childrenKey as string, [] as T[]) as T[]
    children.forEach(callback)
  }

  data.forEach(callback)

  return result
}
