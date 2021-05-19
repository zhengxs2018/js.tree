/// <reference types="cypress" />

import { toTree } from '../../src/index'

context('transform/toTree.js', function () {
  it('test toTree()', function () {
    const result = toTree([
      { id: 1, parentId: null },
      { id: 2, parentId: null },
      { id: 3, parentId: 1 },
    ])

    const expected = [
      { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] },
      { id: 2, parentId: null, children: [] },
    ]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(root = 0)', function () {
    const result = toTree(
      [
        { id: 1, parentId: 0 },
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
      ],
      { root: 0 }
    )

    const expected = [
      { id: 1, parentId: 0, children: [{ id: 3, parentId: 1, children: [] }] },
      { id: 2, parentId: 0, children: [] },
    ]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(root = fn)', function () {
    const result = toTree(
      [
        { id: 1, parentId: 0 },
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
      ],
      { root: (nodes) => nodes[1] || [] }
    )

    const expected = [{ id: 3, parentId: 1, children: [] }]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(idKey=sub)', function () {
    const result = toTree(
      [
        { sub: 1, parentId: null },
        { sub: 2, parentId: null },
        { sub: 3, parentId: 1 },
      ],
      { idKey: 'sub' }
    )

    const expected = [
      { sub: 1, parentId: null, children: [{ sub: 3, parentId: 1, children: [] }] },
      { sub: 2, parentId: null, children: [] },
    ]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(parentKey=pid)', function () {
    const result = toTree(
      [
        { id: 1, pid: null },
        { id: 2, pid: null },
        { id: 3, pid: 1 },
      ],
      { parentKey: 'pid' }
    )

    const expected = [
      { id: 1, pid: null, children: [{ id: 3, pid: 1, children: [] }] },
      { id: 2, pid: null, children: [] },
    ]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(childrenKey=items)', function () {
    const result = toTree(
      [
        { id: 1, parentId: null },
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
      ],
      { childrenKey: 'items' }
    )

    const expected = [
      { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] },
      { id: 2, parentId: null, items: [] },
    ]

    expect(result).to.deep.equal(expected)
  })

  it('test toTree(transform)', function () {
    type Row = { id: number; parentId: number | null }

    const transform = (row: Row) => {
      if (row.id === 2) return
      return { ...row, test: true }
    }
    const result = toTree(
      [
        { id: 1, parentId: null },
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
      ],
      { transform }
    )

    const expected = [
      {
        id: 1,
        parentId: null,
        test: true,
        children: [{ id: 3, parentId: 1, children: [], test: true }],
      },
    ]

    expect(result).to.deep.equal(expected)
  })
})
