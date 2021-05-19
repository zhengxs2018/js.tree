import type { ID, Row, Node, Exporter } from '../types';
import { ParseOptions } from '../common/parse';
/**
 * 配置项
 *
 * @public
 */
export interface ToTreeOptions<S, T extends Row = Row> extends ParseOptions<T, S> {
    /** 顶级节点ID，支持自定义函数 */
    root?: ID | Exporter<S>;
}
/**
 * 行转树
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
export declare function toTree<S = Node, T extends Row = Row>(data: T[], options?: ToTreeOptions<S, T>): S[];
//# sourceMappingURL=toTree.d.ts.map