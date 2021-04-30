import { popKey } from '../common/utils'
import { CHILDREN_KEY } from '../common/constants'

/**
 * 树转行
 *
 * @public
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 */
export function toRows<T = any>(data: any[], childrenKey: string = CHILDREN_KEY): T[] {
  const result: T[] = []

  function callback(source: any) {
    const target = { ...source }
    result.push(target)
    popKey(target, childrenKey, []).forEach(callback)
  }

  data.forEach(callback)

  return result
}
