import type { Row } from '../types';
/**
 * 树转行
 *
 * @public
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 */
export declare function toRows<T extends Row, U extends Row>(data: T[], childrenKey?: string): U[];
//# sourceMappingURL=toRows.d.ts.map