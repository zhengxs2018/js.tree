import { isNil, defaultTo } from 'lodash'

import type { ID, Row, Node, Transform } from '../types'

import { assert, isNotNil } from './utils'
import { ROOT_ID, ID_KEY, PARENT_ID_KEY, CHILDREN_KEY } from './constants'

/** @public */
export type ParseOptions<T, S> = {
  /** id 的属性名 */
  idKey?: string
  /** parentId 的属性名 */
  parentKey?: string
  /** 支持自定义 children 的属性名 */
  childrenKey?: string
  /** 允许外部转换数据 */
  transform?: Transform<T, S>
}

/** @public */
export type ParseResult<S> = {
  /** id 的属性名 */
  idKey: string
  /** parentId 的属性名 */
  parentKey: string
  /** 支持自定义 children 的属性名 */
  childrenKey: string
  /** 包含所有节点的对象 */
  nodes: Record<ID, S>
  /** 包含所有节点关系的对象 */
  childNodes: Record<ID, S[]>
}

/**
 * 方便外部二次封装
 *
 * 如：封装一个类 jQuery 的 API 工具，方便查找节点
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
export function parse<S = Node, T extends Row = Row>(data: T[], options: ParseOptions<T, S> = {}): ParseResult<S> {
  const idKey = defaultTo(options.idKey, ID_KEY)
  const parentKey = defaultTo(options.parentKey, PARENT_ID_KEY)
  const childrenKey = defaultTo(options.childrenKey, CHILDREN_KEY)
  const transform = options.transform || ((x) => x as S)

  const nodes: Record<ID, S> = {}
  const childNodes: Record<ID, S[]> = {}

  let i = data.length
  while (i--) {
    const row = data[i] as T

    // 获取节点ID
    const id = row[idKey] as ID

    // id 必须存在
    assert(isNotNil(id), `id is required, in ${i}.`)

    // 数据结构转换
    const node = transform(row)

    // 支持过滤掉某些数据
    if (isNil(node)) continue

    // 获取子级元素
    const children = childNodes[id]
    if (children) {
      (node as Row)[childrenKey] = children
    } else {
      childNodes[id] = (node as Row)[childrenKey] = []
    }

    // 获取上级节点ID
    const parentId = defaultTo(row[parentKey], ROOT_ID) as ID

    // 获取同级元素
    const siblings = childNodes[parentId]
    if (siblings) {
      // todo: 可以在这里添加排序支持
      siblings.push(node)
    } else {
      childNodes[parentId] = [node]
    }

    // 为了方便外部根据ID获取节点信息
    nodes[id] = node
  }

  return {
    idKey,
    parentKey,
    childrenKey,
    nodes,
    childNodes
  }
}


