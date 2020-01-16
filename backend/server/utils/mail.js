const config = require('../config/config');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

/*
const transporter = nodemailer.createTransport({
	service: config.EMAIL.service,
	auth: {
		user: config.EMAIL.auth.user,
		pass: config.EMAIL.auth.pass
	}
});
*/

let sendMail = async (store, client, user) => {
	const config = {
		backend_url: process.env.BACKEND_URL,
		email_img_path: '/files/user/email/'
	};
	const emailConfig = user.emailConfig;
	const transporter = nodemailer.createTransport({
		host: emailConfig.smtp,
		port: emailConfig.port,
		secure: true, // upgrade later with STARTTLS
		auth: {
			user: emailConfig.emailAccount,
			pass: emailConfig.emailPassword
		}
	});
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
	const mailOptions = {
		from: ` ${emailConfig.emailAccount}`,
		to: `${client.email}`,
		subject: `Gracias por registrarse en ${store.name}`,
		text: `Hemos recibido su solicitud. Muchas gracias`,
		template: 'welcome',
		context: {
			config: config,
			client: client.name,
			store: store.name,
			name: user.name,
			email_img: user.email_img,
			facebook: user.facebook,
			twitter: user.twitter,
			instagram: user.instagram,
			youtube: user.youtube
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
