const express = require('express');
let { checkUserToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');
const sql = require('mssql');
const app = express();

app.post('/register/client', checkUserToken, async (req, res) => {
	let body = req.body;
	try {
		const client_insert = await sendClientToManager(req.store, body);
		//const client_insert = 0;
		switch (client_insert) {
			case 0:
				let client = new Client({
					name: body.name,
					email: body.email,
					phone: body.phone,
					store: req.store
				});
				const existingClient = await Client.find({ email: body.email, phone: body.phone });
				if (existingClient.length === 0) {
					const newClient = await client.save();
					if (newClient._id) {
						if (req.files) {
							let signature = req.files.signature;
							await addSignature(newClient._id, res, signature);
						}
					}
				}
				return res.status(200).json({
					ok: true,
					message: 'Client inserted'
				});
			case 1:
				return res.status(400).json({
					ok: false,
					message: 'Client already exists',
					type: 16
				});
			case 2:
				return res.status(400).json({
					ok: false,
					message: 'Bad SQL statement',
					type: 17
				});
			case 3:
				return res.status(400).json({
					ok: false,
					message: 'Unable to connect with database server',
					type: 18
				});
			default:
				return res.status(500).json({
					ok: false,
					message: 'Server error',
					type: 1
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

sendClientToManager = async (connection_params, client) => {
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		database: connection_params.database_name
	};

	try {
		const connection = await sql.connect(`mssql://${config.user}:${config.password}@${config.server}/${config.database}`);
		if (connection) {
			const result = await sql.query`SELECT * from CLIENTES where (E_MAIL = ${client.email}) OR (TELEFONO1 = ${client.phone})`;
			const max_id = (await sql.query`SELECT ISNULL(MAX(CODCLIENTE)+1,0) as ID FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)`)
				.recordset[0].ID;
			const client_account = (parseFloat(4300000000) + parseFloat(max_id)).toString();
			if (result.recordset.length === 0) {
				const query = await sql.query`insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA) values (${max_id}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1')`;
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
		if (err.code === 'ESOCKET') {
			return 3;
		} else {
			/* Server error */
			return 4;
		}
	}
};

addSignature = async (clientDB, res, signature) => {
	try {
		if (!clientDB) {
			return res.status(400).json({
				ok: false,
				message: 'Client not found',
				type: 19
			});
		} else {
			let file = signature;

			// Valid extensions
			let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
			let shortedName = file.name.split('.');
			let extension = shortedName[shortedName.length - 1];

			if (validExtensions.indexOf(extension) < 0) {
				return res.status(400).json({
					ok: false,
					meesage: 'Allowed extensions: ' + validExtensions.join(', ')
				});
			}

			let filename = `${clientDB._id}-${new Date().getMilliseconds()}.${extension}`;

			file.mv(`uploads/signature/${filename}`, (err) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: err,
						type: 1
					});
				}
			});

			const updatedClient = await Client.findByIdAndUpdate(clientDB._id, {
				signature: filename
			});
			if (updatedClient) {
				updatedClient.save();
				return;
			} else {
				return res.status(400).json({
					ok: true,
					message: 'Error updating client',
					type: 20
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
};

module.exports = app;
