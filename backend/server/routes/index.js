const express = require('express');
const app = express();

/* Login routes */
app.use(require('./login'));

/* Client routes */
app.use(require('./client/register_client'));

/* User routes */
app.use(require('./user/register_user'));
app.use(require('./user/update_user'));
app.use(require('./user/delete_user'));

/* Other stuff */
app.use(require('./misc'));
app.use(require('./user'));

module.exports = app;
