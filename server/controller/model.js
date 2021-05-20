const { exec } = require('../database/mysql')

const DEBUG = 0
const TEST = 1
const DEFAULT_RADIUS = 6371008.8
const SPEED = [1.4, 4.2, 8.4, 13.9]

var initialFLAG = 0
var dots
var edges
var edgeNum
var firstEdge = new Array()
var nextEdge = new Array()
var mapEdge = new Array()
var mapDot = new Array()

/**
 * Manual priority queue for {id, dist}
 */
class PriorityQueue {
  // tree[0] is empty!
  constructor(strategy) {
    this.tree = []
    this.strategy = strategy
    this.length = 0
  }

  left = index => 2 * index

  right = index => 2 * index + 1

  father = index => (index - (index % 2)) / 2

  empty = () => !this.length

  push(val) {
    // val: {id: , dist: }
    this.tree[++this.length] = val
    let index = this.length
    while (index != 1 && this._compare(val.dist, this.tree[this.father(index)].dist, this.strategy)) {
      this._swap(index, this.father(index))
      index = this.father(index)
    }
  }

  pop() {
    this._swap(1, this.length)
    this.length -= 1
    this.tree.pop()
    let index = 1
    let tmp
    while (this.left(index) <= this.length) {
      if (
        this.right(index) <= this.length &&
        this._compare(this.tree[this.right(index)].dist, this.tree[this.left(index)].dist, this.strategy)
      )
        tmp = this.right(index)
      else tmp = this.left(index)
      if (this._compare(this.tree[tmp].dist, this.tree[index].dist)) {
        this._swap(tmp, index)
        index = tmp
      } else break
    }
  }

  top() {
    return this.tree[1]
  }

  clear() {
    while (!this.empty()) {
      this.pop()
    }
  }

  _swap(index1, index2) {
    let tmp = this.tree[index1]
    this.tree[index1] = this.tree[index2]
    this.tree[index2] = tmp
  }

  _compare(index1, index2, strategy) {
    // return 1 -> index1 is better than index2 under specific strategy
    return index1 < index2
  }
}

/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
const toRadians = angleInDegrees => {
  return (angleInDegrees * Math.PI) / 180
}

/**
 * calculate distance
 * @param {dot} dotA first dot
 * @param {dot} dotB second
 * @returns {number} distance between dotA and dotB (unit: m)
 */
const Dist = (dotA, dotB) => {
  const radius = DEFAULT_RADIUS
  const lat1 = toRadians(dotA.location.y)
  const lat2 = toRadians(dotB.location.y)
  const deltaLatBy2 = (lat2 - lat1) / 2
  const deltaLonBy2 = toRadians(dotB.location.x - dotA.location.x) / 2
  const a =
    Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) +
    Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) * Math.cos(lat1) * Math.cos(lat2)
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 *  calculate time cost
 * @param {dot} dotA first dot
 * @param {dot} dotB seconde dot
 * @param {edge} edge edge connecting above dots
 * @param {number} strategy strategy used to travel
 * @returns {number} time cost from dotA to dotB via edge
 */
const calcCost = (dotA, dotB, edge, strategy) => {
  let speed = SPEED[0]
  if (strategy == 3) speed = SPEED[edge.type]
  return (Dist(dotA, dotB) / speed) * edge.efficiency
}
/**
 * get ready for dijkstra algorithm
 */
const Dijkstra_initial = () => {
  const promise = new Promise((resolve, reject) => {
    if (initialFLAG == 1) {
      console.log(111111);
      resolve()
    } else {
      let sql = `select * from dottable`
      exec(sql).then(dottable => {
        dots = dottable
        let sql = `select * from edgetable`
        exec(sql).then(edgetable => {
          edges = edgetable
          initialFLAG = 1
          console.log(`Dijkstra initilized.`)
          edgeNum = edges.length
          for (var i = 0; i < edgeNum; i++) {
            edges.push({
              id: edges[i].id + edges[edgeNum - 1].id,
              type: edges[i].type,
              fromid: edges[i].toid,
              toid: edges[i].fromid,
              efficiency: edges[i].efficiency,
            })
          }
          for (var i = 0; i < edges.length; i++) {
            mapEdge[edges[i].id] = i
            nextEdge[i] = firstEdge[edges[i].fromid]
            firstEdge[edges[i].fromid] = i // 根据点的id访问边的下标
          }
          for (var i = 0; i < dots.length; i++) mapDot[dots[i].id] = i
          resolve()
        }, null)
      }, null)
    }
  }, null)
  return promise
}

/**
 *
 * @param {number} startDotID departure dot ID
 * @param {number} endDotID arrival dot ID
 * @param {number} strategy strategy to move
 * @returns {number, {Array}} {answer, path} time cost and path for current plan
 * Answer saved into pathtoLoc
 */
const Dijkstra = (startDotID, endDotID, strategy) => {
  console.log(`Running DIJ: start: ${startDotID}, end: ${endDotID}, strategy: ${strategy}`)

  var pq = new PriorityQueue(strategy)
  var befEdge = new Array()
  var dist = new Array()
  var answer = 0
  var pathToLoc = new Array()
  var nowState, nextState

  pq.push({ id: startDotID, dist: 0 })
  dist[startDotID] = 0
  while (!pq.empty()) {
    nowState = pq.top()
    pq.pop()
    if (dist[nowState.id] == undefined || dist[nowState.id] < nowState.dist) {
      if (DEBUG) console.log(`${nowState.id} discard.`)
      continue
    }
    dist[nowState.id] = nowState.dist
    if (nowState.id == endDotID) {
      if (DEBUG) console.log(`endDot detected.`)
      let index = endDotID
      let tmp
      answer = dist[endDotID]
      while (index != startDotID) {
        tmp = befEdge[index]
        pathToLoc.push({
          id: tmp.id % edges[edgeNum - 1].id,
          type: tmp.type,
          fromid: tmp.fromid,
          toid: tmp.toid,
          efficiency: tmp.efficiency,
        })
        index = befEdge[index].fromid
      }
      break
    }
    if (DEBUG) console.log(`now state: ${nowState.id}, ${nowState.dist}`)
    for (var nowEdge = firstEdge[nowState.id]; nowEdge != null; nowEdge = nextEdge[nowEdge]) {
      if (DEBUG) console.log(`next dot ${edges[nowEdge].toid}: ${dots[mapDot[edges[nowEdge].toid]].name}`)
      nextState = {
        id: edges[nowEdge].toid,
        dist:
          nowState.dist +
          calcCost(dots[mapDot[edges[nowEdge].fromid]], dots[mapDot[edges[nowEdge].toid]], edges[nowEdge], strategy),
      }
      if (dist[nextState.id] == undefined || dist[nextState.id] > nextState.dist) {
        if (DEBUG) console.log(`push ${nextState.id},${nextState.dist}`)
        befEdge[nextState.id] = edges[nowEdge]
        dist[nextState.id] = nextState.dist
        pq.push(nextState)
      }
    }
  }
  return { answer: answer, path: pathToLoc.reverse() }
}

/**
 *
 * @param {number} startDotID departure dot ID
 * @param {number} endDotID arrival dot ID
 * @param {number} strategy strategy to move
 * @returns
 */
const getShortestPath = (startDotID, endDotID, strategy) => {
  const promise = new Promise((resolve, reject) => {
    if (DEBUG) console.log(`Running ShortestPath.`)
    const dijInit = Dijkstra_initial()
    dijInit.then(() => {
      const result = Dijkstra(startDotID, endDotID, strategy)
      if (DEBUG) {
        console.log(`answer:${result.answer}`)
        console.log(result.path)
      }
      resolve({ answer: result.answer, path: result.path })
    }, null)
  }, null)
  return promise
}

/**
 *
 * @param {number} startDotID departure dot ID
 * @param {number} endDotID arrival dot ID
 * @param {[numbers]} passbysID list of dots passing by
 * @returns
 */
const getPassbyShortestPath = (startDotID, endDotID, passbysID) => {
  const promise = new Promise((resolve, reject) => {
    const dijInit = Dijkstra_initial()
    dijInit.then(() => {
      var result
      var answer = 0
      var path = new Array()
      console.log(`PassbyShortestPath`)
      passbysID.push(endDotID)
      for (var i = 0; i < passbysID.length; i++) {
        endDotID = passbysID[i]
        result = Dijkstra(startDotID, endDotID, 2) // walking
        answer += result.answer
        path = path.concat(result.path)
        startDotID = endDotID
      }
      if (DEBUG) {
        console.log(`answer:${answer}`)
        console.log(path)
      }
      resolve({ answer: answer, path: path })
    }, null)
  }, null)
  return promise
}

if (TEST) {
  console.log(`default test: \n\tf1: getShortestPath(1,13,0)\n\tf2: getPassbyShortestPath(1, 13, [23,30])`)
  // const f1 = getShortestPath(1, 13, 0)
  // f1.then(result => {
  //   console.log(result.answer)
  //   console.log(result.path)
  // })
  const f2 = getPassbyShortestPath(1, 13, [23,30])
  f2.then(result => {
    console.log(result.answer)
    console.log(result.path)
  })
}

module.exports = {
  getShortestPath,
  getPassbyShortestPath,
}

// ------  TRASH  -----

// const getShortestPath = (stardDot, endDotID, strategy) => {
//   const result = runShortestPath(stardDot, endDotID, strategy)
//   return result
// }

// async function findInBase(dot) {
//   var sql = `select * from dottable where `
//   if (dot.id != null) sql = sql + `id = ${dot.id};`
//   else sql = sql + `name = \'${dot.name}\';`
//   console.log(sql)
//   let result = exec(sql)
//   result.then(result => {
//     // console.log(result[0].location.x)
//     result = result[0]
//     dot.id = result.id
//     dot.type = result.type
//     dot.name = result.name
//     dot.loc = result.location
//   })
// }
