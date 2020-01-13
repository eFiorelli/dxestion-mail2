const config = require('../config/config');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
	service: config.EMAIL.service,
	auth: {
		user: config.EMAIL.auth.user,
		pass: config.EMAIL.auth.pass
	}
});
/*
const transporter = nodemailer.createTransport({
	service: config.EMAIL.service,
	auth: {
		user: config.EMAIL.auth.user,
		pass: config.EMAIL.auth.pass
	}
});
*/

const handlebarsOptions = {
	viewEngine: {
		extName: '.hbs',
		partialsDir: './server/utils/email_templates/',
		defaultLayout: ''
	},
	viewPath: './server/utils/email_templates/',
	extName: '.hbs'
};

transporter.use('compile', hbs(handlebarsOptions));

let sendMail = async (store, client, user) => {
	const mailOptions = {
		from: ` ${store.email}`,
		to: `${client.email}`,
		subject: `Gracias por registrarse en ${store.name}`,
		text: `Hemos recibido su solicitud. Muchas gracias`,
		template: 'welcome',
		context: {
			client: client.name,
			store: store.name,
			user: user
		}
	};
	try {
		const mail = await transporter.sendMail(mailOptions);
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

module.exports = { sendMail };
