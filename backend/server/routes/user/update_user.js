const express = require('express');
const bcrypt = require('bcrypt');
let {
	checkToken
} = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.put('/update/user/:id', checkToken, async (req, res) => {
	let body = req.body;
	let id = req.params.id;

	let newUser = {
		name: body.name,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		username: body.username,
		database_url: body.database_url,
		database_name: body.database_name,
		database_port: body.database_port,
		database_username: body.database_username,
		database_password: body.database_password
	};

	try {
		const userDB = await User.findByIdAndUpdate(id, newUser);
		if (userDB) {
			return res.status(200).json({
				ok: true,
				message: 'User updated successfully',
				user: savedUser
			});
		} else {
			return res.status(400).json({
				ok: false,
				message: 'User ID does not exists'
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Server error',
			err: err
		});
	}
});

module.exports = app;