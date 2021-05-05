# @zhengxs/js.tree

[![lang](https://img.shields.io/badge/lang-typescript-informational?style=flat)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/%40zhengxs%2Fjs.tree.svg?style=flat)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dt/%40zhengxs%2Fjs.tree.svg?style=flat)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Downloads](https://img.shields.io/npm/dm/%40zhengxs%2Fjs.tree.svg?style=flat)](https://www.npmjs.com/package/%40zhengxs%2Fjs.tree)
[![Gzip Size](http://img.badgesize.io/https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js?compression=gzip&style=flat)](https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js)
[![codecov](https://codecov.io/gh/zhengxs2018/js.tree/branch/main/graph/badge.svg?token=JBYVAK2RRG)](https://codecov.io/gh/zhengxs2018/js.tree)
[![Dependency Status](https://david-dm.org/zhengxs2018/js.tree.SVG)](https://david-dm.org/zhengxs2018/js.tree?type=dev)
[![devDependency Status](https://david-dm.org/zhengxs2018/js.tree/dev-status.svg)](https://david-dm.org/zhengxs2018/js.tree?type=dev)
[![js.tree](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/dtcor7/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/dtcor7/runs)
[![Node.js CI](https://github.com/zhengxs2018/js.tree/actions/workflows/tests.yaml/badge.svg)](https://github.com/zhengxs2018/js.tree/actions/workflows/tests.yaml)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg?style=flat)](#typescript)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)

> `lodash` 是可选的，详见 [对不同构建版本的解释](#对不同构建版本的解释)

快速，轻量，无依赖的树结构数据处理函数库。

- 一个循环解决行转树的问题
- 转树除了添加 `children` 属性，不会修改任何数据
- 支持任意关系字段，如：非 id，parentId, children 字段支持
- 支持接管插入行为，如：自定义插入顺序
- 支持动态导出树节点
- 内置 `filter/map` 函数

## 快速开始

### 文档

- [行转树](./docs/transform/toTree.md)
- [树转行](./docs/transform/toRows.md)
- [过滤内容](./docs/operators/filter.md)
- [修改内容](./docs/operators/map.md)
- [二次封装](./docs/advanced/custom.md)

### 安装

```shell
$ npm i @zhengxs/js.tree --save
```

### 使用

```js
import { toTree } from '@zhengxs/js.tree'

toTree([
  { id: 10000, parentId: null, title: '标题 1' },
  { id: 20000, parentId: null, title: '标题 2' },
  { id: 11000, parentId: 10000, title: '标题 1-1' }
])
// ->
// [
//   { id: 20000, parentId: null, title: '标题 2', children: [] },
//   {
//     id: 10000,
//     parentId: null,
//     title: '标题 1',
//     children: [
//       { id: 11000, parentId: 10000, title: '标题 1-1', children: [] }
//     ]
//   }
// ]
```

支持任意关系字段的数据

```js
import { toTree, ROOT_ID } from '@zhengxs/js.tree'

const data = [
  { uid: 10000, pid: null, title: '标题 1', sort: 1 },
  { uid: 20000, pid: null, title: '标题 2', sort: 2 },
  { uid: 11000, pid: 10000, title: '标题 1-1', sort: 3 }
]

const result = toTree(data, {
  // parentId 为 null 或 undefined 时可选
  // 如果根ID不是 null 或 undefined，那就需要手动指定
  // 支持函数，动态返回
  root: ROOT_ID,

  // lodash 版本，支持 path, 如: nested.id
  idKey: 'uid', // 可选，默认: id

  // lodash 版本，支持 path, 如: nested.parentId
  parentKey: 'pid', // 可选，默认：parentId

  // 挂载子级的属性名称，默认：children
  childrenKey: 'items',

  // 接管插入行为
  insert(siblings, node) {
    const index = siblings.findIndex((n) => n.sort > node.sort)

    if (index === -1) {
      siblings.push(node)
    } else {
      siblings.splice(index, 0, node)
    }
  },

  // 数据添加进 children 数组前的处理，默认：undefined
  transform(data) {
    // 通过浅拷贝避免修改原始数据
    // 可以在这里动态添加属性
    return { ...data, checked: false }
  }
})
// ->
// [
//   {
//     uid: 10000,
//     pid: null,
//     title: '标题 1',
//     sort: 1,
//     checked: false,
//     items: [
//       {
//         uid: 11000,
//         pid: 10000,
//         title: '标题 1-1',
//         sort: 3,
//         checked: false,
//         items: []
//       }
//     ]
//   },
//   {
//     uid: 20000,
//     pid: null,
//     title: '标题 2',
//     sort: 2,
//     checked: false,
//     items: []
//   }
// ]
```

**Try on RunKit**

<a href="https://runkit.com/zhengxs2018/js.tree">
  <img src="https://static.runkitcdn.com/assets/images/brand/horizontal-logo-full.svg" height="44" alt="Try on RunKit">
</a>

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
