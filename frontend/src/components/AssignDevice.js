import { useEffect, useState } from "react";

import {
    MenuItem,
    FormControl,
    Select,
    Button,
    InputLabel,
} from "@mui/material/";

import Device from "../services/devices";
import User from "../services/users";
import Assign from "../services/assign";
import asyncToast from "../services/asyncToast";

const AssignDevice = ({ setRoute }) => {
    const [devices, setDevices] = useState([]);
    const [currentDevice, setCurrentDevice] = useState("");
    const [currentChildren, setCurrentChildren] = useState("");
    const [children, setChildren] = useState([]);

    useEffect(() => {
        setRoute("/assigndevice");

        const loadDevices = async () => {
            try {
                const res = await Device.getUserDevices();
                console.log(res.data);
                setDevices(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        const loadChildren = async () => {
            try {
                const res = await User.getChildren();
                setChildren(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        loadDevices();
        loadChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeviceChange = (event) => {
        setCurrentDevice(event.target.value);
        console.log(event.target.value);
    };

    const handleChildrenChange = (event) => {
        setCurrentChildren(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastID = asyncToast.load("Assigning device...");
        try {
            const data = {
                childId: currentChildren,
                deviceID: currentDevice.deviceID,
                deviceType: currentDevice.deviceType,
            };
            console.log(data);
            const res = await Assign.assignDevice(data);
            console.log(res.status);
            if (res.status !== 200)
                return asyncToast.update(toastID, "error", res.data);
            else return asyncToast.update(toastID, "success", res.data);
        } catch (error) {
            asyncToast.update(toastID, "error", error.response.data);
            console.log(error);
        }
    };

    return (
        <>
            <FormControl sx={{ marginTop: 4 }} fullWidth>
                <InputLabel id="demo-simple-select-label">Device</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Device"
                    value={currentDevice}
                    onChange={handleDeviceChange}
                >
                    {devices.length &&
                        devices.map((device) => (
                            <MenuItem key={device._id} value={device}>
                                {device.description === undefined
                                    ? device.deviceID + "-" + device.deviceType
                                    : device.description}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl sx={{ marginTop: 4 }} fullWidth>
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="User"
                    value={currentChildren}
                    onChange={handleChildrenChange}
                >
                    {children.length &&
                        children.map((child) => (
                            <MenuItem key={child._id} value={child._id}>
                                {child.username}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                disabled={currentDevice === "" || currentChildren === ""}
            >
                Assign
            </Button>
        </>
    );
};

export default AssignDevice;
