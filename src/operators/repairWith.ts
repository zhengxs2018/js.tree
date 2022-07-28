import type { ID, Row, Node } from '../types'
import { ID_KEY, PARENT_ID_KEY, CHILDREN_KEY } from '../common/constants'

export type RepairWithConfig<T extends Row = Row, U extends Node = Node> = {
  idKey?: string
  parentKey?: string
  childrenKey?: string
  resolve: (id: ID) => T
  insert?: (list: U[], node: U) => void
}

export type RepairWithOptions<T extends Row = Row, U extends Node = Node> = Required<
  RepairWithConfig<T, U>
>

export const resolveRepairWithOptions = <T extends Row = Row, U extends Node = Node>({
  idKey = ID_KEY,
  parentKey = PARENT_ID_KEY,
  childrenKey = CHILDREN_KEY,
  resolve,
  insert = (list, node) => list.push(node),
}: RepairWithConfig<T, U>): RepairWithOptions<T, U> => ({
  idKey,
  parentKey,
  childrenKey,
  resolve,
  insert,
})

/**
 * 根据列表修复缺失的节点数据
 *
 * @param list - 不完整列表数据
 * @param  config - 配置参数
 * @returns 已修复好的数结构
 */
export const repairWith = <T extends Row = Row, U extends Node = Node>(
  list: T[],
  config: RepairWithConfig<T, U>
): U[] => {
  const { idKey, parentKey, childrenKey, resolve, insert } = resolveRepairWithOptions(config)

  const rootNodes: U[] = []
  const parents: Record<ID, U> = {}

  const createNode = (data: T) => {
    const children: U[] = []
    const current = { ...data, [childrenKey]: children } as U

    parents[data[idKey] as ID] = current

    return current
  }

  const repairNodeLinks = (current: U) => {
    const parentId = current[parentKey] as ID
    const parent = parents[parentId]

    // 查找本地是否存在上级
    if (parent) {
      insert(parent[childrenKey] as U[], current)
      return
    }

    // 查找外部是存在上级
    const data = resolve(parentId)
    if (!data) {
      insert(rootNodes, current)
      return
    }

    const target = createNode(data)

    // 插入当前节点
    insert(target[childrenKey] as U[], current)

    // 继续向上修复
    repairNodeLinks(target)
  }

  list.forEach((item) => {
    const data = resolve(item[idKey] as ID)
    if (!data) return

    repairNodeLinks(createNode(data))
  })

  return rootNodes
}
