const express = require('express');

const { DataPoint, validateDataPoint } = require('../models/dataPoint');
const { User } = require('../models/user');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', [auth], async (req, res) => {
  if (req.user.isSuperAdmin) {
    const data = await DataPoint.find();

    return res.status(200).send(data);
  }

  const user = await User.findById(req.user._id);

  const data = await DataPoint.find({ device: { $in: user.assignedDevices } });

  res.status(200).send(data);
});

router.post('/', validate(validateDataPoint), async (req, res) => {
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
