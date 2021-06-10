const eventLog = []
var logCount = 0

const addLog = logStr => {
  eventLog[logCount++] = logStr
  return `Log added: ${logStr}.`
}
const dumpLog = () => {
  return eventLog
}
module.exports = {
  addLog,
  dumpLog,
  eventLog,
  logCount,
}
