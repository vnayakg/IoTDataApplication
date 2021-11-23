import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
    Box,
    Drawer,
    CssBaseline,
    MenuItem,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    ListItemButton,
    Menu,
    Button,
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import SensorsIcon from "@mui/icons-material/Sensors";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { toast } from "react-toastify";
import { Link, Switch, Route, Redirect } from "react-router-dom";

import asyncToast from "../services/asyncToast";
import auth from "../services/auth";
import authToken from "../services/authToken";

import Login from "./Login";
import AddUser from "./AddUser";
import Devices from "./Devices";
import Sensors from "./Sensors";
import AssignDevice from "./AssignDevice";
import AssignParent from "./AssignParent";
import Data from "./Data";
import DeviceForm from "./DeviceForm";
import SensorForm from "./SensorForm";
import Account from "./AccountDetails";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

export default function Dashboard({ user, setUser, history }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [expandUser, setExpandUser] = React.useState(false);

    const handleClick = () => {
        setExpandUser(!expandUser);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [route, setRoute] = React.useState("");

    const logout = async () => {
        if (!user) return;
        const toastId = asyncToast.load("Logging out...");
        try {
            await auth.logout();
        } catch (error) {
            console.log(error);
        } finally {
            authToken.removeToken();
            setUser(null);
            asyncToast.update(toastId, "success", "Logged out successfully!");
            handleClose();
            history.push("/login");
        }
    };

    const logoutUtil = () => {
        authToken.removeToken();
        setUser(null);
        toast.info("Logged out!");
        history.push("/login");
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        IOT Data Application
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />

                    {!user && (
                        <Button
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            component={Link}
                            to="/login"
                        >
                            Login
                        </Button>
                    )}

                    {user && (
                        <Typography variant="p" noWrap component="div">
                            Hi, {user.name}
                        </Typography>
                    )}

                    {user && (
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    )}
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            component={Link}
                            to="/account"
                            onClick={handleClose}
                        >
                            My account
                        </MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem
                        component={Link}
                        to="/"
                        button
                        key="dashboard"
                        selected={route === "/"}
                    >
                        <ListItemIcon>
                            <TableChartIcon />
                        </ListItemIcon>

                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    <ListItem
                        component={Link}
                        to="/devices"
                        button
                        key="devices"
                        selected={route === "/devices"}
                    >
                        <ListItemIcon>
                            <DevicesIcon />
                        </ListItemIcon>

                        <ListItemText primary="Devices" />
                    </ListItem>

                    <ListItem
                        component={Link}
                        to="/sensors"
                        button
                        key="sensors"
                        selected={route === "/sensors"}
                    >
                        <ListItemIcon>
                            <SensorsIcon />
                        </ListItemIcon>

                        <ListItemText primary="Sensors" />
                    </ListItem>

                    <ListItemButton
                        onClick={handleClick}
                        selected={[
                            "/adduser",
                            "/assigndevice",
                            "/assignparent",
                        ].includes(route)}
                    >
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                        {expandUser ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={expandUser} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                component={Link}
                                to="adduser"
                                sx={{ pl: 4 }}
                                key="adduser"
                                selected={route === "/adduser"}
                            >
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add New User" />
                            </ListItemButton>

                            <ListItemButton
                                component={Link}
                                to="assigndevice"
                                sx={{ pl: 4 }}
                                key="assigndevice"
                                selected={route === "/assigndevice"}
                            >
                                <ListItemIcon>
                                    <AddToQueueIcon />
                                </ListItemIcon>
                                <ListItemText primary="Assign Device" />
                            </ListItemButton>

                            <ListItemButton
                                component={Link}
                                to="assignparent"
                                sx={{ pl: 4 }}
                                key="assignparent"
                                selected={route === "/assignparent"}
                            >
                                <ListItemIcon>
                                    <GroupAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Assign Parent" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Switch>
                    <Route path="/login">
                        {!user ? (
                            <Login setUser={setUser} setRoute={setRoute} />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>
                    <Route path="/assigndevice">
                        <AssignDevice user={user} setRoute={setRoute} />
                    </Route>
                    <Route path="/assignparent">
                        <AssignParent user={user} setRoute={setRoute} />
                    </Route>
                    <Route path="/adduser">
                        <AddUser
                            user={user}
                            setRoute={setRoute}
                            logout={logoutUtil}
                        />
                    </Route>
                    <Route path="/devices/:deviceType">
                        <DeviceForm user={user} logout={logoutUtil} />
                    </Route>
                    <Route path="/devices">
                        <Devices
                            user={user}
                            setRoute={setRoute}
                            logout={logoutUtil}
                        />
                    </Route>
                    <Route path="/sensors/:sensorType">
                        <SensorForm
                            user={user}
                            setRoute={setRoute}
                            logout={logoutUtil}
                        />
                    </Route>
                    <Route path="/sensors">
                        <Sensors
                            user={user}
                            setRoute={setRoute}
                            logout={logoutUtil}
                        />
                    </Route>
                    <Route path="/account">
                        <Account user={user} />
                    </Route>
                    <Route path="/">
                        <Data user={user} setRoute={setRoute} />
                    </Route>
                </Switch>
            </Main>
        </Box>
    );
}
