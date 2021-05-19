import type { Row } from '../types';
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
//# sourceMappingURL=each.d.ts.map