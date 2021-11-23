const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const assignedDeviceSchema = new mongoose.Schema(
  {
    deviceType: { type: Number, required: true },
    deviceID: { type: Number, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false, required: true },
  isSuperAdmin: { type: Boolean, default: false },
  parentID: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  childrenIDs: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  assignedDevices: [assignedDeviceSchema],
  timestamp: { type: Date },
});

userSchema.methods.generateAuthToken = function () {
  const { _id, username, name, isAdmin, isSuperAdmin, phone } = this;
  const token = jwt.sign(
    { _id, username, name, isAdmin, isSuperAdmin, phone },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

userSchema.methods.hasDevice = function ({ deviceType, deviceID }) {
  return this.assignedDevices.some(
    (device) => device.deviceType === deviceType && device.deviceID === deviceID
  );
};

const User = mongoose.model('User', userSchema);

function validateRegister(user) {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string()
      .required()
      .min(8)
      .max(30)
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.pattern.base':
          'password must contain a capital letter, a small letter, a number and a special character',
      }),
    name: Joi.string().required(),
    phone: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
      .messages({ 'string.pattern.base': 'phone must only contain digits' }),
    isAdmin: Joi.boolean().required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

function validateUpdate(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
      .messages({ 'string.pattern.base': 'phone must only contain digits' }),
  });

  return schema.validate(user);
}

function validateReset(user) {
  const schema = Joi.object({
    password: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .min(8)
      .max(30)
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        'string.pattern.base':
          'new password must contain a capital letter, a small letter, a number and a special character',
      }),
  });

  return schema.validate(user);
}

module.exports = {
  User,
  validateRegister,
  validateLogin,
  validateUpdate,
  validateReset,
};
