const mongoose = require('mongoose')
const Joi = require('joi')

const DataPoint = mongoose.model(
  'DataPoint',
  new mongoose.Schema({
    dateTime: { type: Date, required: true },
    device: {
      deviceType: { type: Number, required: true },
      deviceID: { type: Number, required: true },
    },
    noOfSensors: { type: Number, required: true },
    sensor: {
      sensorType: { type: Number, required: true },
      sensorID: { type: Number, required: true },
    },
    values: { type: Array, required: true },
  }),
)

function validateDataPoint(dataPoint) {
  const schema = Joi.object({
    dateTime: Joi.date().required(),
    deviceType: Joi.number().required(),
    deviceID: Joi.number().required(),
    noOfSensors: Joi.number().required(),
    sensorType: Joi.number().required(),
    sensorID: Joi.number().required(),
    values: Joi.array().required(),
  })

  return schema.validate(dataPoint)
}

module.exports = { DataPoint, validateDataPoint }
