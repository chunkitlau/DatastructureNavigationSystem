// Choose a time for backend start time.
const START_TIME = [
  {
    hour: 8,
    minute: 0,
    second: 0,
  },
  {
    hour: 11,
    minute: 25,
    second: 0,
  },
  {
    hour: 13,
    minute: 0,
    second: 0,
  },
  {
    hour: 16,
    minute: 25,
    second: 0,
  },
]
const DIST_BETWEEN_CAMPUS = 20000 // 20km
const BUS_TIME = 3600
const RAILWAY_TIME = 5400
const DEFAULT_RADIUS = 6371008.8
const SPEED = [1.4, 4.2, 8.4, 13.9]

module.exports = {
  START_TIME,
  DIST_BETWEEN_CAMPUS,
  DEFAULT_RADIUS,
  SPEED,
  BUS_TIME,
  RAILWAY_TIME,
}
