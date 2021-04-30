/**
 * ID类型
 *
 * @public
 */
export type ID = string | number

/**
 * 空数据
 *
 * @public
 */
export type None = null | undefined

/**
 * 普通对象
 *
 * @public
 */
export type Row = Record<string | number, unknown>

/**
 * 数据导出
 *
 * @public
 */
export type Exporter<T> = (nodes: Record<ID, T[]>) => T[]

/**
 * 默认的节点对象
 *
 * @public
 */
export interface Node extends Row {
  children: Node
}

export type Predicate<T> = (data: T) => boolean
