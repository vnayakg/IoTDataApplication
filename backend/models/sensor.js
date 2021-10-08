const mongoose = require('mongoose');
const Joi = require('joi');

const Sensor = mongoose.model(
  'Sensor',
  new mongoose.Schema({
    sensorType: { type: Number, required: true, unique: true, min: 1 },
    description: { type: String },
    sensorIDsInUse: { type: Number, required: true, min: 1 },
    valueNames: { type: [String], required: true },
  })
);

function validateSensor(sensor) {
  const schema = Joi.object({
    sensorType: Joi.number().required().min(1),
    description: Joi.string().required(),
    sensorIDsInUse: Joi.number().required().min(1),
    valueNames: Joi.array().required().items(Joi.string()).min(1),
  });

  return schema.validate(sensor);
}

function validateUpdate(sensor) {
  const schema = Joi.object({
    description: Joi.string().required(),
    sensorIDsInUse: Joi.number().required().min(1),
    valueNames: Joi.array().required().items(Joi.string()).min(1),
  });

  return schema.validate(sensor);
}

module.exports = { Sensor, validateSensor, validateUpdate };
