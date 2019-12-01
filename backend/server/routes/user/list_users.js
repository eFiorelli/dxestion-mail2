const express = require('express');
const User = require('../../models/user');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const app = express();

app.get('/users', [ checkUserToken, checkAdminRole ], async (req, res) => {
	try {
		const users = await User.find({ active: true, role: 'USER_ROLE' }, '_id name email username logo_img').exec();
		if (!users) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting users'
			});
		} else {
			const count = await User.countDocuments({ active: true, role: 'USER_ROLE' });
			return res.status(200).json({
				ok: true,
				users: users,
				count: count
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
});

app.get('/user/:id', [ checkUserToken ], async (req, res) => {
	let id = req.params.id;
	let is_admin = false;
	try {
		const user = await User.findById(req.user._id);
		is_admin = user.role === 'ADMIN_ROLE';
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}

	if (id !== req.user._id && !is_admin) {
		return res.status(400).json({
			ok: false,
			err: 'You are not allowed to view this user'
		});
	} else {
		try {
			const userDB = await User.findById(id);
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
		} catch (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
		}
	}
});

module.exports = app;
