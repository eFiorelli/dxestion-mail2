var fs = require('fs');

/* Create uploads folder tree */
const uploads_dir = './uploads/';
const store_dir = './uploads/store/';
const user_dir = './uploads/user/';
const client_dir = './uploads/client/';
const background_dir = './uploads/store/background/';
const background_logo = './uploads/store/logo/';
const signature = './uploads/client/signature/';

if (!fs.existsSync(uploads_dir)) {
	fs.mkdirSync(uploads_dir);
}

if (!fs.existsSync(store_dir)) {
	fs.mkdirSync(store_dir);
}

if (!fs.existsSync(user_dir)) {
	fs.mkdirSync(user_dir);
}

if (!fs.existsSync(client_dir)) {
	fs.mkdirSync(client_dir);
}

if (!fs.existsSync(background_dir)) {
	fs.mkdirSync(background_dir);
}

if (!fs.existsSync(background_logo)) {
	fs.mkdirSync(background_logo);
}

if (!fs.existsSync(signature)) {
	fs.mkdirSync(signature);
}
