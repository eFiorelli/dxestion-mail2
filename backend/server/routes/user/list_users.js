const express = require('express');
const User = require('../../models/user');
const { checkUserToken, checkAdminRole, checkAdminUserRole } = require('../../middlewares/authentication');
const app = express();

app.get('/users', [checkUserToken, checkAdminRole, checkAdminUserRole], (req, res) => {
	User.find(
		{ active: true, role: 'USER_ROLE', admin_user: req.user },
		'_id name email username database_url database_name database_port database_username database_password logo_img'
	).exec((err, users) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		User.countDocuments({ active: true, role: 'USER_ROLE', admin_user: req.user }, (err, count) => {
			return res.status(200).json({
				ok: true,
				users: users,
				count: count
			});
		});
	});
});

app.get('/user/:id', [checkUserToken, checkAdminRole], (req, res) => {
	let id = req.params.id;

	User.findById(id, (err, userDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: 'User not found'
			});
		} else {
			return res.status(200).json({
				ok: true,
				user: userDB
			});
		}
	});
});

module.exports = app;
