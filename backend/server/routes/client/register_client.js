const express = require('express');
let { checkToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');

const sql = require('mssql');
const app = express();

app.post('/register/client', checkToken, async (req, res) => {
	let body = req.body;
	try {
		const clientDB = await Client.findOne({ email: body.email, user: req.user });
		if (clientDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'There already exists a client with this email for this user'
				}
			});
		} else {
			let client = new Client({
				name: body.name,
				email: body.email,
				phone: body.phone,
				user: req.user
			});
			const newClient = await client.save();
			if (newClient) {
				const client_insert = await sendClientToManager(req.user, body);
				switch (client_insert) {
					case 0:
						return res.status(200).json({
							ok: true,
							message: 'Client inserted',
							client: newClient
						});
					case 1:
						return res.status(200).json({
							ok: false,
							message: 'Client already existst'
						});
					case 2:
						return res.status(400).json({
							ok: false,
							message: 'Unable to connect with database server'
						});
					default:
						return res.status(500).json({
							ok: false,
							message: 'Server error'
						});
				}
			} else {
				return res.status(400).json({
					ok: false,
					message: 'Failed on creating client',
					err: err
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Error on creating user',
			err: err
		});
	}
});

sendClientToManager = async (connection_params, client) => {
	const config = {
		user: connection_params.database_username,
		password: 'masterkey',
		server: connection_params.database_url,
		database: connection_params.database_name
	};

	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}/${config.database}`
		);
		if (connection) {
			const result = await sql.query`SELECT * from CLIENTES where E_MAIL = ${client.email}`;
			const max_id = (await sql.query`SELECT ISNULL(MAX(CODCLIENTE)+1,0) as ID FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)`)
				.recordset[0].ID;
			const client_account = (parseFloat(4300000000) + parseFloat(max_id)).toString();
			if (result.recordset.length === 0) {
				const query = await sql.query`insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA) values (${max_id}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1')`;
				if (query.code === 'EREQUEST') {
					return 2;
				}
				if (query.rowsAffected[0] === 1) {
					return 0;
				}
			} else {
				return 1;
			}
		} else {
			return 3;
		}
	} catch (err) {
		return 4;
	}
};

module.exports = app;
