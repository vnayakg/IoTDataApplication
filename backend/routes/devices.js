const express = require('express');
const { Device, validate } = require('../models/device');

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await Device.find().sort('deviceType');
  res.status(200).send(devices);
});

// use superAdmin middleware
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let device = await Device.findOne({ deviceType: req.body.deviceType });
  if (device)
    return res
      .status(400)
      .send(`Device with deviceType ${req.body.deviceType} already exists`);

  device = new Device({
    deviceType: req.body.deviceType,
    description: req.body.description,
    deviceIDsInUse: req.body.deviceIDsInUse,
  });
  await device.save();

  res.status(200).send(device);
});

module.exports = router;
