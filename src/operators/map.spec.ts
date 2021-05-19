import { deepStrictEqual } from 'assert'

import { map } from './map'

describe('operators/filter.js', function () {
  it('test filter()', function () {
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

    const result = map(data, (node) => {
      if (node.title === '财务') {
        return { ...node, children: [] }
      }
      node.title = node.title + '测试'
      return node
    })

    const expected = [
      {
        title: '财务',
        children: [],
      },
      {
        title: '站点设置测试',
        children: [{ title: '菜单维护测试' }, { title: '角色维护测试' }],
      },
    ]

    deepStrictEqual(result, expected)
  })

  it('test map(childrenKey="items")', function () {
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

    const result = map(
      data,
      (node) => {
        if (node.title === '财务') {
          return { ...node, items: [] }
        }
        node.title = node.title + '测试'
        return node
      },
      'items'
    )

    const expected = [
      {
        title: '财务',
        items: [],
      },
      {
        title: '站点设置测试',
        items: [{ title: '菜单维护测试' }, { title: '角色维护测试' }],
      },
    ]

    deepStrictEqual(result, expected)
  })
})
