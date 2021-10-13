const express = require('express');

const { User } = require('../models/user');
const { Device } = require('../models/device');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router();

router.post(
    '/device',
    [auth, admin],
    async (req, res) => {
        const { parentId, deviceId, deviceType } = req.body;

        if (!validateObjectId(parentId))
            return res.status(404).send('Invalid ID of parent given');

        const user = await User.findById(req.user._id);
        const device = await Device.findOne({ deviceType: deviceType });

        if (!device) return res.status(400).send('Invalid device type');

        if (device.deviceIDsInUse <= deviceId) return res.status(400).send('Invalid device id');

        if (!user.assignedDevices.includes({ deviceType: deviceType, deviceID: deviceId }) || !user.childrenIDs.includes(parentId))
            return res.status(400).send('Invalid Request!');

        const parent = await User.findOne({ _id: parentId });

        if (parent.assignedDevices.includes({ deviceType: deviceType, deviceID: deviceId }))
            return res.status(202).send('Already Alloted to User');

        await User.findByIdAndUpdate(parentId, { $push: { assignedDevices: { deviceType: deviceType, deviceID: deviceId } } });

        res.status(200).send('Successfully assigned');
    }
);

router.post(
    '/parent',
    [auth, admin],
    async (req, res) => {
        const { parentId, childId } = req.body;

        if (!validateObjectId(parentId) && !validateObjectId(childId))
            return res.status(404).send('One or more invalid IDs given');
            
        if(parentId === childId) return res.status(400).send('Can not assign child of self as self');

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
        let verified = false;

        if (ancestor._id.toString() === childId)
            return res.status(400).res('Can not set a user as a child of its descendent');

        while (ancestor) {
            if (ancestor._id.toString() === req.user._id) {
                verified = true;
                break;
            }
            ancestor = await User.findById(ancestor.parentID);
        }

        if (!verified) return res.status(400).send('You can not change relation of users which are not below you');

        await User.findByIdAndUpdate(child.parentID, { $pullAll: { childrenIDs: [child._id] } });
        await User.findByIdAndUpdate(child._id, { parentID: parent._id });
        await User.findByIdAndUpdate(parent._id, { $push: { childrenIDs: child._id } });

        res.status(200).send('Successfully assigned');
    }
);

module.exports = router;
