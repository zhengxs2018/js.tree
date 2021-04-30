import { deepStrictEqual } from 'power-assert'

import { toTree } from './toTree'

describe('transform/toTree.js', function () {
  it('test toTree(root?)', function () {
    const result = toTree([
      { id: 2, parentId: null },
      { id: 3, parentId: 1 },
      { id: 1, parentId: null }
    ])

    const expected = [
      { id: 2, parentId: null, children: [] },
      { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(root = 0)', function () {
    const result = toTree(
      [
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
        { id: 1, parentId: 0 }
      ],
      { root: 0 }
    )

    const expected = [
      { id: 2, parentId: 0, children: [] },
      { id: 1, parentId: 0, children: [{ id: 3, parentId: 1, children: [] }] }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(root = fn)', function () {
    const result = toTree(
      [
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
        { id: 1, parentId: 0 }
      ],
      { root: (nodes) => nodes[1] || [] }
    )

    const expected = [{ id: 3, parentId: 1, children: [] }]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(idKey=sub)', function () {
    const result = toTree(
      [
        { sub: 2, parentId: null },
        { sub: 3, parentId: 1 },
        { sub: 1, parentId: null }
      ],
      { idKey: 'sub' }
    )

    const expected = [
      { sub: 2, parentId: null, children: [] },
      { sub: 1, parentId: null, children: [{ sub: 3, parentId: 1, children: [] }] }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(parentKey=pid)', function () {
    const result = toTree(
      [
        { id: 2, pid: null },
        { id: 3, pid: 1 },
        { id: 1, pid: null }
      ],
      { parentKey: 'pid' }
    )

    const expected = [
      { id: 2, pid: null, children: [] },
      { id: 1, pid: null, children: [{ id: 3, pid: 1, children: [] }] }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(childrenKey=items)', function () {
    const result = toTree(
      [
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
        { id: 1, parentId: null }
      ],
      { childrenKey: 'items' }
    )

    const expected = [
      { id: 2, parentId: null, items: [] },
      { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })

  it('test toTree(transform)', function () {
    type Row = { id: number; parentId: number | null }

    const transform = (row: Row) => {
      if (row.id === 2) return
      return { ...row, test: true }
    }
    const result = toTree(
      [
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
        { id: 1, parentId: null }
      ],
      { transform }
    )

    const expected = [
      {
        id: 1,
        parentId: null,
        test: true,
        children: [{ id: 3, parentId: 1, children: [], test: true }]
      }
    ]

    deepStrictEqual(result, expected, '数据不一致')
  })
})
