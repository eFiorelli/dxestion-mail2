const { GOOGLE_CONFIG } = require('../../config/config');
const express = require('express');
const User = require('../../models/user');
const Store = require('../../models/store');
const gmail = require('../../utils/gmail_sync');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const app = express();

/*

This function takes the code returned by the authURL and stores the token

*/
app.post('/user/:id/gmail_sync/authurl', [ checkUserToken, checkAdminRole ], async (req, res) => {
	const body = req.body;
	const id = req.params.id;
	const user = await User.findById(id);
	gmail
		.getNewToken(GOOGLE_CONFIG, body.key)
		.then(async (token) => {
			await user.update({
				googleToken: token
			});
			return res.status(200).json({
				ok: true
			});
		})
		.catch((error) => {
			return res.status(200).json({
				ok: false,
				message: error
			});
		});
});

/*

This function tries to get Google contacts, ERP contacts
and compare them to add contacts to Gmail
If user hasn't a Google token, the response is the AuthURL

*/
app.get('/user/:id/gmail_sync', [ checkUserToken, checkAdminRole ], async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	const gmail_response = await gmail.init(GOOGLE_CONFIG, '', user.googleToken);
	if (gmail_response.ok) {
		const store = await Store.findOne({ user: id });
		const erp_contacts = await getERPcontacts(store);
		if (erp_contacts.ok) {
			const contactsUpdated = await compareContacts(gmail_response.response, erp_contacts);
			return res.status(200).json({
				response: contactsUpdated,
				ok: true
			});
		} else {
			return res.status(200).json({
				message: 'Unable to get ERP contacts',
				ok: false
			});
		}
	} else {
		console.log('err');
		/* This is returned when user has NO Google token */
		return res.status(200).json({
			response: gmail_response.response,
			ok: false
		});
	}
});

module.exports = app;
