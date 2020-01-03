require('../config/config');
const fs = require('fs');
let io;

createSocketServer = (server) => {
	io = require('socket.io')(server);
	io.listen(3001);
	addToLog('info', `Socket server listening on port ${process.env.SOCKET_PORT}`);
	io.on('connection', (socket) => {
		socket.on('log message', (message) => {
			getLogMessages();
		});
	});
};

getLogMessages = () => {
	const date = new Date();
	const filename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';

	if (fs.existsSync(`./logs/${filename}`)) {
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(`./logs/${filename}`)
		});

		lineReader.on('line', function(line) {
			io.emit('log message', line);
		});
	}
};

/* Function to set date format */
formatDate = (n) => {
	return n < 10 ? '0' + n : n;
};

getIO = () => {
	return io;
};

module.exports = {
	getIO,
	getLogMessages,
	createSocketServer
};
