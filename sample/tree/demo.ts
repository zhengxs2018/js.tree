import type { Row, Node, None, ID } from '../../src'
import { Tree } from './tree'

interface Item extends Row {
  id: number
  parentId: None | ID
  title: string
}

const data: Item[] = [
  {
    id: 10000,
    parentId: null,
    title: '财务',
  },
  {
    id: 11000,
    parentId: 10000,
    title: '财务设置',
  },
  {
    id: 20000,
    parentId: null,
    title: '站点设置',
  },
  {
    id: 21000,
    parentId: 20000,
    title: '菜单维护',
  },
  {
    id: 22000,
    parentId: 20000,
    title: '角色维护',
  },
]

const tree = Tree.load<Node & Item>(data)

// 获取一级及其子级数据
console.log(tree.root())

// 获取指定节点
console.log(tree.get(11000)?.title === '财务设置')

// 获取上级节点
console.log(tree.parent(11000) === data[0])

// 获取上级，直到最顶级
console.log(tree.parents(11000)[0] === data[0])
