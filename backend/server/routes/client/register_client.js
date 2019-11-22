const express = require("express");
let {
	checkToken
} = require("../../middlewares/authentication");
const Client = require("../../models/client");

const sql = require("mssql");
const app = express();

app.post("/register/client", checkToken, (req, res) => {
	let body = req.body;

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

					if (sendClientToManager(req.user, client)) {
						return res.status(200).json({
							ok: true,
							message: "Client successfully created",
							client: clientDB
						});
					} else {
						return res.status(200).json({
							ok: false,
							message: 'Client already existst'
						});
					}
				});
			}
		}
	);
});

app.post("/test", checkToken, (req, res) => {
	let body = req.body;
	if (sendClientToManager(req.user, body)) {
		return res.status(200).json({
			ok: true,
			message: 'Client inserted'
		});
	} else {
		return res.status(200).json({
			ok: false,
			message: 'Client already existst'
		});
	}

});

sendClientToManager = async (connection_params, client) => {
	let id = 0;
	const config = {
		user: connection_params.database_username,
		password: 'masterkey',
		server: connection_params.database_url,
		database: connection_params.database_name
	};

	sql.on("error", err => {
		console.log('error 1', err);
		return false;
	});

	sql.connect(config).then(() => {
		return sql.query `SELECT * from CLIENTES where E_MAIL = ${client.email}`;

		/* select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='CLIENTES' */
		/* select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='CLIENTES_CAMPOS' */

	}).then(result => {
		if (result.recordset.length === 0) {
			sql.query `insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA) 
				values 
			(
				(SELECT ISNULL(MAX(CODCLIENTE)+1,0) FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)),
				${client.name},
				'4300000000',
				${client.email},
				${client.phone},
				'G',
				'1'
			)`;
			return true;
		} else {
			return false;
		}
	}).catch(err => {
		console.log('error 2', err);
		return false;
	});

	sql.on('error', err => {
		console.log('error 3', err);
		return false;
	});
};

module.exports = app;