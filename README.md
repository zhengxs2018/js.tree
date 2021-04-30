# @zhengxs/js.tree

[![lang](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dt/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dm/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Gzip Size](http://img.badgesize.io/https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js?compression=gzip)](https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js)
[![codecov](https://codecov.io/gh/zhengxs2018/js.tree/branch/main/graph/badge.svg?token=JBYVAK2RRG)](https://codecov.io/gh/zhengxs2018/js.tree)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

操作树结构数据的 JavaScript 库。

## 安装

```shell
$ npm i @zhengxs/js.tree --save
```

## 使用

**行转树**

```js
import { toTree, ROOT_ID } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: null },
  { id: 3, parentId: 1 },
  { id: 1, parentId: null }
]

const result = toTree(data, {
  // 只有 null 或 undefined 才会将 root 改成 ROOT_ID
  // 如果根ID不是 null 或 undefined，那就需要手动指定
  // 支持函数，动态返回
  root: ROOT_ID,

  // 不是所有的关系字段都叫这个
  // 这时就可以手动指定
  idKey: 'id', // 默认: id
  parentKey: 'parentId', // 默认：parentId

  // 挂载子级的属性名称，默认：children
  childrenKey: 'children',

  // 数据添加进 children 数组前的处理，默认：undefined
  transform(data) {
    // 可以通过 Object.create 创建
    // 这样可以避免修改原始数据，同时又能共享原型
    return Object.create(data)
  }
})
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

**树转行**

```js
import { toRows } from '@zhengxs/js.tree'

const data = [
  { id: 2, parentId: null, children: [] },
  {
    id: 1,
    parentId: null,
    children: [{ id: 3, parentId: 1, children: [] }]
  }
]

// 如果不是 children 属性，可以通过第二个参数指定，可选
const result = toRows(data, 'children')
// ->
// [
//   { id: 2, parentId: null },
//   { id: 3, parentId: 1 },
//   { id: 1, parentId: null }
// ]
```

**内容过滤**

```js
import { filter } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    children: [{ title: '收入流失' }, { title: '财务设置' }]
  },
  {
    title: '站点设置',
    children: [{ title: '菜单维护' }, { title: '角色维护' }]
  }
]

// 如果不是 children 属性，可以通过第二个参数指定，可选
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
//       { title: '菜单维护' },
//       { title: '角色维护' }
//     ]
//   }
// ]

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = filter(data, callback, 'items')
```

**修改内容**

```js
import { map } from '@zhengxs/js.tree'

const data = [
  {
    title: '财务',
    children: [{ title: '收入流失' }, { title: '财务设置' }]
  },
  {
    title: '站点设置',
    children: [{ title: '菜单维护' }, { title: '角色维护' }]
  }
]

const result = map(data, (node, index, parents) => {
  if (node.title === '财务') {
    // 可以返回空的子节点，停止处理子级
    // 注意：参数浅拷贝，修改不会改变原始对象
    node.children = []
    return node
  }

  // 注意：参数浅拷贝，修改不会改变原始对象
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
//     children: [{ title: '菜单维护测试' }, { title: '角色维护测试' }]
//   }
// ]

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = map(data, callback, 'items')
```

## 对不同构建版本的解释

在包的 dist/ 目录你将会找到很多不同的构建版本，这里列出了它们之间的差别：

|                     | UMD            | CommonJS                 | ES Module                |
| ------------------- | -------------- | ------------------------ | ------------------------ |
| 无依赖              | js.tree.js     | js.tree.common.js        | js.tree.esm.js           |
| 无依赖(生产环境)    | js.tree.min.js |                          |                          |
| 包含 lodash 模块    |                | js.tree.common.lodash.js | js.tree.esm.lodash.js    |
| 包含 lodash-es 模块 |                |                          | js.tree.esm.lodash-es.js |

除环境导致的，为了减少包体积，和项目共享 `lodash` 模块。

但不是所有项目都会引入，为了避免这种情况，默认的都是不带的。

## License

- MIT
