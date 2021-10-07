const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false, required: true },
  isSuperAdmin: { type: Boolean, default: false },
  parentID: { type: mongoose.Types.ObjectId, required: true },
  childrenIDs: { type: [mongoose.Types.ObjectId] },
  assignedDevices: {
    type: [{ deviceType: Number, deviceID: Number }],
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const { _id, username, name, isAdmin, isSuperAdmin } = this;
  const token = jwt.sign(
    { _id, username, name, isAdmin, isSuperAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateRegister(user) {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string()
      .required()
      .pattern(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      ),
    name: Joi.string().required(),
    phone: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/),
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

module.exports = { User, validateRegister, validateLogin };
