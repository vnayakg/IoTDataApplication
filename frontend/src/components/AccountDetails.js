import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Container,
    FormControl,
    OutlinedInput,
    InputLabel,
    IconButton,
    InputAdornment,
} from "@mui/material";
import asyncToast from "../services/asyncToast";
import User from "../services/users";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import authToken from "../services/authToken";
function AccountDetails({ user }) {
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [username, setUsername] = useState(user.username);
    const [passwordFields, setPasswordFields] = useState({
        password: "",
        oldPassword: "",
        showOldPassword: false,
        showPassword: false,
    });

    const handleUpdate = async () => {
        if (phone.length !== 10) return alert("please enter valid phone");
        const toastID = asyncToast.load("Updating...");
        try {
            const res = await User.update({ phone, name });
            if (res.status === 200)
                asyncToast.update(toastID, "success", "Updated successfully");
            else asyncToast.update(toastID, "error", res.statusText);
            console.log(res.data);
        } catch (err) {
            asyncToast.update(toastID, "error", "Error Occured");
            console.log(err);
        }
    };

    const handleResetPassword = async () => {
        const toastID = asyncToast.load("Resetting...");
        try {
            const data = {
                password: passwordFields.oldPassword,
                newPassword: passwordFields.password,
            };
            const res = await User.reset(data);
            console.log(res)
            authToken.setToken(res.data.updatedToken)
            asyncToast.update(
                toastID,
                "success",
                "Password changed successfully"
            );


        } catch (err) {
            asyncToast.update(toastID, "error", err.response.data);
        }
    };

    const handleClickShowPassword = () => {
        setPasswordFields({
            ...passwordFields,
            showPassword: !passwordFields.showPassword,
        });
    };

    const handleClickShowPasswordOld = () => {
        setPasswordFields({
            ...passwordFields,
            showOldPassword: !passwordFields.showOldPassword,
        });
    };
    const handleChange = (prop) => (event) => {
        setPasswordFields({ ...passwordFields, [prop]: event.target.value });
    };

    const handleChangeOld = (prop) => (event) => {
        setPasswordFields({
            ...passwordFields,
            oldPassword: event.target.value,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseDownPasswordOld = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <Container component="main" maxWidth="lg">
                <h1>Account</h1>
                <form noValidate autoComplete="off">
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        label="Username"
                        variant="outlined"
                        disabled
                        required
                    />
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            marginTop: 3,
                        }}
                        fullWidth
                        id="fullname"
                        label="Full Name"
                        variant="outlined"
                        required
                    />
                    <TextField
                        sx={{
                            marginTop: 3,
                        }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        id="phoneno"
                        label="Phone No"
                        variant="outlined"
                        required
                    />

                    <Button
                        fullWidth
                        sx={{
                            maxWidth: "100px",
                            marginTop: 3,
                        }}
                        onClick={handleUpdate}
                        variant="contained"
                    >
                        Update
                    </Button>

                    <div noValidate autoComplete="off">
                        <FormControl
                            sx={{
                                marginTop: 3,
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                Old Password
                            </InputLabel>
                            <OutlinedInput
                                value={passwordFields.oldPassword}
                                id="outlined-adornment-password"
                                type={
                                    passwordFields.showOldPassword
                                        ? "text"
                                        : "password"
                                }
                                onChange={handleChangeOld("password")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasswordOld}
                                            onMouseDown={
                                                handleMouseDownPasswordOld
                                            }
                                            edge="end"
                                        >
                                            {passwordFields.showOldPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="oldPassword"
                            />
                        </FormControl>
                        <FormControl
                            sx={{
                                marginTop: 3,
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                New Password
                            </InputLabel>
                            <OutlinedInput
                                value={passwordFields.password}
                                id="outlined-adornment-password"
                                type={
                                    passwordFields.showPassword
                                        ? "text"
                                        : "password"
                                }
                                onChange={handleChange("password")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge="end"
                                        >
                                            {passwordFields.showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <Button
                            fullWidth
                            sx={{
                                maxWidth: "100px",
                                marginTop: 3,
                            }}
                            onClick={handleResetPassword}
                            variant="contained"
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default AccountDetails;
