# toRows 树转行

将树结构转成一唯数组

```js
import { toRows } from '@zhengxs/js.tree'

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

toRows(data)
// ->
// [
//   { title: '财务' },
//   { title: '收入流失' },
//   { title: '财务设置' },
//   { title: '站点设置' },
//   { title: '收入流失' },
//   { title: '财务设置' }
// ]
```

默认子级列表的属性名称是 **children**，可以通过第三个参数修改

```js
import { toRows } from '@zhengxs/js.tree'

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

// 指定子级列表的属性
toRows(data, 'items')
// ->
// [
//   { title: '财务' },
//   { title: '收入流失' },
//   { title: '财务设置' },
//   { title: '站点设置' },
//   { title: '收入流失' },
//   { title: '财务设置' }
// ]
```
