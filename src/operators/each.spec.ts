import { deepStrictEqual } from 'assert'

import _ from 'lodash'

import { each } from './each'

describe('operators/each.js', function () {
  it('test each()', function () {
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

    const expected: string[] = [
      '财务',
      '收入流失',
      '财务设置',
      '站点设置',
      '菜单维护',
      '角色维护',
    ]

    const result: string[] = []

    each(data, (node) => {
      result.push(node.title)
    })

    deepStrictEqual(result, expected)
  })

  it('test each((node, index) => void)', function () {
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

    const expected: string[] = [
      '0 财务',
      '0 收入流失',
      '1 财务设置',
      '1 站点设置',
      '0 菜单维护',
      '1 角色维护',
    ]

    const result: string[] = []

    each(data, (node, index) => {
      result.push(`${index} ${node.title}`)
    }, 'items')

    deepStrictEqual(result, expected)
  })

  it('test each((node, index, parents) => void)', function () {
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

    const expected: string[] = [
      '财务',
      '财务-收入流失',
      '财务-财务设置',
      '站点设置',
      '站点设置-菜单维护',
      '站点设置-角色维护',
    ]

    const result: string[] = []

    each(data, (node, _, parents) => {
      result.push(parents.concat(node).map(n => n.title).join('-'))
    }, 'items')

    deepStrictEqual(result, expected)
  })

  it('test each(childrenKey="items")', function () {
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

    const expected: string[] = [
      '财务',
      '收入流失',
      '财务设置',
      '站点设置',
      '菜单维护',
      '角色维护',
    ]

    const result: string[] = []

    each(data, (node) => {
      result.push(node.title)
    }, 'items')

    deepStrictEqual(result, expected)
  })

  it('test each((node) => true)', function () {
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

    const expected: string[] = [
      '站点设置',
      '菜单维护',
      '角色维护',
    ]

    const result: string[] = []

    each(data, (node) => {
      if (node.title === '财务') {
        return true
      }

      result.push(node.title)
    }, 'items')

    deepStrictEqual(result, expected)
  })
})
