import { CHILDREN_KEY } from '../common/constants'
import type { Row } from '../types'

/**
 * 类数组的 filter 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export function filter<T extends Row>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => boolean,
  childrenKey: string = CHILDREN_KEY
): T[] {
  function iter(data: T[], parents: T[]): T[] {
    const items: T[] = []

    data.forEach((node, index) => {
      if (callback(node, index, parents)) {
        items.push({ ...node })
      } else {
        const children = iter((node[childrenKey] as T[]) || [], parents.concat(node))
        if (children.length > 0) {
          items.push({ ...node, [childrenKey]: children })
        }
      }
    })

    return items
  }

  return iter(data, [])
}
