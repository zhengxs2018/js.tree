# 修改内容

可以使用 `map` 修改数据

回调函数参数：

- **node** - 当前节点对象
- **index** - 在同级中的索引
- **parents** - 所有上级的节点对象

```js
import { map } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    children: [
      { title: '收入流失', children: [] },
      { title: '财务设置', children: [] },
    ],
  },
  {
    title: '站点设置',
    children: [
      { title: '收入流失', children: [] },
      { title: '财务设置', children: [] },
    ],
  },
]

const result = map(data, (node, index, parents) => {
  if (node.title === '财务') {
    // 可以返回空的子节点，停止处理子级
    // 已经做过浅拷贝，修改不会改变原始对象
    node.children = []
    return node
  }

  // 已经做过浅拷贝，修改不会改变原始对象
  node.title = node.title + '测试'

  // 必须返回内容
  return node
})
// ->
// [
//   {
//     title: '财务',
//     children: []
//   },
//   {
//     title: '站点设置测试',
//     children: [
//       { title: '收入流失测试' },
//       { title: '财务设置测试' }
//     ]
//   }
// ]
```

默认子级列表的属性名称是 **chilren**，可以通过第三个参数修改

```js
import { map } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    items: [
      { title: '收入流失', items: [] },
      { title: '财务设置', items: [] },
    ],
  },
  {
    title: '站点设置',
    items: [
      { title: '收入流失', items: [] },
      { title: '财务设置', items: [] },
    ],
  },
]

const result = map(
  data,
  (node, index, parents) => {
    if (node.title === '财务') {
      // 可以返回空的子节点，停止处理子级
      // 已经做过浅拷贝，修改不会改变原始对象
      node.children = []
      return node
    }

    // 已经做过浅拷贝，修改不会改变原始对象
    node.title = node.title + '测试'

    // 必须返回内容
    return node
  },
  'items'
)
// ->
// [
//   {
//     title: '财务',
//     items: []
//   },
//   {
//     title: '站点设置测试',
//     items: [
//       { title: '收入流失测试' },
//       { title: '财务设置测试' }
//     ]
//   }
// ]
```
