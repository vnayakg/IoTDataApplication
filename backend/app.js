require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');

require('./config/database').connect();
const devices = require('./routes/devices');
const sensors = require('./routes/sensors');
const dataPoints = require('./routes/dataPoints');
const auth = require('./routes/auth');
const users = require('./routes/users');
const error = require('./middleware/error');

const express = require('express');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/devices', devices);
app.use('/sensors', sensors);
app.use('/data', dataPoints);
app.use(error); // should be last

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
