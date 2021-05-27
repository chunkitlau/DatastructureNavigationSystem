const { exec } = require('../database/mysql')
const { SBplans, SBterminal, RWterminal } = require('../config/schoolBusTimetable')
const { DIST_BETWEEN_CAMPUS, BUS_TIME, RAILWAY_TIME, DEFAULT_RADIUS, SPEED } = require('../config/constants')

const DEBUG = 0
const TEST = 0
const DEBUG_DETAIL = 0

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
  constructor() {
    this.tree = []
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
    while (index != 1 && this._compare(val.dist, this.tree[this.father(index)].dist)) {
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
        this._compare(this.tree[this.right(index)].dist, this.tree[this.left(index)].dist)
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

  _compare(index1, index2) {
    // return 1 -> index1 is better than index2
    return index1 < index2
  }
}

/**
 * Converts degrees to radians.
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
 * strategy 0, 1, 2: walk; strategy 3: use transportation
 * strategy 0: least distance
 * strategy 1: least time (with efficiency)
 * strategy 2: least distance (with passbys)
 * strategy 3: least time (with transportation and efficiency)
 */
const calcCost = (dotA, dotB, edge, strategy) => {
  let speed
  let efficiency = 1
  if (strategy == 0 || strategy == 2) speed = 1
  else if (strategy == 1) speed = SPEED[0]
  else speed = SPEED[edge.type]
  if (strategy == 1 || strategy == 3) efficiency = edge.efficiency
  return (Dist(dotA, dotB) / speed) * efficiency
}
/**
 * get ready for dijkstra algorithm
 */
const Dijkstra_initial = () => {
  const promise = new Promise((resolve, reject) => {
    if (initialFLAG == 1) {
      resolve()
    } else {
      let sql = `select * from dottable`
      exec(sql).then(dottable => {
        dots = dottable
        let sql = `select * from edgetable`
        exec(sql).then(edgetable => {
          edges = edgetable
          initialFLAG = 1
          if (DEBUG) console.log(`Dijkstra initilized.`)
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
 * @returns {object{number, {Array}}} {answer, path} time cost and path for current plan
 * Answer saved into pathtoLoc
 */
const Dijkstra = (startDotID, endDotID, strategy) => {
  if (DEBUG) console.log(`Running DIJ: start: ${startDotID}, end: ${endDotID}, strategy: ${strategy}`)

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
          dist: dist[tmp.toid] - dist[tmp.fromid],
        })
        index = befEdge[index].fromid
      }
      break
    }
    if (DEBUG_DETAIL) console.log(`now state: ${nowState.id}, ${nowState.dist}`)
    for (var nowEdge = firstEdge[nowState.id]; nowEdge != null; nowEdge = nextEdge[nowEdge]) {
      // if (DEBUG_DETAIL) console.log(`next dot ${edges[nowEdge].toid}: ${dots[mapDot[edges[nowEdge].toid]].name}`)
      nextState = {
        id: edges[nowEdge].toid,
        dist:
          nowState.dist +
          calcCost(dots[mapDot[edges[nowEdge].fromid]], dots[mapDot[edges[nowEdge].toid]], edges[nowEdge], strategy),
      }
      if (dist[nextState.id] == undefined || dist[nextState.id] > nextState.dist) {
        if (DEBUG_DETAIL) console.log(`push ${nextState.id},${nextState.dist}`)
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
 * @param {number} startDotID start dot id
 * @param {number} endDotID end dot id
 * @returns 0: needn't across, -1: Main -> ShaHe, 1: ShaHe -> Main
 */
const across = (startDotID, endDotID) => {
  const dist = Dist(dots[mapDot[startDotID]], dots[mapDot[endDotID]])
  const dist1 = Dist(dots[mapDot[startDotID]], dots[0]) //
  return dist < DIST_BETWEEN_CAMPUS ? 0 : dist1 < DIST_BETWEEN_CAMPUS ? 1 : -1
}

/**
 *
 * @param {dot} dotX start dot
 * @returns {[object]} bus station dots ID sorted by distance from start dot
 */
const getBusStationID = dotX => {
  function sortByDistance(dotAID, dotBID) {
    return Dist(dots[mapDot[dotAID]], dotX) - Dist(dotX, dots[mapDot[dotBID]])
  }
  result = SBterminal.sort(sortByDistance)
  if (DEBUG) {
    console.log(`Bus station ID list:`)
    console.log(result)
  }
  return result
}

/**
 *
 * @param {dot} dotX start dot
 * @returns {[object]} railway station dots ID sorted by distance from start dot
 */
const getRailwayStationID = dotX => {
  function sortByDistance(dotAID, dotBID) {
    return Dist(dots[mapDot[dotAID]], dotX) - Dist(dotX, dots[mapDot[dotBID]])
  }
  result = RWterminal.sort(sortByDistance)
  if (DEBUG) {
    console.log(`Railway station ID list:`)
    console.log(result)
  }
  return result
}

/**
 *
 * @param {time} time start time
 * @param {number} sec seconds
 * @returns {time} time after sec
 */
const getTimeAdd = (time, sec) => {
  return {
    hour:
      (time.hour +
        Math.floor(sec / 3600) +
        Math.floor((time.minute + Math.floor((sec % 3600) / 60) + Math.floor((time.second + (sec % 60)) / 60)) / 60)) %
      24,
    minute: (time.minute + Math.floor((sec % 3600) / 60) + Math.floor((time.second + (sec % 60)) / 60)) % 60,
    second: (time.second + (sec % 60)) % 60,
  }
}

/**
 *
 * @param {number} startDotID departure dot ID
 * @param {number} endDotID arrival dot ID
 * @param {number} strategy strategy to move
 */
const getShortestPath = (startDotID, endDotID, strategy, startTime) => {
  const promise = new Promise((resolve, reject) => {
    if (DEBUG) console.log(`Running ShortestPath.`)
    const dijInit = Dijkstra_initial()
    dijInit.then(() => {
      var result
      var crossFlag = across(startDotID, endDotID)
      if (crossFlag) {
        // across campus navigation
        var busStation = getBusStationID(dots[mapDot[startDotID]])
        var railStation = getRailwayStationID(dots[mapDot[startDotID]])
        const busResult1 = Dijkstra(startDotID, busStation[0], strategy)
        const busResult2 = Dijkstra(busStation[1], endDotID, strategy)
        const railResult1 = Dijkstra(startDotID, railStation[0], strategy)
        const railResult2 = Dijkstra(railStation[1], endDotID, strategy)
        const getWaitingTime = currentTime => {
          for (let i = 0; i < SBplans.length; i++) {
            if (SBplans[i].direction != crossFlag) continue
            if (
              SBplans[i].hour > currentTime.hour ||
              (SBplans[i].hour == currentTime.hour && SBplans[i].minute > currentTime.minute)
            ) {
              return (
                (SBplans[i].hour - currentTime.hour) * 3600 +
                (SBplans[i].minute - currentTime.minute) * 60 -
                currentTime.second
              )
            }
          }
        }
        bus_result = {
          answer:
            busResult1.answer +
            getWaitingTime(getTimeAdd(startTime, Math.floor(busResult1.answer))) +
            BUS_TIME +
            busResult2.answer,
          path: busResult1.path.concat(busResult2.path),
        }
        rail_result = {
          answer: railResult1.answer + RAILWAY_TIME + railResult2.answer,
          path: railResult1.path.concat(railResult2.path),
        }
        result = bus_result.answer < rail_result.answer ? bus_result : rail_result
        if (DEBUG) {
          console.log(`crossFlag: ${crossFlag}`)
          console.log(`By bus:`)
          console.log(bus_result)
          console.log(`By railway:`)
          console.log(rail_result)
        }
      } else result = Dijkstra(startDotID, endDotID, strategy)
      // console.log(result.path)
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
 * @description start dot and end dot must be in SAME campus
 */
const getPassbyShortestPath = (startDotID, endDotID, passbysID) => {
  const promise = new Promise((resolve, reject) => {
    const dijInit = Dijkstra_initial()
    dijInit.then(() => {
      var result
      var answer = 0
      var path = new Array()
      if (DEBUG) console.log(`PassbyShortestPath`)
      passbysID.push(endDotID)
      for (var i = 0; i < passbysID.length; i++) {
        endDotID = passbysID[i]
        result = Dijkstra(startDotID, endDotID, 2) // walking
        answer += result.answer
        path = path.concat(result.path)
        startDotID = endDotID
      }
      resolve({ answer: answer, path: path })
    }, null)
  }, null)
  return promise
}

if (TEST) {
  // Dijkstra_initial().then(() => {
  //   // getBusStationID(dots[99])
  //   // getRailwayStationID(dots[0])
  // })
  // console.log(getTimeAdd({ hour: 8, minute: 20, second: 50 }, 6732))
  // console.log(`default test: \n\tf1: getShortestPath(1,13,0)\n\tf2: getPassbyShortestPath(1, 13, [23,30])`)
  const f1 = getShortestPath(1, 69, 0)
  f1.then(result => {
    console.log(result.answer)
    console.log(result.path)
  })
  // const f2 = getPassbyShortestPath(1, 13, [23,30])
  // f2.then(result => {
  //   console.log(result.answer)
  //   console.log(result.path)
  // })
}

module.exports = {
  getShortestPath,
  getPassbyShortestPath,
}
