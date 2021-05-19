/**
 * ID类型
 *
 * @public
 */
export declare type ID = string | number;
/**
 * 空数据
 *
 * @public
 */
export declare type None = null | undefined;
/**
 * 普通对象
 *
 * @public
 */
export declare type Row = Record<string | number, unknown>;
/**
 * 默认的节点对象
 *
 * @public
 */
export interface Node extends Row {
    id: ID;
    parentId: ID;
    children: Node;
}
/**
 * 数据导出
 *
 * @public
 */
export declare type Exporter<T> = (nodes: Record<ID, T[]>) => T[];
/**
 * filter 回调
 *
 * @public
 */
export declare type Predicate<T> = (data: T) => boolean;
/**
 * 节点转换
 *
 * @public
 */
export declare type Transform<T, S> = (data: T, index: number) => S | None;
//# sourceMappingURL=types.d.ts.map