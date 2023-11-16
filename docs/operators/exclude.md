# 排除数据

可以使用 `exclude` 函数过滤掉不想要的数据

和 `filter` 方法的区别：

- 回调函数返回 `true` 的数据将被过滤
- 如果子级都被过滤掉了，那父级也会被排除

回调函数参数：

- **node** - 当前节点对象
- **index** - 在同级中的索引
- **parents** - 所有上级的节点对象

```js
import { exclude } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    children: [{ title: '收入流失' }, { title: '财务设置' }],
  },
  {
    title: '站点设置',
    children: [{ title: '菜单维护' }, { title: '角色维护' }],
  },
]

const result = exclude(data, (node, index, parents) => {
  return node.title.includes('财务') || node.title.includes('角色')
})
// ->
// [
//   {
//     title: '站点设置',
//     children: [{ title: '菜单维护' }],
//   },
// ]
```

默认子级列表的属性名称是 **children**，可以通过第三个参数修改

```js
import { exclude } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    children: [{ title: '收入流失' }, { title: '财务设置' }],
  },
  {
    title: '站点设置',
    children: [{ title: '菜单维护' }, { title: '角色维护' }],
  },
]

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = exclude(
  data,
  ({ title }) => title.includes('财务') || title.includes('角色'),
  'items'
)
// ->
// [
//   {
//     title: '站点设置',
//     items: [{ title: '菜单维护' }],
//   },
// ]
```
