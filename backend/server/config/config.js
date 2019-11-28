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
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;