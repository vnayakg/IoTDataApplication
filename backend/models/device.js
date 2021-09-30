const mongoose = require('mongoose');
const Joi = require('joi');

const Device = mongoose.model(
  'Device',
  new mongoose.Schema({
    deviceType: { type: Number, required: true, min: 1, unique: true },
    description: { type: String, required: true, trim: true },
    deviceIDsInUse: { type: Number, required: true, min: 1 },
  })
);

function validateDevice(device) {
  const schema = Joi.object({
    deviceType: Joi.number().required().min(1),
    description: Joi.string().required(),
    deviceIDsInUse: Joi.number().required().min(1),
  });

  return schema.validate(device);
}

exports.Device = Device;
exports.validate = validateDevice;
