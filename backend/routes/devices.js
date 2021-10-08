const express = require('express');

const { Device, validateDevice, validateUpdate } = require('../models/device');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const superAdmin = require('../middleware/superAdmin');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const devices = await Device.find().sort('deviceType');
  res.status(200).send(devices);
});

router.post(
  '/',
  [auth, superAdmin, validate(validateDevice)],
  async (req, res) => {
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
  }
);

router.get('/:deviceType', auth, async (req, res) => {
  const device = await Device.findOne({ deviceType: req.params.deviceType });

  if (!device)
    return res
      .status(404)
      .send('The device with given deviceType was not found');

  res.status(200).send(device);
});

router.put(
  '/:deviceType',
  [auth, superAdmin, validate(validateUpdate)],
  async (req, res) => {
    const device = await Device.findOneAndUpdate(
      { deviceType: req.params.deviceType },
      {
        description: req.body.description,
        deviceIDsInUse: req.body.deviceIDsInUse,
      },
      { new: true }
    );

    if (!device)
      return res
        .status(404)
        .send('The device with given deviceType was not found');

    res.status(200).send(device);
  }
);

router.delete('/:deviceType', [auth, superAdmin], async (req, res) => {
  const device = await Device.findOneAndDelete({
    deviceType: req.params.deviceType,
  });

  if (!device)
    return res
      .status(404)
      .send('The device with given deviceType was not found');

  res.status(200).send(device);
});

module.exports = router;
