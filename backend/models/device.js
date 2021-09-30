const mongoose = require('mongoose');

const Device = mongoose.model('Device', new mongoose.Schema({}));

exports.Device = Device;
