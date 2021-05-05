import { deepStrictEqual } from 'assert'

import { toRows } from './toRows'

describe('transform/toRows.js', function () {
  it('test toRows()', function () {
    const result = toRows([
      { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] },
      { id: 2, parentId: null, children: [] }
    ])

    const expected = [
      { id: 2, parentId: null },
      { id: 1, parentId: null },
      { id: 3, parentId: 1 }
    ]

    deepStrictEqual(result, expected)
  })

  it('test toRows(children=items)', function () {
    const result = toRows(
      [
        { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] },
        { id: 2, parentId: null, items: [] }
      ],
      'items'
    )

    const expected = [
      { id: 2, parentId: null },
      { id: 1, parentId: null },
      { id: 3, parentId: 1 }
    ]
    deepStrictEqual(result, expected)
  })
})
