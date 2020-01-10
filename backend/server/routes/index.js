const express = require('express');
const app = express();

/* Login routes */

app.post('/test', (req, res) => {
	res.status(200).json({ ok: true });
});
app.use(require('./login/login'));

/* Client routes */
app.use(require('./client/register_client'));
app.use(require('./client/list_clients'));

/* Store routes */
app.use(require('./store/register_store'));
app.use(require('./store/update_store'));
app.use(require('./store/delete_store'));
app.use(require('./store/list_stores'));
app.use(require('./store/check_connection'));

/* User routes */
app.use(require('./user/register_user'));
app.use(require('./user/update_user'));
app.use(require('./user/delete_user'));
app.use(require('./user/list_users'));

app.use(require('./logger/logger'));

/* Other stuff */
app.use(require('./upload'));

module.exports = app;
