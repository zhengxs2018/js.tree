import type { ID, Row, Node, Transform } from '../types';
/** @public */
export declare type ParseOptions<T, S> = {
    /** id 的属性名 */
    idKey?: string;
    /** parentId 的属性名 */
    parentKey?: string;
    /** 支持自定义 children 的属性名 */
    childrenKey?: string;
    /** 允许外部转换数据 */
    transform?: Transform<T, S>;
    /** 允许外部接管插入行为 */
    insert?: (siblings: S[], node: S) => void;
};
/** @public */
export declare type ParseResult<S> = {
    /** id 的属性名 */
    idKey: string;
    /** parentId 的属性名 */
    parentKey: string;
    /** 支持自定义 children 的属性名 */
    childrenKey: string;
    /** 包含所有节点的对象 */
    nodes: Record<ID, S>;
    /** 包含所有节点关系的对象 */
    childNodes: Record<ID, S[]>;
};
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
export declare function parse<S = Node, T extends Row = Row>(data: T[], options?: ParseOptions<T, S>): ParseResult<S>;
//# sourceMappingURL=parse.d.ts.map