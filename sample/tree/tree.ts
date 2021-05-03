import { defaultTo } from 'lodash'

import { ROOT_ID, parse, exporter, filter } from '../../src'
import type { ID, Row, Node, ToTreeOptions, Exporter, ParseResult } from '../../src'

export class Tree<S extends Node = Node> {
  /**
   * ID 属性名
   *
   * @public
   */
  idKey: string

  /**
   * 上级 ID 属性名
   *
   * @public
   */
  parentKey: string

  /**
   * 子级节点属性名
   *
   * @public
   */
  childrenKey: string

  /**
   * 顶级ID
   */
  #root: ID | Exporter<S>

  /**
   * 包含所有节点的对象
   */
  #nodes: Record<ID, S> = {}

  /**
   * 包含所有节点关系的对象
   */
  #childNodes: Record<ID, S[]> = {}

  constructor(result: ParseResult<S>, root?: ID | Exporter<S>) {
    this.idKey = result.idKey
    this.parentKey = result.parentKey
    this.childrenKey = result.childrenKey

    this.#nodes = result.nodes
    this.#childNodes = result.childNodes
    this.#root = defaultTo(root, ROOT_ID)
  }

  /**
   * 获取顶级节点
   *
   * @public
   */
  root(): S[] {
    return exporter(this.#childNodes, this.#root)
  }

  /**
   * 根据ID获取节点
   *
   * @public
   */
  get(id: ID): S | undefined {
    return this.#nodes[id]
  }

  /**
   * 获取指定ID的直接上级
   *
   * @public
   */
  parent(id: ID): S | undefined {
    const node = this.get(id)
    return node ? this.#nodes[Tree.parentId(node)] : undefined
  }

  /**
   * 获取指定ID的所有上级
   *
   * @public
   */
  parents(id: ID): S[] {
    const parentNodes: S[] = []

    let parent
    while ((parent = this.parent(id))) {
      parentNodes.push(parent)
      id = Tree.parentId(parent)
    }

    return parentNodes
  }

  /**
   * 过滤数据
   *
   * @public
   *
   * @param callback
   */
  filter(callback: (data: S, index: number, parents: S[]) => boolean) {
    return filter<S>(this.root(), callback, this.childrenKey)
  }

  /**
   * 获取指定节点的上级ID
   */
  static parentId<T extends Node = Node>(node: T, parentKey: string = 'parentId') {
    return defaultTo(node[parentKey] as ID, ROOT_ID)
  }

  /**
   * 加载数据
   *
   * @param data
   * @param options
   */
  static load<S extends Node = Node, T extends Row = Row>(data: T[], options: ToTreeOptions<S, T> = {}) {
    return new Tree(parse(data, options), options.root)
  }
}
