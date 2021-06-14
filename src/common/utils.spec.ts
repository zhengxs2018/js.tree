import { deepStrictEqual } from 'assert'

import { parse } from './parse'
import { exporter } from './utils'

describe('common/utils.js', function () {
  it('test exporter()', function () {
    const result = exporter(
      parse([
        { id: 1, parentId: null },
        { id: 2, parentId: null },
        { id: 3, parentId: 1 },
      ])
    )

    const expected = [
      { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] },
      { id: 2, parentId: null, children: [] },
    ]

    deepStrictEqual(result, expected)
  })

  it('test exporter(root = 0)', function () {
    const result = exporter(
      parse([
        { id: 1, parentId: 0 },
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
      ]),
      0
    )

    const expected = [
      { id: 1, parentId: 0, children: [{ id: 3, parentId: 1, children: [] }] },
      { id: 2, parentId: 0, children: [] },
    ]

    deepStrictEqual(result, expected)
  })

  it('test exporter(root = fn)', function () {
    type Row = {
      id: number
      parentId: number
    }

    const result = exporter<Row>(
      parse<Row>(
        [
          { id: 1, parentId: 0 },
          { id: 2, parentId: 0 },
          { id: 3, parentId: 1 },
        ]
      ),
      (nodes => nodes[1])
    )

    const expected = [{ id: 3, parentId: 1, children: [] }]

    deepStrictEqual(result, expected)
  })

  it('test exporter(returnValue=nil)', function () {
    type Row = {
      id: number
      parentId: number
    }
    const result = parse<Row>(
      [
        { id: 1, parentId: 0 },
        { id: 2, parentId: 0 },
        { id: 3, parentId: 1 },
      ]
    )

    deepStrictEqual(exporter<Row>(result, 9), [])

    deepStrictEqual(exporter<Row>(result, (() => null)), [])

    deepStrictEqual(exporter<Row>(result, (() => undefined)), [])
  })
})
