const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const app = express();

app.post('/login', async (req, res) => {
	let credentials = req.body.credentials;

	if (credentials) {
		username = credentials.username;
		password = credentials.password;
	} else {
		return res.status(500).json({
			ok: false,
			err: 'No user/password were provided',
			type: 21
		});
	}

	try {
		const userDB = await User.findOne({
			username: username
		});

		if (userDB) {
			if (!bcrypt.compareSync(password, userDB.password) && userDB.password !== password) {
				return res.status(400).json({
					ok: false,
					message: 'Wrong username/password',
					type: 22
				});
			}

			let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

			let returnedUser = {
				_id: userDB._id,
				username: userDB.username,
				name: userDB.name,
				email: userDB.email,
				role: userDB.role
			};

			return res.status(200).json({
				ok: true,
				user: returnedUser,
				is_admin: userDB.role === 'ADMIN_ROLE',
				token: token
			});
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

module.exports = app;
