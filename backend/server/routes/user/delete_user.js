const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const app = express();

app.post('/update/user', (req, res) => {
	let body = req.body;

	User.findOne(
		{
			email: body.email
		},
		(err, userDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					message: 'Failed on creating user',
					err: err
				});
			}

			if (userDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'There already exists an user with this email'
					}
				});
			} else {
				let user = new User({
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					username: body.username,
					database_url: body.database_url,
					database_name: body.database_name,
					database_port: body.database_port,
					database_username: body.database_username,
					database_password: bcrypt.hashSync(body.database_password, 10)
				});

				user.save((err, userDB) => {
					if (err) {
						return res.status(400).json({
							ok: false,
							message: 'Failed on creating user',
							err: err
						});
					}

					res.json({
						ok: true,
						message: 'User successfully created',
						user: userDB
					});
				});
			}
		}
	);
});

module.exports = app;
