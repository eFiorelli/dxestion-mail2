const express = require("express");
let {
	checkToken
} = require("../../middlewares/authentication");
const Client = require("../../models/client");

const sql = require("mssql");
const app = express();

app.post("/register/client", checkToken, (req, res) => {
	let body = req.body;
	console.log(req.user);

	Client.findOne({
			email: body.email,
			user: req.user
		},
		(err, clientDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					message: "Failed on creating user",
					err: err
				});
			}

			if (clientDB) {
				return res.status(400).json({
					ok: false,
					err: {
						message: "There already exists a client with this email"
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
							message: "Failed on creating client",
							err: err
						});
					}

					res.json({
						ok: true,
						message: "Client successfully created",
						client: clientDB
					});
				});
			}
		}
	);
});

app.post("/test", checkToken, (req, res) => {
	sendClientToManager(req.user);
	res.json({
		ok: true
	});
});

sendClientToManager = (connection_params) => {

	const config = {
		user: connection_params.database_username,
		password: 'masterkey',
		server: connection_params.database_url,
		database: connection_params.database_name
	};

	sql.on("error", err => {
		console.log('error 1', err);
	});

	sql.connect(config).then(() => {
		return sql.query `select * from CLIENTES`;
	}).then(result => {
		console.log(result.recordset);
	}).catch(err => {
		console.log('error 2', err);
	})

	sql.on('error', err => {
		console.log('error 3', err);
	})
};

module.exports = app;