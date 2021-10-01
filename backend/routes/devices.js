const express = require('express');
const { Device, validateDevice } = require('../models/device');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await Device.find().sort('deviceType');
  res.status(200).send(devices);
});

// use superAdmin middleware
router.post('/', validate(validateDevice), async (req, res) => {
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

router.get('/:deviceId', validateObjectId('deviceId'), async (req, res) => {
  const device = await Device.findById(req.params.deviceId);

  if (!device)
    return res.status(404).send('The device with given ID was not found');

  res.status(200).send(device);
});

module.exports = router;
