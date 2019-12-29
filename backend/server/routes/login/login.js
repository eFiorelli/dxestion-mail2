const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Store = require('../../models/store');
const app = express();

app.post('/login/:type', async (req, res) => {
	const credentials = req.body.credentials;
	const type = req.params.type;

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
		if (type === 'user') {
			const userDB = await User.findOne({
				username: username
			});
			await userLogin(res, userDB, credentials);
		}
		if (type === 'store') {
			const storeDB = await Store.findOne({
				username: username
			});
			await storeLogin(res, storeDB, credentials);
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

userLogin = async (res, userDB, credentials) => {
	if (userDB) {
		if (!bcrypt.compareSync(credentials.password, userDB.password) && userDB.password !== credentials.password) {
			return res.status(400).json({
				ok: false,
				message: 'Wrong username/password',
				type: 22
			});
		}

		const token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

		const returnedUser = {
			_id: userDB._id,
			username: userDB.username,
			name: userDB.name,
			email: userDB.email,
			role: userDB.role
		};

		addToLog('info', `User ${returnedUser.username} logged in admin app`);

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
};

storeLogin = async (res, storeDB, credentials) => {
	if (storeDB) {
		if (!bcrypt.compareSync(credentials.password, storeDB.password) && storeDB.password !== credentials.password) {
			return res.status(400).json({
				ok: false,
				message: 'Wrong username/password',
				type: 22
			});
		}

		const token = jwt.sign({ store: storeDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

		const returnedStore = {
			_id: storeDB._id,
			username: storeDB.username,
			name: storeDB.name,
			email: storeDB.email,
			background_img: storeDB.background_img,
			logo_img: storeDB.logo_img
		};

		addToLog('info', `Store ${returnedStore.name} logged in client app`);

		return res.status(200).json({
			ok: true,
			store: returnedStore,
			token: token
		});
	} else {
		return res.status(400).json({
			ok: false,
			message: 'Store not found',
			type: 4
		});
	}
};

module.exports = app;
