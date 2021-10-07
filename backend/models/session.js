const mongoose = require('mongoose');

const Session = mongoose.model(
  'Session',
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    token: { type: String, require: true },
  })
);

module.exports = Session;
