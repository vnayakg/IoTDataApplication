const express = require('express');

const { Sensor, validateSensor, validateUpdate } = require('../models/sensor');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const superAdmin = require('../middleware/superAdmin');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const sensors = await Sensor.find().sort('sensorType');
  res.status(200).send(sensors);
});

router.post(
  '/',
  [auth, superAdmin, validate(validateSensor)],
  async (req, res) => {
    let sensor = await Sensor.findOne({ sensorType: req.body.sensorType });
    if (sensor)
      return res
        .status(400)
        .send(`sensor with sensorType ${req.body.sensorType} already exists`);

    sensor = new Sensor({
      sensorType: req.body.sensorType,
      description: req.body.description,
      sensorIDsInUse: req.body.sensorIDsInUse,
      valueNames: req.body.valueNames,
    });
    await sensor.save();

    res.status(200).send(sensor);
  }
);

router.get('/:sensorType', auth, async (req, res) => {
  const sensor = await Sensor.findOne({ sensorType: req.params.sensorType });

  if (!sensor)
    return res
      .status(404)
      .send('The sensor with given sensorType was not found');

  res.status(200).send(sensor);
});

router.put(
  '/:sensorType',
  [auth, superAdmin, validate(validateUpdate)],
  async (req, res) => {
    const sensor = await Sensor.findOneAndUpdate(
      { sensorType: req.params.sensorType },
      {
        description: req.body.description,
        sensorIDsInUse: req.body.sensorIDsInUse,
        valueNames: req.body.valueNames,
      },
      { new: true }
    );

    if (!sensor)
      return res
        .status(404)
        .send('The sensor with given sensorType was not found');

    res.status(200).send(sensor);
  }
);

router.delete('/:sensorType', [auth, superAdmin], async (req, res) => {
  const sensor = await Sensor.findOneAndDelete({
    sensorType: req.params.sensorType,
  });

  if (!sensor)
    return res
      .status(404)
      .send('The sensor with given sensorType was not found');

  res.status(200).send(sensor);
});

module.exports = router;
