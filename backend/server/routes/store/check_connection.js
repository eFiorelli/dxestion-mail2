const express = require("express");
const sql = require('mssql');
const Store = require("../../models/store");
const User = require("../../models/user");
const {
	checkUserToken,
	checkAdminRole,
	checkUserRole
} = require("../../middlewares/authentication");
const app = express();

app.post("/store/check_connection", [checkUserToken, checkAdminRole], async (req, res) => {
	let data = req.body.data;
	let free_fields;
	try {
		if (body.data) {
			const connection = await checkDatabaseConnection(data);
			if (data.free_fields) {
				free_fields = await getFreeFields(data);
			}

			sql.close();
			if (connection.ok) {
				return res.status(200).json({
					ok: true,
					message: 'Connection success',
					free_fields: free_fields
				});
			} else {
				return res.status(200).json({
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
});

checkDatabaseConnection = async (connection_params) => {
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
			if (connection.ConnectionError) {
				return {
					ok: false,
					err: 'Connection error'
				}
			} else {
				return {
					ok: true,
					message: 'Connection success'
				};
			}
		}
	} catch (err) {
		return {
			ok: false,
			err: err
		}
	}
}

getFreeFields = async (connection_params) => {
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
			if (!connection.ConnectionError) {
				const query = await sql.query `select * from stuff`;
				if (query.code === 'EREQUEST') {
					return {
						ok: false
					}
				} else {
					return {
						ok: true
					}
				}
			} else {
				return {
					ok: false
				};
			}
		}
	} catch (err) {
		return {
			ok: false,
			err: err
		}
	}
}

module.exports = app;
