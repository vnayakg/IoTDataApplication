const express = require('express');

const { User } = require('../models/user');
const { Device } = require('../models/device');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/device', [auth, admin], async (req, res) => {
  const { childId, deviceID, deviceType } = req.body;

  if (!validateObjectId(childId))
    return res.status(404).send('Invalid childId given');

  if (childId === req.user._id)
    return res.status(400).send('Can not self assign device');

  const child = await User.findById(childId);

  if (!child) return res.status(404).send('Child not found');
  if (child.isSuperAdmin)
    return res.status(400).send('No need to assign devices to god');

  const device = await Device.findOne({ deviceType: deviceType });

  if (!device) return res.status(400).send('Invalid device type');
  if (device.deviceIDsInUse <= deviceID)
    return res.status(400).send('Invalid device id');

  if (child.hasDevice({ deviceType, deviceID }))
    return res.status(202).send('Already Alloted to User');

  if (req.user.isSuperAdmin) {
    let user = child;

    while (!user.isSuperAdmin) {
      if (user.hasDevice({ deviceType, deviceID })) break;

      user.assignedDevices.push({ deviceType, deviceID });
      await user.save();

      user = await User.findById(user.parentID);
    }
  } else {
    if (child.parentID.toString() !== req.user._id)
      return res
        .status(400)
        .send('You can not assign device to a user not directly under you');

    const parent = await User.findById(req.user._id);

    if (!parent.hasDevice({ deviceType, deviceID }))
      return res
        .status(400)
        .send('You do not have access rights to the given device');

    child.assignedDevices.push({ deviceType, deviceID });
    await child.save();
  }

  res.status(200).send('Successfully assigned');
});

router.delete('/device', [auth, admin], async (req, res) => {
  const { childId, deviceID, deviceType } = req.body;

  if (!validateObjectId(childId))
    return res.status(404).send('Invalid childId given');

  if (childId === req.user._id)
    return res.status(400).send('Can not self remove device');

  const child = await User.findById(childId);

  if (!child) return res.status(404).send('Child not found');
  if (child.isSuperAdmin)
    return res.status(400).send('You can not remove devices from god');

  if (!child.hasDevice({ deviceType, deviceID }))
    return res.status(404).send("Device not found in user's assigned devices");

  if (!req.user.isSuperAdmin && child.parentID.toString() !== req.user._id)
    return res
      .status(400)
      .send('You can not remove device from a user not directly under you');

  const stack = [childId];

  while (stack.length > 0) {
    const user = await User.findByIdAndUpdate(stack.pop(), {
      $pull: { assignedDevices: { deviceType, deviceID } },
    });

    for (const cID of user.childrenIDs) {
      stack.push(cID);
    }
  }

  res.status(200).send('Successfully removed');
});

router.post('/parent', [auth, admin], async (req, res) => {
  const { parentId, childId } = req.body;

  if (!validateObjectId(parentId) && !validateObjectId(childId))
    return res.status(404).send('One or more invalid IDs given');

  if (parentId === childId)
    return res.status(400).send('Can not assign child of self as self');

  let parent = await User.findById(parentId);
  let child = await User.findById(childId);

  if (!parent || !child)
    return res.status(404).send('One or more users not found');

  if (!parent.isAdmin) return res.status(400).send('Parent is not a Admin');

  if (child.parentID.toString() === parentId)
    return res.status(400).send('Already assigned');

  let parent_track = parent;
  let parent_height = 0;
  while (parent_track) {
    parent_track = await User.findById(parent_track.parentID);
    parent_height++;
  }

  let child_track = child;
  let child_height = 0;
  while (child_track) {
    child_track = await User.findById(child_track.parentID);
    child_height++;
  }

  parent_track = parent;
  child_track = child;

  while (parent_height < child_height) {
    child_track = await User.findById(child_track.parentID);
    child_height--;
  }

  while (parent_height > child_height) {
    parent_track = await User.findById(parent_track.parentID);
    parent_height--;
  }

  while (parent_track._id.toString() !== child_track._id.toString()) {
    parent_track = await User.findById(parent_track.parentID);
    child_track = await User.findById(child_track.parentID);
  }

  let ancestor = parent_track;
  let verified = req.user.isSuperAdmin;

  if (ancestor._id.toString() === childId)
    return res
      .status(400)
      .res('Can not set a user as a child of its descendent');

  if (!req.isSuperAdmin) {
    while (ancestor) {
      if (ancestor._id.toString() === req.user._id) {
        verified = true;
        break;
      }
      ancestor = await User.findById(ancestor.parentID);
    }
  }

  if (!verified)
    return res
      .status(400)
      .send('You can not change relation of users which are not below you');

  await User.findByIdAndUpdate(child.parentID, {
    $pull: { childrenIDs: child._id },
  });
  await User.findByIdAndUpdate(child._id, { parentID: parent._id });
  await User.findByIdAndUpdate(parent._id, {
    $push: { childrenIDs: child._id },
  });

  parent_track = parent;
  let extraDevices = child.assignedDevices.filter((d) => !parent.hasDevice(d));
  while (!parent_track.isSuperAdmin && extraDevices.length > 0) {
    await User.findByIdAndUpdate(parent._id, {
      $push: { assignedDevices: { $each: extraDevices } },
    });

    parent_track = await User.findById(parent_track.parentID);

    extraDevices = extraDevices.filter((d) => !parent_track.hasDevice(d));
  }

  res.status(200).send('Successfully assigned');
});

module.exports = router;
