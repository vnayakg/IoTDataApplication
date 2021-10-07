const express = require('express');
const bcrypt = require('bcryptjs');

const { User, validateLogin } = require('../models/user');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/login', validate(validateLogin), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid username or password');

  const token = user.generateAuthToken();
  res.status(200).send(token);
});

// /logout

module.exports = router;
