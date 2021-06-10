const { exec } = require('../database/mysql')

var cateenTable = []
var flowInitFlag = 0

const cmpCanteen = (a, b) => {
  return a.count - b.count
}
const getCanteens = () => {
  const promise = new Promise((resolve, reject) => {
    if (!flowInitFlag) {
      const sql = "select * from dottable where name REGEXP '食堂' and type != 0"
      exec(sql).then(result => {
        for (var i = 0; i < result.length; i++) {
          cateenTable[i] = result[i]
          cateenTable[i].count = Math.floor(Math.random() * 100)
        }
        flowInitFlag = 1
        cateenTable.sort(cmpCanteen)
        resolve(cateenTable)
      }, null)
    } else {
      resolve(cateenTable)
    }
  }, null)
  return promise
}

const addCanteenFlow = ID => {
  for (var i = 0; i < cateenTable.length; i++)
    if (cateenTable[i].id == ID) {
      cateenTable[i].count++
      break
    }
  cateenTable.sort(cmpCanteen)
}

module.exports = {
  getCanteens,
  addCanteenFlow,
}
