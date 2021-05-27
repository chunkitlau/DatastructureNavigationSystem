const xss = require('xss')
const { exec } = require('../database/mysql')

const getFacility = id => {
  const sql = `select * from dottable where id=${id};`
  return exec(sql)
}

const updateFacility = (id, name, type, description) => {
  const sql = `update dottable set name='${name}', type='${type}', description='${description}' where id=${id};`
  return exec(sql)
}

const getFacilitys = desc => {
  var sql
  if (desc == '') sql = `select * from dottable where type != 0`
  else
    sql = `select * from dottable where name REGEXP '${desc}' and type != 0 union select * from dottable where description REGEXP '${desc}' and type != 0;`
  return exec(sql)
}

const getFacilitysAround = (nowlocation, distance) => {
  const sql = `select *, ST_Distance_sphere(Point(${nowlocation}), location) as dist FROM dottable having dist < ${distance} and type != 0 ORDER BY dist;`
  return exec(sql)
}

const getFacilitysAll = () => {
  const sql = `select * from dottable`
  return exec(sql)
}

const createFacility = (name, type, position, description) => {
  position = position.replace(',', ' ')
  const sql = `
    insert into dottable (type, name, location, description) values (${type},'${name}',ST_pointfromtext('POINT(${position})'),'${description}');
  `
  console.log(`Insert facility (${type},'${name}',ST_pointfromtext('POINT(${position})'),'${description}')`)
  return exec(sql)
}

const deleteFacility = id => {
  const sql = `delete from dottable where id = ${id};`
  return exec(sql)
}

const getRoad = id => {
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

const queryToNum = query => {
  let result = Number(query)
  if (result === 0 && query !== '0') {
    result = NaN
  }
  return result
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

const deleteVehiclesTimetable = number => {
  const sql = `
    delete from vehiclestimetable where number=${number};
  `
  return exec(sql)
}

const getLog = () => {
  const sql = `select * from log;`
  return exec(sql)
}

module.exports = {
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
}
