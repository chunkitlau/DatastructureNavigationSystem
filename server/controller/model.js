const { exec } = require('../database/mysql')

const DEBUG = 0
const DEFAULT_RADIUS = 6371008.8

/**
 * Manual priority queue for {id, dist}
 */
class PriorityQueue {
  // tree[0] is empty!
  constructor(method) {
    this.tree = []
    this.method = method
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
    while (index != 1 && this._compare(val.dist, this.tree[this.father(index)].dist, this.method)) {
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
        this._compare(this.tree[this.right(index)].dist, this.tree[this.left(index)].dist, this.method)
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
  _swap(index1, index2) {
    let tmp = this.tree[index1]
    this.tree[index1] = this.tree[index2]
    this.tree[index2] = tmp
  }
  _compare(index1, index2, method) {
    // return 1 -> index1 is better than index2 under specific method
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
 * @returns {number} time cost from dotA to dotB via edge
 */
const calcCost = (dotA, dotB, edge) => {
  return Dist(dotA, dotB) * edge.efficiency
}
/**
 *
 * @param {number} startDotID departure dot ID
 * @param {number} endDotID arrival dot ID
 * @param {number} method method to move
 * @returns
 */
function runShortestPath(startDotID, endDotID, method) {
  // id of start dot and end dot, method to use when value distance
  const promise = new Promise((resolve, reject) => {
    let sql = `select * from dottable`
    exec(sql).then(dots => {
      let sql = `select * from edgetable`
      edges = exec(sql)
      edges.then(edges => {
        var answer
        var pathToLoc = new Array()
        var pq = new PriorityQueue(method)
        var firstEdge = new Array()
        var nextEdge = new Array()
        var befEdge = new Array()
        var dist = new Array()
        var mapEdge = new Array()
        var mapDot = new Array()
        let nowState, nextState, nowEdge
        const E = edges.length
        for (var i = 0; i < E; i++) {
          edges.push({
            id: edges[i].id + edges[E - 1].id,
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
        for (var i = 0; i < dots.length; i++) {
          mapDot[dots[i].id] = i
        }

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
                id: tmp.id % edges[E - 1].id,
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
          for (nowEdge = firstEdge[nowState.id]; nowEdge != null; nowEdge = nextEdge[nowEdge]) {
            if (DEBUG) console.log(`next dot ${edges[nowEdge].toid}: ${dots[mapDot[edges[nowEdge].toid]].name}`)
            nextState = {
              id: edges[nowEdge].toid,
              dist:
                nowState.dist +
                calcCost(
                  dots[mapDot[edges[nowEdge].fromid]],
                  dots[mapDot[edges[nowEdge].toid]],
                  edges[nowEdge],
                  method
                ),
            }
            if (dist[nextState.id] == undefined || dist[nextState.id] > nextState.dist) {
              if (DEBUG) console.log(`push ${nextState.id},${nextState.dist}`)
              befEdge[nextState.id] = edges[nowEdge]
              dist[nextState.id] = nextState.dist
              pq.push(nextState)
            }
          }
        }
        resolve({ answer: answer, path: pathToLoc.reverse() })
      }, null)
    }, null)
    return exec(sql)
  })
  return promise
}

const getShortestPath = (stardDot, endDotID, method) => {
  const result = runShortestPath(stardDot, endDotID, method)
  return result
}

if (DEBUG) {
  console.log(`default test: (6,26,0)`)
  const f = getShortestPath(6, 26, 0)
}

module.exports = {
  getShortestPath,
}

// ------  TRASH  -----
async function findInBase(dot) {
  var sql = `select * from dottable where `
  if (dot.id != null) sql = sql + `id = ${dot.id};`
  else sql = sql + `name = \'${dot.name}\';`
  console.log(sql)
  let result = exec(sql)
  result.then(result => {
    // console.log(result[0].location.x)
    result = result[0]
    dot.id = result.id
    dot.type = result.type
    dot.name = result.name
    dot.loc = result.location
  })
}
