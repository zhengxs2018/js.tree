import { isNil, defaultTo } from 'lodash'

import type { ID, Row, Node, Exporter, None } from '../types'

import { assert, isNotNil } from '../common/utils'
import { ROOT_ID, ID_KEY, PARENT_ID_KEY, CHILDREN_KEY } from '../common/constants'

/**
 * 数据导出，允许外部自定义根节点
 *
 * @param nodes - 包含所有层级的数据
 * @param root  - 根节点，支持自定义函数
 */
function exporter<T>(nodes: Record<ID, T[]>, root?: ID | Exporter<T>): T[] {
  if (typeof root === 'function') {
    return root(nodes) || []
  }

  return nodes[defaultTo(root, ROOT_ID)] || []
}

/**
 * 配置项
 *
 * @public
 */
export type TreeOptions<T, S> = {
  /** 顶级节点ID，支持自定义函数 */
  root?: ID | Exporter<S>
  /** id 的属性名 */
  idKey?: string
  /** parentId 的属性名 */
  parentKey?: string
  /** 支持自定义 children 的属性名 */
  childrenKey?: string
  /** 允许外部转换数据 */
  transform?: (data: T) => S | None
}

/**
 * 行转树
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
export function toTree<T extends Row, S extends Row = Node>(
  data: T[],
  options: TreeOptions<T, S> = {}
): S[] {
  const root = defaultTo(options.root, ROOT_ID)
  const idKey = defaultTo(options.idKey, ID_KEY)
  const parentKey = defaultTo(options.parentKey, PARENT_ID_KEY)
  const childrenKey = defaultTo(options.childrenKey, CHILDREN_KEY)
  const transform = options.transform || ((x) => x as S)

  const nodes: Record<ID, S[]> = {}

  let i = data.length
  while (i--) {
    const row: T = data[i] as T

    // 获取节点ID
    const id = row[idKey] as ID

    // id 必须存在
    assert(isNotNil(id), `id is required, in ${i}.`)

    // 数据结构转换
    const node = transform(row)

    // 支持过滤掉某些数据
    if (isNil(node)) continue

    // 获取子级元素
    const children = nodes[id]
    if (children) {
      (node as Row)[childrenKey] = children
    } else {
      nodes[id] = (node as Row)[childrenKey] = []
    }

    // 获取上级节点ID
    const parentId = defaultTo(row[parentKey], ROOT_ID) as ID

    // 获取同级元素
    const siblings = nodes[parentId]
    if (siblings) {
      siblings.push(node)
    } else {
      nodes[parentId] = [node]
    }
  }

  return exporter(nodes, root)
}
