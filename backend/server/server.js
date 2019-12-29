require('./config/config');
require('./utils/folder_tree');
require('./utils/admin_user');

const mongoose = require('./utils/database');
const express = require('express');
const path = require('path');
const { createLogger, addToLog } = require('./utils/logger');
const { createSocketServer } = require('./utils/socket');
const https = require('https');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const options = {};

const app = express();

/* Create logger */
createLogger().then(() => {
	addToLog('info', 'App started');
});

/* Add headers */
app.use((req, res, next) => {
	const origin = req.get('origin');
	res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
	);

	/* intercept OPTIONS method */
	if (req.method === 'OPTIONS') {
		res.sendStatus(204);
	} else {
		next();
	}
});

/* Allow file uploading */
app.use(fileUpload());

/* parse application/x-www-form-urlencoded */
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
/* Parse raw requests */
app.use(bodyParser.raw());

/* parse application/json */
app.use(bodyParser.json());

/* Global route config */
app.use(require('./routes/index'));

/* Enable public directory */
app.use(express.static(path.resolve(__dirname, '../public/')));

/* Set the folder to store uploads */
app.use('/files', express.static(path.resolve(__dirname, '../uploads')));

/* Connect to database */
mongoose.createConnection();

/* Start app */
app.listen(process.env.PORT);

https.createServer(options, app).listen(process.env.SSL_PORT, () => {
	addToLog('info', `Environment: ${process.env.NODE_ENV}`);
	addToLog('info', `Listening on port ${process.env.PORT}`);
	addToLog('info', `Listening on port ${process.env.SSL_PORT}`);
	createSocketServer(https);
});
