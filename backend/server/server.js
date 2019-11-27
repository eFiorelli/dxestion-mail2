require('./config/config');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

var https = require('https');
var fs = require('fs');

var options = {};

var app = express();
var bodyParser = require('body-parser');

// Add headers
app.use((req, res, next) => {
	const origin = req.get('origin');

	// TODO Add origin validation
	res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
	);

	// intercept OPTIONS method
	if (req.method === 'OPTIONS') {
		res.sendStatus(204);
	} else {
		next();
	}
});

// parse application/x-www-form-urlencoded
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(bodyParser.raw());

// parse application/json
app.use(bodyParser.json());

/* Global route config */
app.use(require('./routes/index'));

/* Enable public directory */
app.use(express.static(path.resolve(__dirname, '../public/')));

/* Create uploads folder tree */
const uploads_dir = './uploads/';
const background_dir = './uploads/background/';
const background_logo = './uploads/logo/';

if (!fs.existsSync(uploads_dir)) {
	fs.mkdirSync(uploads_dir);
}

if (!fs.existsSync(background_dir)) {
	fs.mkdirSync(background_dir);
}

if (!fs.existsSync(background_logo)) {
	fs.mkdirSync(background_logo);
}

if (process.env.NODE_ENV === 'prod') {
	setTimeout(function () {
		mongoose.connect(process.env.URLDB, (err, res) => {
			if (err) throw err;
			console.log('Database....ONLINE');
		});
	}, 10000);
} else {
	mongoose.connect(process.env.URLDB, (err, res) => {
		if (err) throw err;
		console.log('Database....ONLINE');
	});
}

app.listen(process.env.PORT);

https.createServer(options, app).listen(process.env.SSL_PORT, () => {
	console.log(`Environment: ${process.env.NODE_ENV}`);
	console.log(`Listening on port ${process.env.PORT}`);
	console.log(`Listening on port ${process.env.SSL_PORT}`);
});
