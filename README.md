<div align="center">
  <h1>
   <br/>
    <br/>
    👍
    <br />
    @zhengxs/js.tree
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/lang-typescript-informational?style=flat" alt="TypeScript" />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier" />
    </a>
    <a href="https://www.npmjs.com/package/@zhengxs/js.tree">
      <img src="https://img.shields.io/npm/v/@zhengxs/js.tree.svg" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@zhengxs/js.tree">
      <img src="https://img.shields.io/npm/dt/@zhengxs/js.tree.svg" alt="npm downloads" />
    </a>
    <a href="https://www.npmjs.com/package/@zhengxs/js.tree">
      <img src="https://img.shields.io/npm/dm/@zhengxs/js.tree.svg" alt="npm downloads" />
    </a>
    <a href="https://unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js">
      <img src="https://img.badgesize.io/https:/unpkg.com/@zhengxs/js.tree/dist/js.tree.min.js?compression=gzip&style=flat" alt="Gzip Size" />
    </a>
    <a href="https://david-dm.org/zhengxs2018/js.tree">
      <img src="https://img.shields.io/david/zhengxs2018/js.tree" alt="Dependency Status" />
    </a>
    <a href="https://david-dm.org/zhengxs2018/js.tree?type=dev">
      <img src="https://img.shields.io/david/dev/zhengxs2018/js.tree" alt="DevDependency Status" />
    </a>
    <a href="https://dashboard.cypress.io/projects/dtcor7/runs">
      <img src="https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/dtcor7/main&style=flat&logo=cypress" alt="Cypress" />
    </a>
    <a href="https://codecov.io/gh/zhengxs2018/js.tree">
      <img src="https://codecov.io/gh/zhengxs2018/js.tree/branch/main/graph/badge.svg" alt="codecov" />
    </a>
    <a href="https://github.com/zhengxs2018/js.tree/actions/workflows/tests.yaml">
      <img src="https://github.com/zhengxs2018/js.tree/actions/workflows/tests.yaml/badge.svg" alt="Github action" />
    </a>
    <a href="#typescript">
      <img src="https://img.shields.io/badge/typings-included-brightgreen.svg?style=flat" alt="Typings" />
    </a>
    <a href="#License">
      <img src="https://img.shields.io/npm/l/@zhengxs/js.tree.svg?style=flat-square" alt="License" />
    </a>
    <br />
    <br />
  </sup>
  <div>快速，轻量，无依赖的树结构数据处理函数库。</div>
  <br />
  <br />
  <br />
</div>

---

- 一个循环解决行转树的问题
- 转树除了添加 `children` 属性，不会修改任何数据
- 支持任意关系字段，如：非 id，parentId, children 字段支持
- 支持接管插入行为，如：自定义插入顺序
- 支持动态导出树节点
- 内置 `filter/map` 函数

## 快速开始

[国内镜像](https://gitee.com/zhengxs2018/js.tree)

### 文档

- 转换
  - [toTree 行转树](./docs/transform/toTree.md)
  - [toRows 树转行](./docs/transform/toRows.md)
- 操作
  - [map 修改内容](./docs/operators/map.md)
  - [each 循环内容](./docs/operators/each.md)
  - [filter 过滤内容](./docs/operators/filter.md)
  - [exclude 排除内容](./docs/operators/exclude.md)
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
  { id: 11000, parentId: 10000, title: '标题 1-1' },
])
// ->
// [
//   {
//     id: 10000,
//     parentId: null,
//     title: '标题 1',
//     children: [
//       { id: 11000, parentId: 10000, title: '标题 1-1', children: [] }
//     ]
//   },
//   { id: 20000, parentId: null, title: '标题 2', children: [] },
// ]
```

支持任意关系字段的数据

```js
import { toTree, ROOT_ID } from '@zhengxs/js.tree'

const data = [
  { uid: 10000, pid: null, title: '标题 1', sort: 1 },
  { uid: 20000, pid: null, title: '标题 2', sort: 2 },
  { uid: 11000, pid: 10000, title: '标题 1-1', sort: 3 },
]

const result = toTree(data, {
  // 如果 parentId 为 null 或 undefined 会合并一起
  // 使用 ROOT_ID 作为 key 保存
  // 支持函数，动态返回
  root: ROOT_ID,

  // lodash 版本，支持 path, 如: nested.id
  idKey: 'uid', // 可选，默认: id

  // lodash 版本，支持 path, 如: nested.parentId
  parentKey: 'pid', // 可选，默认：parentId

  // 挂载子级的属性名称，默认：children
  childrenKey: 'items',

  // 数据添加进 children 数组前的处理，可选
  transform(data) {
    // 通过浅拷贝避免修改原始数据
    // 可以在这里动态添加属性
    return { ...data, checked: false }
  },

  // 接管插入行为
  insert(siblings, node) {
    // ps: 任意层级的数据都是这样处理的
    const index = siblings.findIndex((n) => n.sort > node.sort)

    if (index === -1) {
      siblings.push(node)
    } else {
      siblings.splice(index, 0, node)
    }
  },
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

[Try in runkit](https://npm.runkit.com/@zhengxs/js.tree)

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
  childrenKey: 'items',
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

## 其他

- [tiny-tree](https://github.com/zhengxs2018/tiny-tree)

## License

- MIT
