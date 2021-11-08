const express = require('express');
const bcrypt = require('bcryptjs');

const {
  User,
  validateRegister,
  validateUpdate,
  validateReset,
} = require('../models/user');
const Session = require('../models/session');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const superAdmin = require('../middleware/superAdmin');

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

    const timestamp = new Date();
    user = new User({
      username,
      name,
      phone,
      isAdmin,
      parentID: req.user._id,
      timestamp,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const parent = await User.findById(req.user._id);
    parent.childrenIDs.push(user._id);
    await parent.save();

    res.status(200).send({ _id: user._id, username, name });
  }
);

//reset password
router.post('/reset', [auth, validate(validateReset)], async (req, res) => {
  const { _id, username } = req.user;
  const { password, newPassword } = req.body;

  if (password === newPassword)
    return res
      .status(400)
      .send('Current password and new password should be different');

  const user = await User.findOne({ username });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid current password');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  const updatedUser = await User.findByIdAndUpdate(_id, {
    password: hash,
  }).select('-password');

  const updatedToken = updatedUser.generateAuthToken();
  await Session.findOneAndUpdate({ username }, { token: updatedToken });

  res.status(200).send({ updatedUser, updatedToken });
});

// update user info
router.put('/update', [auth, validate(validateUpdate)], async (req, res) => {
  const { _id } = req.user;
  const { name, phone } = req.body;

  let user = await User.findOne({ phone });
  if (user && user._id.toString() !== _id)
    return res.status(400).send(`User with phone ${phone} already exists`);

  user = await User.findByIdAndUpdate(
    _id,
    { name, phone },
    { new: true }
  ).select('-password');

  res.status(200).send(user);
});

// get all users info
router.get('/', [auth, admin], async (req, res) => {
  let users = await User.find().select('-password');

  res.status(200).send(users);
});

router.delete('/:username', [auth, superAdmin], async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user)
    return res.status(404).send('The user with given username was not found');

  if (user.isSuperAdmin) return res.status(400).send('You cannot destroy God!');

  if (user._id.toString() === req.user._id)
    return res.status(400).send('You cannot destroy yourself!');

  const parent = await User.findByIdAndUpdate(user.parentID, {
    $pull: { childrenIDs: user._id },
  });

  await User.findByIdAndUpdate(parent._id, {
    $push: { childrenIDs: { $each: user.childrenIDs } },
  });

  for (const childId of user.childrenIDs) {
    await User.findByIdAndUpdate(childId, { parentID: parent._id });
  }

  await User.findByIdAndDelete(user._id);

  res.status(200).send('User deleted successfully');
});

router.get('/children',auth, async (req, res)=>{
  if(req.user.isSuperAdmin){
    let users = await User.find().select('-password');
    return res.status(200).send(users)
  }

  const user = await User.findOne({username: req.user.username}).populate('childrenIDs')
  res.status(200).send(user.childrenIDs)
})

module.exports = router;
