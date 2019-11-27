const express = require('express');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
let {
	checkToken
} = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.use(fileUpload());

app.post('/register/user', async (req, res) => {
	let body = req.body;

	const userDB = await User.findOne({
		email: body.email
	});
	if (userDB) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'There already exists an user with this email'
			}
		});
	} else {
		if (req.files.background_img) {
			// The name of the input field is used to retrieve the uploaded file
			let file = req.files.background_image;

			// Valid extensions
			let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
			let shortedName = file.name.split('.');
			let extension = shortedName[shortedName.length - 1];

			if (validExtensions.indexOf(extension) < 0) {
				return res.status(400).json({
					ok: false,
					err: {
						meesage: 'Allowed extensions: ' + validExtensions.join(', ')
					}
				});
			}

			// Change filename
			let type = 'background';
			let bg_filename = `${new Date().getMilliseconds()}.${extension}`;

			// Use the mv() method to place the file somewhere on your server
			file.mv(`uploads/${type}/${bg_filename}`, (err) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: err
					});
				}
				uploadImage(id, res, bg_filename, type);
			});
		}

		if (req.files.logo_img) {
			// The name of the input field is used to retrieve the uploaded file
			let file = req.files.logo_image;

			// Valid extensions
			let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
			let shortedName = file.name.split('.');
			let extension = shortedName[shortedName.length - 1];

			if (validExtensions.indexOf(extension) < 0) {
				return res.status(400).json({
					ok: false,
					err: {
						meesage: 'Allowed extensions: ' + validExtensions.join(', ')
					}
				});
			}

			// Change filename
			let logo_filename = `${new Date().getMilliseconds()}.${extension}`;
			let type = 'logo';

			// Use the mv() method to place the file somewhere on your server
			file.mv(`uploads/${type}/${logo_filename}`, (err) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: err
					});
				}
				uploadImage(id, res, logo_filename, type);
			});
		}

		let user = new User({
			name: body.name,
			email: body.email,
			password: bcrypt.hashSync(body.password, 10),
			username: body.username,
			database_url: body.database_url,
			database_name: body.database_name,
			database_port: body.database_port,
			database_username: body.database_username,
			database_password: body.database_password,
			background_img: '/files/background/' + bg_filename,
			logo_img: '/files/background/' + logo_filename
		});

		const savedUser = await user.save();
		if (savedUser) {
			return res.status(200).json({
				ok: true,
				message: 'User successfully created',
				user: userDB
			});
		} else {
			return res.status(400).json({
				ok: false,
				message: 'Failed on creating user',
				err: err
			});
		}
	}
});

uploadImage = async (id, res, filename, type) => {
	try {
		const userDB = await User.findById(id);
		if (!userDB) {
			deleteFile(filename, type);
			return res.status(400).json({
				ok: false,
				err: {
					message: 'User does not exists'
				}
			});
		} else {
			if (type === 'background') {
				userDB.background_img = filename;
			}

			if (type === 'logo') {
				userDB.logo_img = filename;
			}
			const updatedUser = await userDB.save();
			if (updatedUser) {
				return res.status(200).json({
					ok: true,
					user: updatedUser,
					img: filename
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
};

function deleteFile(imageName, type) {
	let imagePath = path.resolve(__dirname, `../uploads/${type}/${imageName}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
}

module.exports = app;
