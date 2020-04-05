const { GOOGLE_CONFIG } = require('../config/config');
const User = require('../models/user');
const Store = require('../models/store');
const { google } = require('googleapis');
const sql = require('mssql');

const SCOPES = [ 'https://www.googleapis.com/auth/contacts' ];

// async function init(credentials, authCode, token) {
// 	return await authorize(credentials, authCode, token);
// }

async function init(credentials, authCode, token) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	if (!token) {
		return { ok: false, response: getNewToken(credentials, authCode) };
	}
	oAuth2Client.setCredentials(token);
	return { ok: true, response: await listContacts(oAuth2Client) };
}

function getNewToken(credentials, authCode) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	// console.log('Authorize this app by visiting this url:', authUrl);
	if (!authCode) {
		return authUrl;
	}

	return new Promise((resolve, reject) => {
		oAuth2Client.getToken(authCode, (err, token) => {
			if (err) {
				console.error('Error retrieving access token');
				reject(err);
			}
			resolve(token);
		});
	});
}

async function listContacts(auth) {
	try {
		const contacts = [];
		const service = google.people({ version: 'v1', auth });
		return new Promise((resolve, reject) => {
			service.people.connections.list(
				{
					personFields: [ 'names', 'emailAddresses', 'phoneNumbers' ],
					resourceName: 'people/me',
					pageSize: 2000
				},
				(err, res) => {
					if (err) {
						console.error('The API returned an error: ' + err);
						reject(err);
					}
					const connections = res.data.connections;
					if (connections) {
						connections.forEach((person) => {
							contacts.push({
								name: person.names ? person.names[0].displayName : '',
								phone_1: person.phoneNumbers ? person.phoneNumbers[0].value : '',
								phone_2: person.phoneNumbers[1] ? person.phoneNumbers[1].value : '',
								phone_3: person.phoneNumbers[2] ? person.phoneNumbers[2].value : '',
								email: person.emailAddresses ? person.emailAddresses[0].value : ''
							});
						});
					} else {
						console.log('No connections found.');
					}
					resolve(contacts);
				}
			);
		});
	} catch (error) {
		console.log('Error: ', error);
	}
}

async function syncAllContacts() {
	/* Retrieve all users and sync contacts */
	query = User.find({
		active: true,
		googleToken: { $exists: true }
	});
	query.select('_id name googleToken');
	const userList = await query.exec();
	for (let user of userList) {
		addToLog('info', `Start Gmail sync for user: "${user.name}"`);
		let store = await Store.findOne({ user: user });
		let ERPContacts = await getERPcontacts(store);
		if (ERPContacts.ok) {
			let GoogleContacts = await init(GOOGLE_CONFIG, '', user.googleToken);
			let newContacts = await compareContacts(GoogleContacts.response, ERPContacts.response);
			await insertContacts(user, newContacts);
		} else {
			addToLog('error', `Unable to get contacts from ERP for user: "${user.name}"`);
		}
		addToLog('info', `End Gmail sync for user: "${user.name}"`);
	}
}

getERPcontacts = async (connection_params) => {
	const config = {
		user: connection_params.database_username,
		password: connection_params.database_password,
		server: connection_params.database_url,
		port: connection_params.database_port,
		database: connection_params.database_name
	};

	try {
		const connection = await sql.connect(
			`mssql://${config.user}:${config.password}@${config.server}:${config.port}/${config.database}`
		);
		if (connection) {
			const result = await sql.query`SELECT NOMBRECLIENTE as name, E_MAIL as email, TELEFONO1 as phone_1, MOBIL as phone_2, TELEFONO2 as phone_3 from CLIENTES where (E_MAIL is not null OR TELEFONO1 is not null)`;
			if (result.recordset.length === 0) {
				if (query.code === 'EREQUEST') {
					/* Bad SQL statement */
					return { ok: false, error: 2 };
				}
			} else {
				return { ok: true, response: result.recordset };
			}
		} else {
			/* Error connecting to SQL server */
			const error_message = `Unable to get ERP contacts for this address: "${config.user}@${config.server}"`;
			addToLog('error', error_message);
			return { ok: false, error: 3, message: error_message };
		}
	} catch (err) {
		if (err.code === 'ESOCKET') {
			const error_message = `Unable to get ERP contacts for this address: "${config.user}@${config.server}"`;
			addToLog('error', error_message);
			return { ok: false, error: 3, message: error_message };
		} else {
			/* Server error */
			const error_message = `Unable to get ERP contacts for this address: "${config.user}@${config.server}"`;
			addToLog('error', error_message);
			return { ok: false, error: 4, message: error_message };
		}
	}
};

parseERPContacts = async (contacts) => {
	for (let contact of contacts) {
		contact.phone_1 = contact.phone_1.trim();
		if (contact.phone_2 !== null && contact.phone_2.length <= 0) {
			contact.phone_2 = null;
		}
		if (contact.phone_3 !== null && contact.phone_3.length <= 0) {
			contact.phone_3 = null;
		}
	}
	return contacts;
};

compareContacts = async (google, erpaux) => {
	erp = await parseERPContacts(erpaux);
	let newContacts = [];
	for (let i = 0; i < erp.length; i++) {
		let insert = true;
		if (erp[i].phone_1) {
			for (let j = 0; j < google.length; j++) {
				if (
					erp[i].phone_1 == google[j].phone_1 ||
					erp[i].phone_2 == google[j].phone_2 ||
					erp[i].phone_3 == google[j].phone_3
				) {
					insert = false;
				}
			}
			if (insert) {
				newContacts.push(erp[i]);
				insert = true;
			}
		}
	}
	return newContacts;
};

insertContacts = async (user, contacts) => {
	if (contacts.length === 0) {
		addToLog('info', `No contacts inserted for user: "${user.name}"`);
		return { ok: true, count: 0 };
	}

	try {
		const { client_secret, client_id, redirect_uris } = GOOGLE_CONFIG.installed;
		const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		auth.setCredentials(user.googleToken);
		let contactInsertedCount = 0;
		for (let contact of contacts) {
			let contactObject = {
				emailAddresses: [ { value: contact.email } ],
				names: [ { displayName: contact.name, givenName: contact.name } ],
				phoneNumbers: [
					{
						value: contact.phone_1,
						canonicalForm: `+34${contact.phone_1}`,
						type: 'mobile',
						formattedType: 'Mobile'
					},
					{
						value: contact.phone_2,
						canonicalForm: `+34${contact.phone_2}`,
						type: 'mobile',
						formattedType: 'Mobile,'
					},
					{
						value: contact.phone_3,
						canonicalForm: `+34${contact.phone_3}`,
						type: 'mobile',
						formattedType: 'Mobile'
					}
				]
			};

			contactInsertedCount += 1;
			const service = google.people({ version: 'v1', auth });
			const { data: newContact } = await service.people.createContact({
				requestBody: contactObject
			});
		}
		addToLog('info', `Contacts inserted for user "${user.name}": ${contactInsertedCount}`);
		return { ok: true, count: contactInsertedCount };
	} catch (err) {
		addToLog('error', `Error creating contacts for user: "${user.name}": ${err}`);
		return { ok: false, err };
	}
};

module.exports = { init, getNewToken, syncAllContacts };
