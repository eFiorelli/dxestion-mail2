const express = require('express');
const bcrypt = require('bcrypt');
let { checkToken } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.put('/update/user/:id', checkToken, (req, res) => {
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

		userDB = {
			name: body.name,
			email: body.email,
			password: bcrypt.hashSync(body.password, 10),
			username: body.username,
			database_url: body.database_url,
			database_name: body.database_name,
			database_port: body.database_port,
			database_username: body.database_username,
			database_password: bcrypt.hashSync(body.database_password, 10)
		};

		userDB.save((err, savedUser) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err: err
				});
			}

			res.json({
				ok: true,
				user: savedUser
			});
		});
	});
});

module.exports = app;
