'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/config');
const UsersRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/users' ,UsersRoutes);



app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
