const xss = require('xss')
const { exec } = require('../database/mysql')
var currentTime = 0
var currentStatus = 1

const queryToNum = (query) => {
  let result = Number(query)
  if (result === 0 && query !== '0') {
    result = NaN
  }
  return result
}

const timeCounter = setInterval(function () {
  currentTime += currentStatus === 0
  //console.log(currentTime)
}, 10000)

const getCurrentTime = () => {
  return { currentTime: currentTime }
}

const getCurrentStatus = () => {
  return { currentStatus: currentStatus }
}

const updateCurrentStatus = (status) => {
  if (status === 2) {
    currentTime = 0
    currentStatus = 0
  }
  else {
    currentStatus = status
  }
  return { currentStatus: currentStatus }
}

const getTravelersStatus = () => {
  const sql = `select * from travelersstatus;`
  return exec(sql)
}

const getFacility = (id) => {
  const sql = `select * from dottable where id=${id};`
  return exec(sql)
}

const getFacilitys = () => {
  const sql = `select * from dottable;`
  return exec(sql)
}

const createFacility = (name, type, x, y, description) => {
  console.log(`(${type},'${name}',ST_pointfromtext('POINT(${x} ${y})'),'${description})'`)
  const sql = `
    insert into dottable (type,name, location,description) values (${type},'${name}',ST_pointfromtext('POINT(${x} ${y})'),'${description}');
    `
  return exec(sql)
}

const addTravelersPlans = (id, requestTime, departure, arrival) => {
  const sql = `
    insert into travelersplans(id, requesttime, departure, arrival, plan)
    values(${id}, ${requestTime}, '${departure}', '${arrival}', '[]');
  `
  return exec(sql)
}

const updateTravelersPlans = (id, requestTime, departure, arrival) => {
  const sql = `
    update travelersplans set requesttime=${requestTime}, departure='${departure}', arrival='${arrival}' where id=${id};
  `
  return exec(sql)
}

const deleteTravelersPlans = (id) => {
  const sql = `
    delete from travelersplans where id=${id};
  `
  return exec(sql)
}

const getVehiclesTimetable = () => {
  const sql = `select * from vehiclestimetable;`
  return exec(sql)
}

const addVehiclesTimetable = (number, type, departure, departureTime, arrival, arrivalTime, risk) => {
  const sql = `
    insert into vehiclestimetable(number, type, departure, departuretime, arrival, arrivaltime, risk)
    values(${number}, '${type}', '${departure}', ${departureTime}, '${arrival}', ${arrivalTime}, ${risk});
  `
  return exec(sql)
}

const updateVehiclesTimetable = (number, type, departure, departureTime, arrival, arrivalTime, risk) => {
  const sql = `
    update vehiclestimetable set type='${type}', departure='${departure}', departuretime=${departureTime}, arrival='${arrival}', arrivaltime=${arrivalTime}, risk=${risk} where number=${number};
  `
  return exec(sql)
}

const deleteVehiclesTimetable = (number) => {
  const sql = `
    delete from vehiclestimetable where number=${number};
  `
  return exec(sql)
}

const getVehiclesRisk = () => {
  const sql = `select * from vehiclesrisk;`
  return exec(sql)
}

const addVehiclesRisk = (vehicle, risk) => {
  const sql = `
    insert into vehiclesrisk(vehicle, risk)
    values('${vehicle}', ${risk});
  `
  return exec(sql)
}

const updateVehiclesRisk = (vehicle, risk) => {
  const sql = `
    update vehiclesrisk set risk=${risk} where vehicle='${vehicle}';
  `
  return exec(sql)
}

const deleteVehiclesRisk = (vehicle) => {
  const sql = `
    delete from vehiclesrisk where vehicle='${vehicle}';
  `
  return exec(sql)
}

const getCitiesRisk = () => {
  const sql = `select * from citiesrisk;`
  return exec(sql)
}

const addCitiesRisk = (city, risk) => {
  const sql = `
    insert into citiesrisk(city, risk)
    values('${city}', ${risk});
  `
  return exec(sql)
}

const updateCitiesRisk = (city, risk) => {
  const sql = `
    update citiesrisk set risk=${risk} where city='${city}';
  `
  return exec(sql)
}

const deleteCitiesRisk = (city) => {
  const sql = `
    delete from citiesrisk where city='${city}';
  `
  return exec(sql)
}

const getLog = () => {
  const sql = `select * from log;`
  return exec(sql)
}

//let sql = 'select * from xxx where 1=1'
//sql += 'and xxx='${xxx}''
//sql += 'order by xxx'
//

module.exports = {
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
}