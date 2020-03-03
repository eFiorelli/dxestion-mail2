const winston = require('winston');
const moment = require('moment');

let io;
let loggerObject = null;
let filename = '';

/* Log format */
const myFormat = winston.format.printf(({ level, message }) => {
	return `[${moment().format('DD-MM-YYYY HH:mm:ss')}] - ${level}: ${message}`;
});

logger = function() {
	return loggerObject;
};

addToLog = function(level, message) {
	io = require('./socket').getIO();
	const date = new Date();
	const newFilename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';
	if (newFilename !== filename) {
		return new Promise((resolve, reject) => {
			loggerObject = winston.createLogger({
				format: winston.format.combine(myFormat),
				transports: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: `./logs/${newFilename}`
					})
				]
			});
			logger().log({
				level,
				message
			});
			resolve(true);
		});
	}
	logger().log({
		level,
		message
	});
	if (io) {
		io.emit('log message', `[${moment().format('DD-MM-YYYY HH:mm:ss')}] - ${level}: ${message}`);
	}
};

createLogger = function() {
	const date = new Date();
	filename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';
	return new Promise((resolve, reject) => {
		loggerObject = winston.createLogger({
			format: winston.format.combine(myFormat),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
					filename: `./logs/${filename}`
				})
			]
		});
		resolve(true);
	});
};

/* Function to set date format */
formatDate = function(n) {
	return n < 10 ? '0' + n : n;
};

sio = function() {
	return io;
};

module.exports = {
	logger,
	createLogger,
	addToLog,
	sio
};
