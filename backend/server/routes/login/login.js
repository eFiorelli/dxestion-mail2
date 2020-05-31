const express = require('express');
const bcrypt = require('bcrypt');
const session = require('../../utils/session');

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Store = require('../../models/store');
const router = express.Router();

router.post('/login/:type', async (req, res) => {
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
			await storeLogin(req, res, storeDB, credentials);
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

router.get('/logout/:type/:sessionID', async (req, res) => {
	const type = req.params.type;
	const sessionID = req.params.sessionID;
	try {
		if (type === 'store') {
			const currentSession = await session.destroySession(sessionID);
			return res.status(200).json({
				ok: true
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

		addToLog('info', `User "${returnedUser.username}" logged in admin app`);

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

storeLogin = async (req, res, storeDB, credentials) => {
	if (storeDB) {
		if (!bcrypt.compareSync(credentials.password, storeDB.password) && storeDB.password !== credentials.password) {
			return res.status(400).json({
				ok: false,
				message: 'Wrong username/password',
				type: 22
			});
		}

		const user = await User.findById(storeDB._id);

		const token = jwt.sign({ store: storeDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

		const returnedStore = {
			_id: storeDB._id,
			username: storeDB.username,
			name: storeDB.name,
			email: storeDB.email,
			background_img: storeDB.background_img,
			logo_img: storeDB.logo_img,
			free_fields: storeDB.free_fields,
			gpdr_text: storeDB.gpdr_text,
			allowed_connections: storeDB.allowed_connections,
			website: user.website
		};

		const newSession = await session.createSession(returnedStore, req.session, req.sessionID);
		if (newSession.ok) {
			addToLog('info', `Store "${returnedStore.name}" logged in client app`);
			return res.status(200).json({
				ok: true,
				store: returnedStore,
				session: newSession.session,
				token: token
			});
		} else {
			return res.status(200).json({
				ok: false,
				message: newSession.message
			});
		}
	} else {
		return res.status(400).json({
			ok: false,
			message: 'Store not found',
			type: 4
		});
	}
};

module.exports = router;
