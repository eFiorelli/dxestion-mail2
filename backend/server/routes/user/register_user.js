const express = require('express');
const bcrypt = require('bcrypt');
let {
	checkToken
} = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.post('/register/user', async (req, res) => {
	let body = req.body;

	const userDB = await User.findOne({
		email: body.email
	});
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
			database_password: body.database_password
		});

		const savedUser = await user.save();
		if (savedUser) {
			return res.status(200).json({
				ok: true,
				message: 'User successfully created',
				user: userDB
			});
		} else {
			return res.status(400).json({
				ok: false,
				message: 'Failed on creating user',
				err: err
			});
		}
	}
});

module.exports = app;