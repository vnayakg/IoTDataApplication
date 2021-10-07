const express = require('express');
const bcrypt = require('bcryptjs');

const { User, validateRegister } = require('../models/user');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post(
  '/register',
  [auth, admin, validate(validateRegister)],
  async (req, res) => {
    const { username, password, name, phone, isAdmin } = req.body;

    let user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .send(`User with username ${username} already exists`);

    user = await User.findOne({ phone });
    if (user)
      return res.status(400).send(`User with phone ${phone} already exists`);

    user = new User({ username, name, phone, isAdmin, parentID: req.user._id });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const parent = await User.findById(req.user._id);
    parent.childrenIDs.push(user._id);
    await parent.save();

    res.status(200).send({ _id: user._id, username, name });
  }
);

module.exports = router;
