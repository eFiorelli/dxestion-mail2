const express = require('express');
const sql = require('mssql');
const { checkUserToken, checkAdminRole, checkDistributorRole } = require('../../middlewares/authentication');
const router = express.Router();

router.post(
	'/store/check_connection/:type',
	[ checkUserToken, checkDistributorRole, checkDistributorRole, checkAdminRole ],
	async (req, res) => {
		let data = req.body.data;
		let type = req.params.type;
		let free_fields;
		let client_tariff;
		try {
			if (data) {
				const connection = await checkDatabaseConnection(data);
				if (connection.ok) {
					if (type == 'icg') {
						free_fields = await getFreeFields(data);
						client_tariff = await getClientTariff(data);
						return res.status(200).json({
							ok: true,
							message: 'Connection success',
							free_fields: free_fields,
							client_tariff: client_tariff
						});
					}
					if (type == 'agora') {
						return res.status(200).json({
							ok: true,
							message: 'Connection success'
						});
					}
				} else {
					return res.status(400).json({
						ok: false,
						err: 'Error connecting to database'
					});
				}
			}
		} catch (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
		}
	}
);

checkDatabaseConnection = async (connection_params) => {
	sql.close();
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		port: connection_params.database_port,
		database: connection_params.database_name,
		commerce_password: connection_params.commerce_password
	};
	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}:${config.port}/${config.database}`
		);
		if (connection) {
			if (connection.ConnectionError) {
				return { ok: false, err: 'Connection error' };
			} else {
				return { ok: true, message: 'Connection success' };
			}
		}
	} catch (err) {
		return { ok: false, err: err };
	}
};

getFreeFields = async (connection_params) => {
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		database: connection_params.database_name,
		commerce_password: connection_params.commerce_password
	};
	let free_fields = [];
	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}/${config.database}`
		);
		if (connection) {
			if (!connection.ConnectionError) {
				const query = await sql.query`select CAMPO, TIPO from CAMPOSLIBRESCONFIG where tabla = 2`;
				if (query.code === 'EREQUEST') {
					return { ok: false };
				} else {
					for (let rec in query.recordset) {
						if (query.recordset[rec]['TIPO'] === 4) {
							free_fields.push({
								type: 'checkbox',
								name: query.recordset[rec]['CAMPO'],
								values: []
							});
						}
						if (query.recordset[rec]['TIPO'] === 3) {
							const aux_query = await sql.query`select cc.campo, cp.VALOR from CAMPOSLIBRESCONFIG cc inner join camposlibresposibles cp on cc.campo = cp.campo where cc.tipo=3 and cc.tabla = 2 and cc.campo = ${query
								.recordset[rec]['CAMPO']}`;
							let aux_values = [];
							for (let aux_rec in aux_query.recordset) {
								aux_values.push(aux_query.recordset[aux_rec]['VALOR']);
							}
							free_fields.push({
								type: 'select',
								name: query.recordset[rec]['CAMPO'],
								values: aux_values
							});
						}
					}
					return { ok: true, free_fields };
				}
			} else {
				return { ok: false };
			}
		}
	} catch (err) {
		return { ok: false, err: err };
	}
};

getClientTariff = async (connection_params) => {
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		database: connection_params.database_name,
		commerce_password: connection_params.commerce_password
	};
	let client_tariff = [];
	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}/${config.database}`
		);
		if (connection) {
			if (!connection.ConnectionError) {
				const query = await sql.query`select IDTARIFAV, DESCRIPCION from TARIFASVENTA`;
				if (query.code === 'EREQUEST') {
					return { ok: false };
				} else {
					for (let rec in query.recordset) {
						client_tariff.push({
							id: query.recordset[rec]['IDTARIFAV'],
							name: query.recordset[rec]['DESCRIPCION'],
							active: false
						});
					}
					return { ok: true, client_tariff };
				}
			} else {
				return { ok: false };
			}
		}
	} catch (err) {
		return { ok: false, err: err };
	}
};

module.exports = router;
