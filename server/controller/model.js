const e = require('express')
const { exec } = require('../database/mysql')

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
    let index = 0
    let tmp
    while (this.left(index) <= this.length) {
      if (this.right(index) <= this.length && this._compare(this.left(index), this.right(index)))
        tmp = this.right(index)
      else this.left(index)
      if (this._compare(tmp, index)) {
        _swap(index, tmp)
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

const calcCost = (dotA, dotB, edge) => {
  // calc the cost to go through edge with method
  const Dist = (dotA, dotB) => 1
  // Math.sqrt(Math.pow(dotA.location.x - dotB.location.x, 2) + Math.pow(dotA.location.y - dotB.location.y, 2))
  // wgs84Sphere.haversineDistance([dotA.location.x, dotA.location.y],[dotB.location.x, dotB.location.y]);
  return Dist(dotA, dotB) * edge.efficiency
}

function runShortestPath(startDotID, endDotID, method) {
  // id of start dot and end dot, method to use when value distance
  const promise = new Promise((resolve, reject) => {
    let sql = `select * from dottable`
    exec(sql).then(dots => {
      let sql = `select * from edgetable`
      edges = exec(sql)
      console.log(`1:${dots[1].location.x},${dots[1].location.y}`)
      edges.then(edges => {
        var answer
        var pathToLoc = new Array()
        var pq = new PriorityQueue(method)
        var firstEdge = new Array(dots.length)
        var nextEdge = new Array(edges.length)
        var befEdge = new Array(dots.length)
        var dist = new Array(dots.length)
        let nowState, nextState, nowEdgeID
        let n = edges.length
        for (var i = 0; i < n; i++) {
          edges.push({
            id: edges[i].id,
            type: edges[i].type,
            fromid: edges[i].toid,
            toid: edges[i].fromid,
            efficiency: edges[i].efficiency,
          })
        }
        for (var i = 0; i < edges.length; i++) {
          nextEdge[i] = firstEdge[edges[i].fromid]
          firstEdge[edges[i].fromid] = i
        }

        pq.push({ id: startDotID, dist: 0 })
        dist[startDotID] = 0
        while (!pq.empty()) {
          nowState = pq.top()
          pq.pop()
          if (dist[nowState.id] == undefined || dist[nowState.id] < nowState.dist) continue
          dist[nowState.id] = nowState.dist
          if (nowState.id == endDotID) {
            console.log(`endDot detected.`)
            let index = endDotID
            answer = dist[endDotID]
            while (index != startDotID) {
              pathToLoc.push(befEdge[index])
              index = befEdge[index].fromid
            }
            break
          }
          console.log(`now state: ${nowState.id}, ${nowState.dist}`)
          for (nowEdgeID = firstEdge[nowState.id]; nowEdgeID != null; nowEdgeID = nextEdge[nowEdgeID]) {
            console.log(`next dot ${edges[nowEdgeID].toid}: ${dots[edges[nowEdgeID].toid].name}`)
            nextState = {
              id: edges[nowEdgeID].toid,
              dist:
                nowState.dist +
                calcCost(dots[edges[nowEdgeID].fromid], dots[edges[nowEdgeID].toid], edges[nowEdgeID], method),
            }
            if (dist[nextState.id] == undefined || dist[nextState.id] > nextState.dist) {
              console.log(`push ${nextState.id},${nextState.dist}`)
              befEdge[nextState.id] = edges[nowEdgeID]
              dist[nextState.id] = nextState.dist
              pq.push(nextState)
            }
          }
        }
        console.log(`answer: ${answer}, path: ${pathToLoc.reverse()}`)
        resolve({ answer: answer, path: pathToLoc.reverse() })
      }, null)
    }, null)
    return exec(sql)
  })
  return promise
}

const getShortestPath = (stardDot, endDotID, method) => {
  const result = runShortestPath(stardDot, endDotID, method)
  result.then(result => {
    console.log(`3:${result.answer}`)
    console.log(result.path)
  })
}

const f = getShortestPath(13, 18, 0)

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
