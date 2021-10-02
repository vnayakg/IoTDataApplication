const express = require('express')
const { DataPoint, validateDataPoint } = require('../models/dataPoint')
const validate = require('../middleware/validate')
const router = express.Router()

router.get('/', async (req, res) => {
  //TODO:
  //1. check access rights with jwt
  const { dateTime, deviceId, sensorId, sensorType, deviceType } = req.body
  const data = await DataPoint.find({
    deviceId,
    sensorId,
    sensorType,
    deviceType,
    dateTime: { $gte: dateTime.from, $lte: dateTime.to },
  }).sort('dateTime')

  res.status(200).send(data)
})

router.post('/', validate(validateDataPoint), async (req, res) => {
  const {
    dateTime,
    deviceID,
    sensorID,
    sensorType,
    noOfSensors,
    deviceType,
    values,
  } = req.body

  let datapoint = new DataPoint({
    dateTime,
    deviceType,
    deviceID,
    noOfSensors,
    sensorType,
    sensorID,
    values,
  })

  await datapoint.save()

  res.status(200).send(datapoint)
})

module.exports = router
