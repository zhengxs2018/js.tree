import { deepStrictEqual } from 'assert'

import { exclude } from './exclude'

describe('operators/exclude.js', function () {
  it('test exclude()', function () {
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

    const result = exclude(data, (node) => {
      return node.title.includes('财务') || node.title.includes('角色')
    })

    const expected = [
      {
        title: '站点设置',
        children: [{ title: '菜单维护' }],
      },
    ]

    deepStrictEqual(result, expected)
  })

  it('test exclude(childrenKey="items")', function () {
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

    const result = exclude(
      data,
      (node) => {
        return node.title.includes('财务') || node.title.includes('角色')
      },
      'items'
    )

    const expected = [
      {
        title: '站点设置',
        items: [{ title: '菜单维护' }],
      },
    ]

    deepStrictEqual(result, expected)
  })
})
