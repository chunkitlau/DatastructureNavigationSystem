var express = require('express');
var router = express.Router();
const {
  createFacility,
  getFacility,
  getFacilitys,

  queryToNum,
  getCurrentTime,
  getCurrentStatus,
  updateCurrentStatus,
  getTravelersStatus,
  addTravelersPlans,
  updateTravelersPlans,
  deleteTravelersPlans,
  getVehiclesTimetable,
  addVehiclesTimetable,
  updateVehiclesTimetable,
  deleteVehiclesTimetable,
  getVehiclesRisk,
  addVehiclesRisk,
  updateVehiclesRisk,
  deleteVehiclesRisk,
  getCitiesRisk,
  addCitiesRisk,
  updateCitiesRisk,
  deleteCitiesRisk,
  getLog
} = require('../controller/utils')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/* GET api listing. */
router.get('/', function (req, res, next) {
  res.send(`
    api list:<br> (following 'ip:port/api')
    
    post   /facility?name=&type=&position=&description=<br>
    get    /facilitys<br>
    get    /facility<br>

    get    /current/time<br>
    get    /current/status<br>
    put    /current/status<br>
    get    /travelers/status<br>
    get    /travelers/plans<br>
    post   /travelers/plans<br>
    put    /travelers/plans<br>
    delete /travelers/plans<br>
    get    /vehicles/timetable<br>
    post   /vehicles/timetable<br>
    put    /vehicles/timetable<br>
    delete /vehicles/timetable<br>
    get    /vehicles/risk<br>
    post   /vehicles/risk<br>
    put    /vehicles/risk<br>
    delete /vehicles/risk<br>
    get    /cities/risk<br>
    post   /cities/risk<br>
    put    /cities/risk<br>
    delete /cities/risk<br>
    get    /log<br>
    
  `);
});

router.get('/facility', function (req, res, next) {
  const id = req.query.id
  const result = getFacility(id)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.get('/facilitys', function (req, res, next) {
  const result = getFacilitys()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.post('/facility', function (req, res, next) {
  const name = req.query.name || ''
  const type = req.query.type || 0
  const x = queryToNum(req.query.locx)
  const y = queryToNum(req.query.locy)
  const dscpn = req.query.description || ''
  const result = createFacility(name,type,x,y,dscpn)
  return result.then(result=>{
    res.json(
      new SuccessModel(result)
    )
  })
});

router.get('/current/time', function (req, res, next) {
  const result = getCurrentTime()
  res.json(
    new SuccessModel(result)
  )
});

router.get('/current/status', function (req, res, next) {
  const result = getCurrentStatus()
  res.json(
    new SuccessModel(result)
  )
});

router.put('/current/status', function (req, res, next) {
  const status = queryToNum(req.query.operation)
  if (isNaN(status)) {
    const result = getCurrentStatus(status)
    res.json(
      new ErrorModel(result)
    )
  }
  else {
    const result = updateCurrentStatus(status)
    res.json(
      new SuccessModel(result)
    )
  }
});

router.get('/travelers/status', function (req, res, next) {
  const result = getTravelersStatus()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.post('/travelers/plans', function (req, res, next) {
  const id = queryToNum(req.query.id)
  const requestTime = queryToNum(req.query.requesttime)
  const departure = req.query.departure || ''
  const arrival = req.query.arrival || ''
  const result = addTravelersPlans(id, requestTime, departure, arrival)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.put('/travelers/plans', function (req, res, next) {
  const id = queryToNum(req.query.id)
  const requestTime = queryToNum(req.query.requesttime)
  const departure = req.query.departure || ''
  const arrival = req.query.arrival || ''
  const result = updateTravelersPlans(id, requestTime, departure, arrival)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.delete('/travelers/plans', function (req, res, next) {
  const id = queryToNum(req.query.id)
  const result = deleteTravelersPlans(id)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.get('/vehicles/timetable', function (req, res, next) {
  const result = getVehiclesTimetable()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

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
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

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
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.delete('/vehicles/timetable', function (req, res, next) {
  const number = queryToNum(req.query.number)
  const result = deleteVehiclesTimetable(number)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.get('/vehicles/risk', function (req, res, next) {
  const result = getVehiclesRisk()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.post('/vehicles/risk', function (req, res, next) {
  const vehicle = req.query.vehicle || ''
  const risk = queryToNum(req.query.risk)
  const result = addVehiclesRisk(vehicle, risk)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.put('/vehicles/risk', function (req, res, next) {
  const vehicle = req.query.vehicle || ''
  const risk = queryToNum(req.query.risk)
  const result = updateVehiclesRisk(vehicle, risk)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.delete('/vehicles/risk', function (req, res, next) {
  const vehicle = req.query.vehicle || ''
  const result = deleteVehiclesRisk(vehicle)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.get('/cities/risk', function (req, res, next) {
  const result = getCitiesRisk()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.post('/cities/risk', function (req, res, next) {
  const city = req.query.city || ''
  const risk = queryToNum(req.query.risk)
  const result = addCitiesRisk(city, risk)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.put('/cities/risk', function (req, res, next) {
  const city = req.query.city || ''
  const risk = queryToNum(req.query.risk)
  const result = updateCitiesRisk(city, risk)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.delete('/cities/risk', function (req, res, next) {
  const city = req.query.city || ''
  const result = deleteCitiesRisk(city)
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.get('/log', function (req, res, next) {
  const result = getLog()
  return result.then(result => {
    res.json(
      new SuccessModel(result)
    )
  })
  //!
});

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  res.json({
    errno: 0,
    data: {
      username,
      password
    }
  })
});

module.exports = router;
