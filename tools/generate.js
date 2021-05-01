const { join } = require('path')
const { writeFileSync } = require('fs')

const { mock, Random } = require('better-mock')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function makeItem(parentId, depth) {
  const menuItem = mock({
    id: Random.uuid(),
    parentId,
    group: Random.ctitle(),
    groupId: Random.uuid(),
    title: Random.ctitle(),
    icon: Random.image('20x20'),
    url: Random.url('https'),
    hidden: Random.boolean(),
    device: Random.pick(['web', 'desktop', 'mobile', 'app', 'mp']),
    remark: Random.cparagraph(),
    createdAt: Random.datetime(),
    createdBy: Random.cname(),
    updatedAt: Random.datetime(),
    updatedBy: Random.cname()
  })

  writeFileSync(join(__dirname, 'benchmarks/big-data.json'), JSON.stringify(menuItem) + ',\n', {
    flag: 'a+'
  })

  if (depth > 0) {
    await sleep(400)
    await makeList(Random.integer(0, 12), menuItem.id, depth - 1)
  }
}

async function makeList(size, parentId, depth) {
  if (depth === 0) return

  const queue = []
  for (let i = 0; i < size; i++) {
    queue.push(makeItem(parentId, depth))
  }

  await Promise.all(queue)
}

makeList(10, null, 6)
