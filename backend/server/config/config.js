// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000

process.env.SSL_PORT = process.env.SSL_PORT || 8080


// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ======================
// Vencimiento del token
// ======================
// 60 segundos * 60 minutos * 24 horas * 30 dias
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30


// ======================
// SEED del token
// ======================
process.env.SEED = process.env.SEED || 'develop-seed';


// ======================
// Base de datos
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/dxestionMail';
    // urlDB = 'mongodb://mongo:27017/angular-node-test';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;