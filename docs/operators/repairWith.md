# 根据不完整关系修复缺失的节点数据

可以使用 `repairWith` 修复不完整的列表关系数据为树结构数据。

回调函数参数：

- **list** - 不完整的列表关系数据
- **index** - 在同级中的索引
- **parents** - 所有上级的节点对象

```js
import { repairWith } from '@zhengxs/js.tree'

const valuesMap = {
  10000: { id: 10000, parentId: null, title: '研发中心' },
  11000: { id: 11000, parentId: 10000, title: '体验设计部' },
  11001: { id: 11001, parentId: 11000, title: '设计组' },
  11002: { id: 11002, parentId: 11000, title: '前端组' },
  12000: { id: 12000, parentId: 10000, title: '系统集成部' },
}

const data = [
  { id: 12000, parentId: 10000, title: '系统集成部' },
  { id: 11001, parentId: 11000, title: '设计组' },
  { id: 11002, parentId: 11000, title: '前端组' },
]

repairWith(data, {
  resolve: (id) => valuesMap[id],
})
```

输出

```json
[
  {
    "children": [
      {
        "children": [],
        "id": 12000,
        "parentId": 10000,
        "title": "系统集成部"
      },
      {
        "children": [
          {
            "children": [],
            "id": 11001,
            "parentId": 11000,
            "title": "设计组"
          },
          {
            "children": [],
            "id": 11002,
            "parentId": 11000,
            "title": "前端组"
          }
        ],
        "id": 11000,
        "parentId": 10000,
        "title": "体验设计部"
      }
    ],
    "id": 10000,
    "parentId": null,
    "title": "研发中心"
  }
]
```
