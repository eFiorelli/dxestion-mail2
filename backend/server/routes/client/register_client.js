const express = require('express');
let { checkUserToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');
const mailer = require('../../utils/mail');
const sql = require('mssql');
const app = express();

app.post('/register/client', checkUserToken, async (req, res) => {
	let body = req.body;
	let client_insert;
	try {
		switch (req.store.store_type) {
			case 'FrontRetail/Manager':
				client_insert = await sendClientToFRTManager(req.store, body);
				// client_insert = 0;
				await saveClient(client_insert, req.store, body, req.files, res);
				break;
			case 'FrontRest':
				/* Future versions */
				client_insert = await sendClientToFRS();
				await saveClient(client_insert, req.store, body, req.files, res);
				break;
			case 'Agora':
				/* Future versions */
				client_insert = await sendClientToAgora();
				await saveClient(client_insert, req.store, body, req.files, res);
				break;
			default:
				return res.status(400).json({
					ok: false,
					message: 'Bad store type',
					type: 24
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

saveClient = async (client_insert, store, body, files, res) => {
	sql.close();
	try {
		switch (client_insert) {
			case 0:
				let client = new Client({
					name: body.name,
					email: body.email,
					phone: body.phone,
					store: store
				});
				const existingClient = await Client.find({
					email: body.email,
					phone: body.phone,
					store: store
				});
				if (existingClient.length === 0) {
					if (files) {
						const response = await addSignature(client, res, files.signature);
						if (!response.ok) {
							return res.status(400).json({
								ok: false,
								message: response.error,
								type: 16
							});
						} else {
							client = response.clientDB;
						}
					}
					/*
					const mail = await sendMail(req.store, newClient);
					if (mail) {
						Ok response. Problem: Allow users account sending mails
					}
					*/
					const savedClient = await client.save();
					if (savedClient) {
						addToLog('info', `Client "${client.name}" created by store "${store.name}"`);
						return res.status(200).json({
							ok: true,
							message: 'Client inserted',
							type: 23
						});
					} else {
						return res.status(400).json({
							ok: false,
							message: 'Error saving client',
							type: 16
						});
					}
				} else {
					return res.status(400).json({
						ok: false,
						message: 'Client already exists',
						type: 16
					});
				}
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
			message: 'Server error',
			type: 1
		});
	}
};

sendClientToFRTManager = async (connection_params, client) => {
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		database: connection_params.database_name,
		commerce_password: connection_params.commerce_password
	};

	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}/${config.database}`
		);
		if (connection) {
			const result = await sql.query`SELECT * from CLIENTES where (E_MAIL = ${client.email}) OR (TELEFONO1 = ${client.phone})`;
			const max_id = (await sql.query`SELECT ISNULL(MAX(CODCLIENTE)+1,0) as ID FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)
				where CODCLIENTE <= (select VALOR from PARAMETROS where CLAVE='CONT' and SUBCLAVE='MAXIM' and USUARIO=1) and
				CODCLIENTE >= (select VALOR from PARAMETROS where CLAVE='CONT' and SUBCLAVE='MINIM' and USUARIO=1)`).recordset[0]
				.ID;
			const client_account = (parseFloat(4300000000) + parseFloat(max_id)).toString();
			if (result.recordset.length === 0) {
				const query = await sql.query`insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, NOMBRECOMERCIAL, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA, PASSWORDCOMMERCE, CIF, DIRECCION1, POBLACION, PROVINCIA, CODPOSTAL) values (${max_id}, ${client.name}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1', ${config.commerce_password}, ${client.cif}, ${client.address}, ${client.city}, ${client.province}, ${client.zip_code})`;
				if (query.code === 'EREQUEST') {
					/* Bad SQL statement */
					return 2;
				}
				if (query.rowsAffected[0] === 1) {
					/* Client inserted */
					/* `update contadores set valor = valor + 1 where codigo = 1 `*/
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

/* Future versions */
sendClientToFRS = async () => {};

/* Future versions */
sendClientToAgora = async () => {};

addSignature = async (clientDB, res, signature) => {
	try {
		let file = signature;
		extension = 'png';

		let filename = `${clientDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;
		await file.mv(`uploads/client/signature/${filename}`);

		clientDB.signature = filename;
		return {
			ok: true,
			clientDB
		};
	} catch (err) {
		return {
			ok: false,
			error: 'Error moving signature file'
		};
	}
};

sendMail = async (store, client) => {
	const mailOptions = {
		from: ` ${store.email}`,
		to: `${client.email}`,
		subject: `Gracias por registrarse en ${store.name}`,
		text: `Hemos recibido su solicitud. Muchas gracias`
	};
	try {
		const mail = await mailer.transporter.sendMail(mailOptions);
		if (mail) {
			addToLog('info', `Successfully sent mail to client "${client.name}"`);
			return true;
		} else {
			addToLog('error', `Error sending mail to client "${client.name}"`);
			return false;
		}
	} catch (err) {
		addToLog('error', `Error sending mail to client "${client.name} - ${err}"`);
		return false;
	}
};

module.exports = app;
