const { Suite } = require('benchmark')

const { arrayToTree } = require('performant-array-to-tree')

const { toTree } = require('../dist/js.tree.common')
const { toTree: toTreeWithLodash } = require('../dist/js.tree.common.lodash')

// 数据都是一样的
const bigData = require('./big-data.json')
const bigData1 = require('./big-data1.json')
const bigData2 = require('./big-data2.json')

const suite = new Suite()

suite
  .add('performant-array-to-tree', function () {
    arrayToTree(bigData)
  })
  .add('js.tree#toTree', function () {
    toTree(bigData1)
  })
  .add('js.tree#toTreeWithLodash', function () {
    toTreeWithLodash(bigData2)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
