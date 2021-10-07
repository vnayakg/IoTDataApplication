const express = require('express');
const bcrypt = require('bcryptjs');

const { User, validateLogin } = require('../models/user');
const validate = require('../middleware/validate');
const Session = require('../models/session');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', validate(validateLogin), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid username or password');

  let token;

  let session = await Session.findOne({ username: req.body.username });

  if (!session) {
    token = user.generateAuthToken();
    session = new Session({ username: req.body.username, token });
    await session.save();
  } else token = session.token;

  res.status(200).send(token);
});

router.post('/logout', auth, async (req, res) => {
  await Session.findOneAndDelete({ username: req.user.username });

  res.status(200).send('Logged out successfully');
});

module.exports = router;
