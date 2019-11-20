const express = require('express');
let { checkToken } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.delete('/update/user/:id', checkToken, (req, res) => {
	let body = req.body;
	let id = req.params.id;

	User.findById(id, (err, userDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
		}
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'User ID does not exists'
				}
			});
		}

		userDB.active = false;

		userDB.save((err, deletedUser) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err: err
				});
			}

			res.json({
				ok: true,
				user: deletedUser,
				message: 'User deleted'
			});
		});
	});
});

module.exports = app;
