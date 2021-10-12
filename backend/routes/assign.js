const express = require('express');

const { User } = require('../models/user');
const { Device } = require('../models/device');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post(
    '/device',
    [auth, admin],
    async (req, res) => {

        const { parentId, deviceId, deviceType } = req.body;
        const user = await User.findById({ _id: req.user._id });
        const device = await Device.findOne({ deviceType: deviceType });

        if (!device) return res.status(400).send('Invalid device type');

        if (!device.deviceIDsInUse.includes(deviceId)) return res.status(400).send('Invalid device id');

        if (!user.assignedDevices.includes({ deviceType: deviceType, deviceID: deviceId }) || !user.childrenIDs.includes(parentId))
            return res.status(400).send('Invalid Request!');

        const parent = await User.findOne({ _id: parentId });

        if (parent.assignedDevices.includes({ deviceType: deviceType, deviceID: deviceId }))
            return res.status(202).send('Already Alloted to User');

        await User.findByIdAndUpdate(parentId, { $push: { assignedDevices: { deviceType: deviceType, deviceID: deviceId } } });
    }
);

router.post(
    '/parent',
    [auth, admin],
    async (req, res) => {

        const { parentId, childId } = req.body;
        let parent = await User.findById({ _id: parentId });
        let child = await Device.findById({ _id: childId });

        if (!parent || !child)
            return res.status(400).send('Invalid parent or clild id');

        if (!parent.admin) return res.status(400).send('Parent is not a Admin');

        if(parent._id == child._id) return res.status(400).send('Not Allowed');

        if (!req.user.superAdmin) {
            let parent_track = parent;
            let child_track = child;

            while (parent_track.height < child_track.height) {
                child_track = await User.findById({ _id: child_track.parentID });
            }

            while (parent_track.height > child_track.height) {
                parent_track = await User.findById({ _id: parent_track.parentID });
            }

            while (parent_track._id != child_track._id) {
                parent_track = await User.findById({ _id: parent_track.parentID });
                child_track = await User.findById({ _id: child_track.parentID });
            }

            let ancestor = parent_track;
            let verified = false;

            while (!ancestor.superAdmin) {
                if (ancestor._id == req.user._id) {
                    verified = true;
                    break;
                }
                ancestor = await User.findById({ _id: ancestor.parentID });
            }

            if (!verified) return res.status(400).send('You are not allowed to do this!');
        }

        await User.findByIdAndUpdate(child.parentID, { $pullAll: { childrenIDs: child._id } });
        await User.findByIdAndUpdate(child._id, { parentID: parent._id });
        await User.findByIdAndUpdate(parent._id, { $push: { childrenIDs: child._id } });
    }
);

module.exports = router;
