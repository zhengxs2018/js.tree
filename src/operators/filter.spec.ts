import { deepStrictEqual } from 'assert'

import { filter } from './filter'

describe('operators/filter.js', function () {
  it('test filter()', function () {
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
    const result = filter(data, (node) => {
      return node.title.indexOf('设置') > -1
    })

    const expected = [
      {
        title: '财务',
        children: [{ title: '财务设置' }]
      },
      {
        title: '站点设置',
        children: [{ title: '菜单维护' }, { title: '角色维护' }]
      }
    ]

    deepStrictEqual(result, expected)
  })

  it('test filter(childrenKey="items")', function () {
    const data = [
      {
        title: '财务',
        items: [{ title: '收入流失' }, { title: '财务设置' }]
      },
      {
        title: '站点设置',
        items: [{ title: '菜单维护' }, { title: '角色维护' }]
      }
    ]

    // 如果不是 children 属性，可以通过第二个参数指定，可选
    const result = filter(
      data,
      (node) => {
        return node.title.indexOf('设置') > -1
      },
      'items'
    )

    const expected = [
      {
        title: '财务',
        items: [{ title: '财务设置' }]
      },
      {
        title: '站点设置',
        items: [{ title: '菜单维护' }, { title: '角色维护' }]
      }
    ]

    deepStrictEqual(result, expected)
  })
})
