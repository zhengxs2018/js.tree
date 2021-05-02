# @zhengxs/js.tree

[![lang](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dt/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dm/%40zhengxs%2Fjs.tree.svg)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Gzip Size](http://img.badgesize.io/https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js?compression=gzip)](https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js)
[![codecov](https://codecov.io/gh/zhengxs2018/js.tree/branch/main/graph/badge.svg?token=JBYVAK2RRG)](https://codecov.io/gh/zhengxs2018/js.tree)
[![Dependency Status](https://david-dm.org/zhengxs2018/js.tree.SVG)](https://david-dm.org/zhengxs2018/js.tree?type=dev)
[![devDependency Status](https://david-dm.org/zhengxs2018/js.tree/dev-status.svg)](https://david-dm.org/zhengxs2018/js.tree?type=dev)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg)](#typescript)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

快速，轻量，无依赖的树结构数据处理函数库。

## 特点

- 一个循环解决行转树的问题
- 转树除了添加 `children` 属性，不会修改任何数据
- 支持任意关系字段，如：id，parentId, children 字段
- 支持动态导出树节点
- 内置 `filter/map` 树遍历快捷方法
- `lodash` 是可选的，详见底部介绍

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

## TypeScript

内置 ts 类型

```ts
import { toTree } from '@zhengxs/js.tree'

// 转换前的数据
type MenuItem = {
  id: string
  parentId: string
  text: string
  url?: string
}

// 转换后的数据
interface Nav extends MenuItem {
  items: Nav[]
}

// 如果修改了 childrenKey
// 为了让类型提示正确，可以传入正确的类型
toTree<Nav>(source, {
  childrenKey: 'items'
})
```

## 对不同构建版本的解释

> umd 模块使用 `es5`，其他版本使用的是 `es2015`。

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
