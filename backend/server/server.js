require("./config/config");
require("./utils/folder_tree");
require("./utils/admin_user");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const {
	logger,
	createLogger
} = require('./utils/logger');

const https = require("https");
const options = {};

const fileUpload = require("express-fileupload");

const app = express();
const bodyParser = require("body-parser");

createLogger().then(() => {
	logger().log({
		level: 'info',
		message: 'App started'
	});
});

// Add headers
app.use((req, res, next) => {
	const origin = req.get("origin");

	// TODO Add origin validation
	res.header("Access-Control-Allow-Origin", origin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
	);

	// intercept OPTIONS method
	if (req.method === "OPTIONS") {
		res.sendStatus(204);
	} else {
		next();
	}
});

/* Allow file uploading */
app.use(fileUpload());

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
app.use(require("./routes/index"));

/* Enable public directory */
app.use(express.static(path.resolve(__dirname, "../public/")));

app.use("/files", express.static(path.resolve(__dirname, "../uploads")));

if (process.env.NODE_ENV === "prod") {
	setTimeout(function () {
		mongoose.connect(
			process.env.URLDB, {
				useNewUrlParser: true
			},
			(err, res) => {
				if (err) {
					logger().log({
						level: 'error',
						message: err
					});
				}
				logger().log({
					level: 'info',
					message: 'Database ONLINE'
				});
			}
		);
	}, 10000);
} else {
	mongoose.connect(
		process.env.URLDB, {
			useNewUrlParser: true
		},
		(err, res) => {
			if (err) {
				logger().log({
					level: 'error',
					message: err
				});
			}
			logger().log({
				level: 'info',
				message: 'Database ONLINE'
			});
		}
	);
}

app.listen(process.env.PORT);

https.createServer(options, app).listen(process.env.SSL_PORT, () => {
	logger().log({
		level: 'info',
		message: `Environment: ${process.env.NODE_ENV}`
	});
	logger().log({
		level: 'info',
		message: `Listening on port ${process.env.PORT}`
	});
	logger().log({
		level: 'info',
		message: `Listening on port ${process.env.SSL_PORT}`
	});
});
