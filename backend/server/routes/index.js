const express = require('express')
const app = express()

app.use(require('./user'));
app.use(require('./login'));

app.use(require('./register_client'));
app.use(require('./register_user'));

app.use(require('./misc'));

module.exports = app;