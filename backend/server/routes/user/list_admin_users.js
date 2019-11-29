const express = require('express');
const AdminUser = require('../../models/admin_user');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const app = express();

app.get('/adminusers', [checkUserToken, checkAdminRole], (req, res) => {
	AdminUser.find(
		{ active: true, role: 'USER_ADMIN_ROLE' },
		'_id name email username logo_img'
	).exec((err, adminUsers) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		AdminUser.countDocuments({ active: true, role: 'USER_ADMIN_ROLE' }, (err, count) => {
			return res.status(200).json({
				ok: true,
				users: adminUsers,
				count: count
			});
		});
	});
});

app.get('/adminuser/:id', [checkUserToken, checkAdminRole], (req, res) => {
	let id = req.params.id;

	AdminUser.findById(id, (err, adminUserDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		if (!adminUserDB) {
			return res.status(400).json({
				ok: false,
				message: 'User not found'
			});
		} else {
			return res.status(200).json({
				ok: true,
				user: adminUserDB
			});
		}
	});
});

module.exports = app;
