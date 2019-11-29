const express = require('express');
const app = express();

/* Login routes */
app.use(require('./login/login'));

/* Client routes */
app.use(require('./client/register_client'));

/* */
app.use(require('./user/register_admin_user'));
app.use(require('./user/update_admin_user'));
app.use(require('./user/delete_admin_user'));
app.use(require('./user/list_admin_users'));

/* User routes */
app.use(require('./user/register_user'));
app.use(require('./user/update_user'));
app.use(require('./user/delete_user'));
app.use(require('./user/list_users'));

/* Other stuff */
app.use(require('./upload'));

module.exports = app;
