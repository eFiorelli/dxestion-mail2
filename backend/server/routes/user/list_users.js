const express = require('express');
const User = require('../../models/user');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const router = express.Router();

router.get('/users', [ checkUserToken, checkAdminRole ], async (req, res) => {
	try {
		const users = await User.find(
			{
				active: true,
				role: 'USER_ROLE'
			},
			'_id name email username created_date logo_img'
		).exec();
		if (!users) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting users',
				type: 6
			});
		} else {
			const count = await User.countDocuments({
				active: true,
				role: 'USER_ROLE'
			});
			return res.status(200).json({
				ok: true,
				users: users,
				count: count
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

router.get('/user/:id', [ checkUserToken ], async (req, res) => {
	const id = req.params.id;
	const is_admin = req.user.role === 'ADMIN_ROLE';
	try {
		const userDB = await User.findById(id);
		if (userDB) {
			if (userDB._id.toString() !== req.user._id && !is_admin) {
				return res.status(400).json({
					ok: false,
					err: 'You are not allowed to view this user',
					type: 7
				});
			} else {
				return res.status(200).json({
					ok: true,
					user: userDB
				});
			}
		} else {
			return res.status(400).json({
				ok: false,
				message: 'User not found',
				type: 4
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

module.exports = router;
