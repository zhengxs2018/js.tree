# 循环内容

可以使用 `each` 查看每一个节点数据。

回调函数参数：

- **node** - 当前节点对象
- **index** - 在同级中的索引
- **parents** - 所有上级的节点对象

```js
import { each } from '@zhengxs/js.tree'

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

each(data, (node) => {
  // 返回 true 将跳过子级的遍历操作
  if (node.title === '财务') return true

  console.log(node.title)
})
// -> 站点设置
// -> 菜单维护
// -> 角色维护
```

默认子级列表的属性名称是 **chilren**，可以通过第三个参数修改

```js
import { each } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    items: [{ title: '收入流失' }, { title: '财务设置' }],
  },
  {
    title: '站点设置',
    items: [{ title: '菜单维护' }, { title: '角色维护' }],
  },
]

each(data, (node) => {
  // 返回 true 将跳过子级的遍历操作
  if (node.title === '财务') return true

  console.log(node.title)
}, 'items')
// -> 站点设置
// -> 菜单维护
// -> 角色维护
```
