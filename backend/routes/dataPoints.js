const express = require("express");
const { DataPoint, validateDataPoint } = require("../models/dataPoint");
const { User } = require('../models/user');
const validate = require("../middleware/validate");
const auth = require('../middleware/auth');
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  
  const user = await User.findById(req.user._id);

  if (!user.isSuperAdmin) {
    const devices = user.assignedDevices;

    const devicesTrimed = [];

    for(let i=0; i< devices.length;i++){
      console.log(devices[i]);
      devicesTrimed.push({deviceType: devices[i]["deviceType"], deviceID:devices[i]["deviceID"]});
    }

    let data = [];

    data.push(await DataPoint.find({ device: { $in: devicesTrimed } }));

    return res.status(200).send(data);
  }
  
  res.status(200).send(await DataPoint.find());
});

router.post("/", validate(validateDataPoint), async (req, res) => {
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
