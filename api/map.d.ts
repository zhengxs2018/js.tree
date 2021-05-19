/**
 * 类数组的 map 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export declare function map<T = any, S = any>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => S,
  childrenKey?: string
): S[]
//# sourceMappingURL=map.d.ts.map
