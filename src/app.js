const express = require('express');
const morgan = require('morgan');
const {default: helmet} = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');
const app = express();


// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
// checkOverload();

module.exports = app;