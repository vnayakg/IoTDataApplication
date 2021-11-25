const mongoose = require('mongoose');
const Joi = require('joi');

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
  })
);

function validateDataPoint(dataPoint) {
  const schema = Joi.object({
    dateTime: Joi.date().required(),
    deviceType: Joi.number().required(),
    deviceID: Joi.number().required(),
    noOfSensors: Joi.number().required(),
    sensorType: Joi.number().required(),
    sensorID: Joi.number().required(),
    values: Joi.array().required(),
  });

  return schema.validate(dataPoint);
}

function validateFilter(filter) {
  const schema = Joi.object({
    device: Joi.object().keys({
      deviceType: Joi.number().required(),
      deviceID: Joi.number().required(),
    }),
    sensor: Joi.object().keys({
      sensorType: Joi.number().required(),
      sensorID: Joi.number().required(),
    }),
    timeRange: Joi.object()
      .keys({
        from: Joi.date(),
        to: Joi.date(),
      })
      .min(1),
  }).with('sensor', 'device');

  return schema.validate(filter);
}

module.exports = { DataPoint, validateDataPoint, validateFilter };
