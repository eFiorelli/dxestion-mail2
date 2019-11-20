const express = require('express');
let { checkToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');
const app = express();

app.post('/register/client', checkToken, (req, res) => {
	let body = req.body;
	console.log(req.user);

	Client.findOne(
		{
			email: body.email,
			user: req.user
		},
		(err, clientDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					message: 'Failed on creating user',
					err: err
				});
			}

			if (clientDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'There already exists a client with this email'
					}
				});
			} else {
				let client = new Client({
					name: body.name,
					email: body.email,
					phone: body.phone,
					user: req.user
				});

				client.save((err, clientDB) => {
					if (err) {
						return res.status(400).json({
							ok: false,
							message: 'Failed on creating client',
							err: err
						});
					}

					res.json({
						ok: true,
						message: 'Client successfully created',
						client: clientDB
					});
				});
			}
		}
	);
});

module.exports = app;
