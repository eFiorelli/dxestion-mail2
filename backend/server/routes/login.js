const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', async (req, res) => {
	let credentials = req.body.credentials;

	if (credentials) {
		username = credentials.username;
		password = credentials.password;
	} else {
		return res.status(500).json({
			ok: false,
			err: 'No user/password were provided'
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
					message: 'Wrong password'
				});
			}

			let token = jwt.sign({
				user: userDB
			}, process.env.SEED, {
				expiresIn: process.env.TOKEN_EXPIRATION
			});

			let returnedUser = {
				_id: userDB._id,
				username: userDB.username,
				name: userDB.name,
				email: userDB.email
			};

			return res.status(200).json({
				ok: true,
				user: returnedUser,
				token: token
			});
		} else {
			return res.status(400).json({
				ok: false,
				message: 'User does not exists'
			});
		}

	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Login server error',
			err: err
		});
	}
});

module.exports = app;