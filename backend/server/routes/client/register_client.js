const express = require('express');
let {
	checkToken
} = require('../../middlewares/authentication');
const Client = require('../../models/client');

const sql = require('mssql');
const app = express();

app.post('/register/client', checkToken, async (req, res) => {
	let body = req.body;

	try {
		const client_insert = await sendClientToManager(req.user, body);
		switch (client_insert) {
			case 0:
				let client = new Client({
					name: body.name,
					email: body.email,
					phone: body.phone,
					user: req.user
				});
				const newClient = await client.save();
				if (newClient._id) {
					let filename = `${newClient.id}-${new Date().getMilliseconds()}.png`;
					let signature = req.files.image;

					signature.mv(`uploads/${type}/${filename}`, (err) => {
						if (err) {
							return res.status(500).json({
								ok: false,
								err: err
							});
						}
						uploadImage(id, res, filename);
					});
				}
				return res.status(200).json({
					ok: true,
					message: 'Client inserted',
					client: newClient
				});
			case 1:
				return res.status(400).json({
					ok: false,
					message: 'Client already existst'
				});
			case 2:
				return res.status(400).json({
					ok: false,
					message: 'Bad SQL statement'
				});
			case 3:
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
	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Server error',
			err: err
		});
	}
});

sendClientToManager = async (connection_params, client) => {
	const config = {
		user: connection_params.database_username,
		password: 'masterkey', //connection_params.database_password,
		server: connection_params.database_url,
		database: connection_params.database_name
	};

	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}/${config.database}`
		);
		if (connection) {
			const result = await sql.query `SELECT * from CLIENTES where E_MAIL = ${client.email}`;
			const max_id = (await sql.query `SELECT ISNULL(MAX(CODCLIENTE)+1,0) as ID FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)`)
				.recordset[0].ID;
			const client_account = (parseFloat(4300000000) + parseFloat(max_id)).toString();
			if (result.recordset.length === 0) {
				const query = await sql.query `insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA) values (${max_id}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1')`;
				if (query.code === 'EREQUEST') {
					/* Bad SQL statement */
					return 2;
				}
				if (query.rowsAffected[0] === 1) {
					/* Client inserted */
					return 0;
				}
			} else {
				/* Client already exists */
				return 1;
			}
		} else {
			/* Error connecting to SQL server */
			return 3;
		}
	} catch (err) {
		console.log(err)
		if (err.code === 'ESOCKET') {
			return 3;
		} else {
			/* Server error */
			return 4;
		}
	}
};

uploadImage = async (id, res, filename) => {
	try {
		const clientDB = await Client.findById(id);
		if (!clientDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'User does not exists'
				}
			});
		} else {
			clientDB.signature = filename;
			const updatedClient = await clientDB.save();
			if (updatedClient) {
				return res.status(200).json({
					ok: true,
					user: updatedClient,
					img: filename
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
};

module.exports = app;
