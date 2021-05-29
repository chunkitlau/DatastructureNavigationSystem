const xss = require('xss')
const { exec } = require('../database/mysql')
const { Dijkstra, Dijkstra_initial } = require('./model')

const getFacility = id => {
  const sql = `select * from dottable where id=${id};`
  return exec(sql)
}

const updateFacility = (id, name, type, description) => {
  const sql = `update dottable set name='${name}', type='${type}', description='${description}' where id=${id};`
  return exec(sql)
}

const getFacilitys = (desc, positon, time) => {
  if (desc == '') {
    const sql = `select * from dottable where type != 0`
    return exec(sql)
  } else {
    const promise = new Promise((resolve, reject) => {
      const sql = `select * from dottable where name REGEXP '${desc}' and type != 0 union select * from dottable where description REGEXP '${desc}' and type != 0;`
      var p1List = [getFacilitysAround(positon, 50), exec(sql), Dijkstra_initial()]
      Promise.all(p1List).then(values => {
        res = values[1]
        const startID = values[0][0].id
        var endIDs = []
        for (let i = 0; i < res.length; i++) endIDs.push(res[i].id)
        var leastDistance = Dijkstra(startID, endIDs, 0)
        var leastTime = Dijkstra(startID, endIDs, 3)
        for (let i = 0; i < res.length; i++) {
          if (leastDistance.endDot.id == res[i].id){
            res[i].id = 0
            res[i].description = res[i].description + "（最近距离）"
          }
          else if (leastTime.endDot.id == res[i].id) {
            res[i].id = 1
            res[i].description = res[i].description + "（最短时间）"
          }
          else res[i].id += 2
        }
        const cmpDot = (a, b) => {
          return a.id - b.id
        }
        res.sort(cmpDot)
        resolve(res)
      })
    })
    return promise
  }
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
  getFacilitys,
  updateFacility,
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
