import type { Row } from '../types';
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
//# sourceMappingURL=exclude.d.ts.map