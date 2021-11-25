const express = require('express');

const {
  DataPoint,
  validateDataPoint,
  validateFilter,
} = require('../models/dataPoint');
const { User } = require('../models/user');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const apikey = require('../middleware/apikey');

const router = express.Router();

router.get('/', [auth, validate(validateFilter)], async (req, res) => {
  const { device, sensor, timeRange } = req.body;
  const filter = {};

  const user = await User.findById(req.user._id);

  if (device) {
    if (!user.isSuperAdmin && !user.hasDevice(device))
      return res.status(400).send('You do not have access to this device');

    filter.device = device;
  } else if (!user.isSuperAdmin) filter.device = { $in: user.assignedDevices };

  if (sensor) filter.sensor = sensor;

  if (timeRange) {
    const { from, to } = timeRange;
    const query = {};

    if (from) query.$gte = from;
    if (to) query.$lte = to;

    filter.dateTime = query;
  }

  const data = await DataPoint.find(filter);

  res.status(200).send({ length: data.length, data });
});

router.post('/', [apikey, validate(validateDataPoint)], async (req, res) => {
  const {
    dateTime,
    deviceID,
    deviceType,
    sensorID,
    sensorType,
    noOfSensors,
    values,
  } = req.body;

  let datapoint = new DataPoint({
    dateTime,
    device: {
      deviceType,
      deviceID,
    },
    noOfSensors,
    sensor: {
      sensorType,
      sensorID,
    },
    values,
  });

  await datapoint.save();

  res.status(200).send(datapoint);
});

module.exports = router;
