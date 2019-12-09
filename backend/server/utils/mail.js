const config = require("../config/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: config.EMAIL.service,
	auth: {
		user: config.EMAIL.auth.user,
		pass: config.EMAIL.auth.pass
	}
});

module.exports = { transporter };
