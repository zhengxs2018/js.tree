# toTree 行转树

`array` 和 `tree` 在程序开发中是常见的两种数据结构，它们之间的转换也很普遍。

`tree` 对人友好，但对存储和查找不太友好，所以一般在使用的时候转成 `array`，在使用时再转成 `tree`。

toTree 的默认行为如下：

- 默认 `id` 作为节点的唯一关系列。
- 默认 `parentId` 作为上级关系列。
- 如果 `parentId` 是 `null` 或 `undefined`，将被认为是一级节点。
- 除 `children` 属性外 (**会改变原始数据**)，不修改任何内容。
- 使用倒序插入，后面出现的会出现在同级的前面。

**注:** 以上行为都可以通过传递参数改变。

## 默认

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: null },
  { id: 3, parentId: 1 },
  { id: 1, parentId: null }
]

// 注意这会修改原始对象
toTree(data)
// ->
// [
//   { id: 2, parentId: null, children: [] },
//   {
//     id: 1,
//     parentId: null,
//     children: [{ id: 3, parentId: 1, children: [] }]
//   }
// ]
```

## 自定义导出内容

默认 `parentId` 为 `null` 或 `undefined` 的数据为一级节点，可通过 `root` 参数修改。

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: 0 },
  { id: 3, parentId: 1 },
  { id: 1, parentId: 0 }
]

toTree(data, {
  // 支持任意字符串或数字
  root: 0
})
```

有时候可能不确定那个，这时可以传递函数动态判断

```ts
import { toTree, ROOT_ID } from '@zhengxs/js.tree'
import type { ID, Node } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: undefined },
  { id: 3, parentId: 1 },
  { id: 1, parentId: null }
]

toTree(data, {
  // 注：必须返回数组
  root(childNodes: Record<ID, Node[]>) {
    // parentId 是 null 或 undefined 被合并在一起
    // 使用 ROOT_ID 作为 key 在管理
    return childNodes[ROOT_ID]
  }
})
```

## 自定义关系

不同的场景和不同的使用对象，都会导致数据结构存在很大的差异，这时可以手动指定关系列。

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { sid: 2, pid: null },
  { sid: 3, pid: 1 },
  { sid: 1, pid: null }
]

const result = toTree(data, {
  // lodash 版本，支持 path，如: nested.id
  idKey: 'sid', // 可选，默认: id

  // lodash 版本，支持 path，如: nested.parentId
  parentKey: 'pid', // 可选，默认：parentId

  childrenKey: 'items' // 可选，默认：children
})
// ->
// [
//   { sid: 2, pid: null, items: [] },
//   {
//     sub: 1,
//     pid: null,
//     items: [{ sid: 3, pid: 1, items: [] }]
//   }
// ]
```

**使用 lodash 版本可以支持 path**

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { title: '标题 1', nested: { id: 10000, parentId: null } },
  { title: '标题 2', nested: { id: 20000, parentId: null } },
  { title: '标题 1-1', nested: { id: 11000, parentId: 10000 } }
]

const result = toTree(data, {
  // 详见说明：https://lodash.com/docs/#get
  idKey: 'nested.id',
  parentKey: 'nested.parentId'
})
// ->
// [
//   { title: '标题 2', nested: { id: 20000, parentId: null }, children: [] },
//   {
//     title: '标题 1',
//     nested: { id: 10000, parentId: null },
//     children: [
//       { title: '标题 1-1', nested: { id: 11000, parentId: 10000 }, children: []  }
//     ]
//   }
// ]
```

## 转换数据

如果需要将数据转成其他结构，可以使用 `transform` 参数。

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: null },
  { id: 3, parentId: 1 },
  { id: 1, parentId: null }
]

// 注意这会修改原始对象
toTree(data, {
  transform(row) {
    // 返回 null 或 undefined 的数据会被过滤掉
    if (row.id === 3) return

    // 可以进行浅拷贝，防止原始数据发生变化
    return { ...row, checked: false }
  }
})
// ->
// [
//   { id: 2, parentId: null, checked: false, children: [] },
//   { id: 1, parentId: null, checked: false, children: [] }
// ]
```

**注:** 修改会导致原始对象也被改变

## 排序

默认不会进行任何排序操作，可以使用 `insert` 自定义插入位置。

```js
import { toTree } from '@zhengxs/js.tree'

const data = [
  { id: 20000, parentId: null, sort: 1 },
  { id: 10000, parentId: null, sort: 0 },
  { id: 30000, parentId: null, sort: 2 }
]

// 注意这会修改原始对象
toTree(data, {
  // 第一个参数是已经排序好的兄弟节点
  // 第二个参数是当前节点
  insert(siblings, node) {
    const index = siblings.findIndex((current) => {
      return current.sort > node.sort
    })

    if (index === -1) {
      siblings.push(node)
    } else {
      siblings.splice(index, 0, node)
    }
  }
})
// ->
// [
//   { id: 10000, parentId: null, sort: 0, children: [] },
//   { id: 20000, parentId: null, sort: 1, children: [] },
//   { id: 30000, parentId: null, sort: 2, children: [] }
// ]
```

**注:** 配置后，内部不再做任何操作。
