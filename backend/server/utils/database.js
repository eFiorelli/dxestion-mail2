const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
	logger().log({
		level: 'info',
		message: 'Connection established'
	});
});

mongoose.connection.on('reconnected', () => {
	logger().log({
		level: 'error',
		message: 'Database reconnected'
	});
});

mongoose.connection.on('disconnected', () => {
	logger().log({
		level: 'error',
		message: 'Database disconnected'
	});
	setTimeout(() => {
		createConnection();
	}, 5000);
});

mongoose.connection.on('close', () => {
	logger().log({
		level: 'info',
		message: 'Connection closed'
	});
});

mongoose.connection.on('error', (error) => {
	logger().log({
		level: 'error',
		message: 'Database ERROR'
	});
});

createConnection = async () => {
	if (process.env.NODE_ENV === 'prod') {
		setTimeout(async () => {
			try {
				await mongoose.connect(process.env.MONGO_URI, {
					useNewUrlParser: true
				});
			} catch (error) {
				logger().log({
					level: 'error'
				});
			}
		}, 10000);
	} else {
		try {
			await mongoose.connect(process.env.MONGO_URI, {
				useNewUrlParser: true
			});
		} catch (error) {
			logger().log({
				level: 'error'
			});
		}
	}
};

module.exports = {
	createConnection
};
