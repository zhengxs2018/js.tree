# 过滤内容

可以使用 `filter` 函数过滤掉不想要的数据

回调函数参数：

- **node** - 当前节点对象
- **index** - 在同级中的索引
- **parents** - 所有上级的节点对象

```js
import { filter } from '@zhengxs/js.tree'

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

const result = filter(data, (node, index, parents) => {
  return node.title.indexOf('设置') > -1
})
// ->
// [
//   {
//     title: '财务',
//     children: [
//       { title: '财务设置' }
//     ]
//   },
//   {
//     title: '站点设置',
//     children: [
//       { title: '收入流失' },
//       { title: '财务设置' }
//     ]
//   }
// ]
```

默认子级列表的属性名称是 **children**，可以通过第三个参数修改

```js
import { filter } from '@zhengxs/js.tree'

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

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = filter(data, ({ title }) => title.indexOf('设置') > -1, 'items')
// ->
// [
//   {
//     title: '财务',
//     items: [
//       { title: '财务设置', items: [] }
//     ]
//   },
//   {
//     title: '站点设置',
//     items: [
//       { title: '收入流失' },
//       { title: '财务设置' }
//     ]
//   }
// ]
```
