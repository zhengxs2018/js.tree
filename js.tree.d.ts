
/**
 * 子级的属性名
 *
 * @public
 */
export declare const CHILDREN_KEY = "children";

/**
 * 遍历所有节点
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 将跳过子级的遍历操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export declare function each<T extends Row>(data: T[], callback: (data: T, index: number, parents: T[]) => boolean | void, childrenKey?: string): T[];

/**
 * 排除某些数据
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 的数据将被过滤掉
 * @param childrenKey  - 自定义子节点属性名称
 */
export declare function exclude<T extends Row>(data: T[], callback: (data: T, index: number, parents: T[]) => boolean, childrenKey?: string): T[];

/**
 * 数据导出
 *
 * @public
 */
export declare type Exporter<T> = (nodes: Record<ID, T[]>) => T[];

/**
 * 数据导出，允许外部自定义根节点
 *
 * @public
 *
 * @param nodes - 包含所有层级的数据
 * @param root  - 根节点，支持自定义函数
 */
export declare function exporter<T>(nodes: Record<ID, T[]>, root?: ID | Exporter<T>): T[];

/**
 * 类数组的 filter 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export declare function filter<T extends Row>(data: T[], callback: (data: T, index: number, parents: T[]) => boolean, childrenKey?: string): T[];

/**
 * ID类型
 *
 * @public
 */
export declare type ID = string | number;

/**
 * id 的属性名
 *
 * @public
 */
export declare const ID_KEY = "id";

/**
 * 类数组的 map 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export declare function map<T extends Row, U extends Row>(data: T[], callback: (data: T, index: number, parents: T[]) => U, childrenKey?: string): U[];

/**
 * 默认的节点对象
 *
 * @public
 */
declare interface Node_2 extends Row {
    id: ID;
    parentId: ID;
    children: Node_2;
}
export { Node_2 as Node }

/**
 * 空数据
 *
 * @public
 */
export declare type None = null | undefined;

/**
 * parentId 的属性名
 *
 * @public
 */
export declare const PARENT_ID_KEY = "parentId";

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
export declare function parse<S = Node_2, T extends Row = Row>(data: T[], options?: ParseOptions<T, S>): ParseResult<S>;

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
 * filter 回调
 *
 * @public
 */
export declare type Predicate<T> = (data: T) => boolean;

/**
 * 根ID
 *
 * @public
 */
export declare const ROOT_ID = "__root__";

/**
 * 普通对象
 *
 * @public
 */
export declare type Row = Record<string | number, unknown>;

/**
 * 树转行
 *
 * @public
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 */
export declare function toRows<T extends Row, U extends Row>(data: T[], childrenKey?: string): U[];

/**
 * 行转树
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
export declare function toTree<S = Node_2, T extends Row = Row>(data: T[], options?: ToTreeOptions<S, T>): S[];

/**
 * 配置项
 *
 * @public
 */
export declare interface ToTreeOptions<S, T extends Row = Row> extends ParseOptions<T, S> {
    /** 顶级节点ID，支持自定义函数 */
    root?: ID | Exporter<S>;
}

/**
 * 节点转换
 *
 * @public
 */
export declare type Transform<T, S> = (data: T, index: number) => S | None;

/**
 * 发布版本
 *
 * @public
 */
export declare const version = "0.2.0";

export { }
