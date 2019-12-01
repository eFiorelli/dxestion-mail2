const express = require('express');
let { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.delete('/update/user/:id', [checkUserToken, checkAdminRole], async (req, res) => {
	let id = req.params.id;

	try {
		const userDB = await User.findById(id);
		if (userDB) {
			userDB.active = false;
			const deletedUser = await userDB.save();
			if (deletedUser) {
				return res.status(200).json({
					ok: true,
					message: 'User deleted'
				});
			} else {
				return res.status(400).json({
					ok: true,
					message: 'User couldnt be deleted',
					type: 8
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

module.exports = app;