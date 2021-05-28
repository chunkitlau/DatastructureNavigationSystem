var express = require('express')
var router = express.Router()
const {
  getCurrentTime,
  getCurrentState,
  createFacility,
  getFacility,
  updateFacility,
  getFacilitys,
  getFacilitysAround,
  getFacilitysAll,
  deleteFacility,
  createRoad,
  getRoad,
  getRoads,

  queryToNum,
  addVehiclesTimetable,
  updateVehiclesTimetable,
  deleteVehiclesTimetable,

  getLog,
} = require('../controller/utils')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getShortestPath, getPassbyShortestPath } = require('../controller/model.js')
const { SBplans } = require('../config/schoolBusTimetable')

/* GET api listing. */
router.get('/', function (req, res, next) {
  res.send(`
    api list:<br> (following 'ip:port/api')
    
    post   /facility?name=&type=&position=&description=<br>
    get    /facilitys?description=<br>
    get    /facility<br>
    put    /facility?id=&name=&type=&description=<br>
    get    /facilitys/around?distance=<br>
    get    /facilitys/all<br>
    delete /facility?id=<br>
    post   /road?type=&fromid=&toid=&efficiency=<br>
    get    /roads<br>
    get    /road<br>
    post   /plan?startid=&endid=&type=<br>
    get    /current/time<br>
    get    /current/state<br>
    get    /timetable/schoolbus<br>
    

    get    /vehicles/timetable<br>
    post   /vehicles/timetable<br>
    put    /vehicles/timetable<br>
    delete /vehicles/timetable<br>
    get    /log<br>
  `)
})

router.get('/facility', function (req, res, next) {
  const id = req.query.id
  const result = getFacility(id)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.get('/facilitys', function (req, res, next) {
  const desc = req.query.description || ''
  const result = getFacilitys(desc)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.get('/facilitys/around', function (req, res, next) {
  const nowlocation = req.query.position
  const distance = req.query.distance || 50
  const result = getFacilitysAround(nowlocation, distance)
  return result.then(result => {
    for (var i = 0; i < result.length; i++) result[i].dist = result[i].dist.toFixed(2)
    res.json(new SuccessModel(result))
  })
})

router.get('/facilitys/all', function (req, res, next) {
  const result = getFacilitysAll()
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.put('/facility', function (req, res, next) {
  const id = req.query.id
  const name = req.query.name
  const type = req.query.type
  const description = req.query.description || ''
  const result = updateFacility(id, name, type, description)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.post('/facility', function (req, res, next) {
  const position = req.query.position
  const name = req.query.name || ''
  const type = req.query.type || 0
  const dscpn = req.query.description || ''
  console.log(position)
  const result = createFacility(name, type, position, dscpn)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.delete('facility', function (req, res, next) {
  const id = req.query.id
  const result = deleteFacility(id)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.get('/road', function (req, res, next) {
  const id = req.query.id
  const result = getRoad(id)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.get('/roads', function (req, res, next) {
  const result = getRoads()
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.post('/road', function (req, res, next) {
  const fromid = req.query.fromid
  const toid = req.query.toid
  const type = req.query.type
  const effi = req.query.efficiency || 1.0
  const result = createRoad(fromid, toid, type, effi)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.post('/plan', function (req, res, next) {
  const startid = parseInt(req.query.startid)
  const endid = parseInt(req.query.endid)
  const type = parseInt(req.query.type)
  const passby = req.body || null
  const starttime = { hour: parseInt(req.query.hour), minute: parseInt(req.query.minute), second: parseInt(req.query.second) }
  if (passby != null) for (let i = 0; i < passby.length; i++) passby[i] = parseInt(passby[i].value)
  var result
  if (type == 2) result = getPassbyShortestPath(startid, endid, passby)
  else result = getShortestPath(startid, endid, type, starttime)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
})

router.get('/current/time', function (req, res, next) {
  const result = getCurrentTime()
  res.json(new SuccessModel(result))
})

router.get('/currnet/state', function (req, res, next) {
  const result = getCurrentState()
  res.json(new SuccessModel(result))
})

router.get('/timetable/schoolbus', function (req, res, nex) {
  const result = SBplans
  res.json(new SuccessModel(result))
})

module.exports = router

/* ------ TRASH ------ */

router.post('/vehicles/timetable', function (req, res, next) {
  const number = queryToNum(req.query.number)
  const type = req.query.type || ''
  const departure = req.query.departure || ''
  const departureTime = queryToNum(req.query.departuretime)
  const arrival = req.query.arrival || ''
  const arrivalTime = queryToNum(req.query.arrivaltime)
  const risk = queryToNum(req.query.risk)
  const result = addVehiclesTimetable(number, type, departure, departureTime, arrival, arrivalTime, risk)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
  //!
})

router.put('/vehicles/timetable', function (req, res, next) {
  const number = queryToNum(req.query.number)
  const type = req.query.type || ''
  const departure = req.query.departure || ''
  const departureTime = queryToNum(req.query.departuretime)
  const arrival = req.query.arrival || ''
  const arrivalTime = queryToNum(req.query.arrivaltime)
  const risk = queryToNum(req.query.risk)
  const result = updateVehiclesTimetable(number, type, departure, departureTime, arrival, arrivalTime, risk)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
  //!
})

router.delete('/vehicles/timetable', function (req, res, next) {
  const number = queryToNum(req.query.number)
  const result = deleteVehiclesTimetable(number)
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
  //!
})

router.get('/log', function (req, res, next) {
  const result = getLog()
  return result.then(result => {
    res.json(new SuccessModel(result))
  })
  //!
})

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  res.json({
    errno: 0,
    data: {
      username,
      password,
    },
  })
})
