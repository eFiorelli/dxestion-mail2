var fs = require('fs');

/* Create uploads folder tree */
const uploads_dir = './uploads/';
const background_dir = './uploads/background/';
const background_logo = './uploads/logo/';
const signature = './uploads/signature/';

if (!fs.existsSync(uploads_dir)) {
	fs.mkdirSync(uploads_dir);
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
