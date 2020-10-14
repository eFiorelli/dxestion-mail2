const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

let sendMail = async (store, client, user) => {
    const config = {
        backend_url: process.env.BACKEND_URL,
        email_img_path: '/files/user/email/',
        logo_img_path: '/files/user/'
    };
    let emailConfig;
    if (user) {
        emailConfig = user.emailConfig;
    } else {
        return false;
    }
    console.log(emailConfig);
    const transporter = nodemailer.createTransport({
        host: emailConfig.smtp,
        port: emailConfig.port,
        secure: false, // upgrade later with STARTTLS
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
    const templateName = emailConfig.emailAccount.split('@')[1].split('.')[0];
    const mailOptions = {
        from: ` ${emailConfig.emailAccount}`,
        to: `${client.email}`,
        subject: `Gracias por registrarse en ${store.name}`,
        text: `Hemos recibido su solicitud. Muchas gracias`,
        template: templateName,
        context: {
            config: config,
            client: client.name,
            store: store.name,
            name: user.name,
            store_email: user.email,
            email_img: user.email_img,
            logo_img: user.logo_img,
            facebook: user.facebook,
            twitter: user.twitter,
            instagram: user.instagram,
            youtube: user.youtube,
            website: user.website,
            commerce_password: store.commerce_password,
            email_content: user.email_text
        }
    };
    try {
        const mail = await transporter.sendMail(mailOptions);
        if (mail) {
            addToLog('info', `Successfully sent mail to client "${client.name}"`);
            return true;
        } else {
            addToLog('warn', `Error sending mail to client "${client.name}"`);
            return false;
        }
    } catch (err) {
        addToLog('warn', `Error sending mail to client "${client.name} - ${err}"`);
        return false;
    }
};

module.exports = { sendMail };
