// ======================
// Ports
// ======================
process.env.PORT = process.env.PORT || 3000;

process.env.SSL_PORT = process.env.SSL_PORT || 8080;

// ======================
// Environment
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Token expiracy
// ======================
// 60 segundos * 60 minutos * 24 horas * 30 dias * 365 dias
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30 * 365;

// ======================
// Token SEED
// ======================
process.env.SEED = process.env.SEED || 'develop-seed';

// ======================
// Database
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/dxestionMail';
	process.env.MONGO_URI = urlDB;
}

const EMAIL = {
	service: 'Gmail',
	auth: {
		user: 'miguel@dxestion.com',
		pass: 'migueldx'
	}
};

// ======================
// Email config
// ======================

module.exports = { EMAIL };

// ======================
// Email config
// ======================
process.env.ROOT_PASSWORD = process.env.ROOT_PASSWORD || 'Dxestion0180';

/**************************      ERROR CODES:      **************************/
/*
**** Register user ****
1.- Server error
2.- There already exists an user with this username
3.- Failed on creating user
4.- User not found

**** Update user ****
5.- There is no user with that ID

**** List users ****
6.- Error getting users
7.- You are not allowed to view this user

**** Delete users ****
8.- User couldnt be deleted


**** Register store ****
9.- There already exists an store with this name
10.- Failed on creating store
11.- Store not found

**** Update store ****
12.- There is no store with that ID

**** List stores ****
13.- Error getting stores
14.- You are not allowed to view this store

**** Delete store ****
15.- Store couldnt be deleted


**** Create client ****
16.- Client already exists
17.- Bad SQL statement
18.- Unable to connect with database server
19.- Client not found
20.- Error updating client


**** Login ****
21.- No user/password were provided
22.- Wrong username/password

**** Other errors ****
23.- Error saving client in MongoDB
24.- Wrong store type

*/
/**************************      ERROR CODES      **************************/
