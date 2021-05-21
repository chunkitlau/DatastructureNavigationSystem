const xss = require('xss')
const { exec } = require('../database/mysql')
var currentTime = 0
var currentStatus = 1

const getFacility = (id) => {
  const sql = `select * from dottable where id=${id};`
  return exec(sql)
}

const updateFacility = (id, description) => {
  const sql = `update dottable set description='${description}' where id=${id};`
  return exec(sql)
}

const getFacilitys = (desc) => {
  var sql
  if (desc == '') sql = `select * from dottable`
  else sql = `select * from dottable where name REGEXP '${desc}' and type != 0 union select * from dottable where description REGEXP '${desc}' and type != 0;`
  return exec(sql)
}

const getFacilitysAround = (nowlocation, distance) => {
  const sql = `SELECT *, ST_Distance_sphere(Point(${nowlocation}), location) as dist FROM dottable having dist < ${distance} ORDER BY dist;`
  return exec(sql)
}

const createFacility = (name, type, position, description) => {
  position = position.replace(',', ' ')
  const sql =  `
    insert into dottable (type, name, location, description) values (${type},'${name}',ST_pointfromtext('POINT(${position})'),'${description}');
  `
  console.log(`Insert facility (${type},'${name}',ST_pointfromtext('POINT(${position})'),'${description}')`)
  return exec(sql)
}

const getRoad = (id) => {
  const sql = `select * from edgetable where id=${id};`
  return exec(sql)
}

const getRoads = () => {
  const sql = `select * from edgetable;`
  return exec(sql)
}

const createRoad = (fromid, toid, type, efficiency) => {
  const sql = `
    insert into edgetable (type, fromid, toid, efficiency) values (${type},'${fromid}','${toid}','${efficiency}');
  `
  console.log(`Insert road: (${type},${fromid},${toid},${efficiency})`)
  return exec(sql)
}





/* ------ TRASH ------ */

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
  updateFacility,
  getFacilitys,
  getFacilitysAround,
  createRoad,
  getRoad,
  getRoads,


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
  getCitiesRisk,
  addCitiesRisk,
  updateCitiesRisk,
  deleteCitiesRisk,
  getLog
}