require('dotenv').config();

require('./config/database').connect();
const devices = require('./routes/devices');

const express = require('express');
const app = express();

app.use(express.json());

// routes
app.use('/devices', devices);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
