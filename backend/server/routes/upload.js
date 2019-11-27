const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.post('/upload/:type/:id', function (req, res) {
	let type = req.params.type;
	let id = req.params.id;

	if (!req.files.image) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No files were uploaded.'
			}
		});
	}

	// Valid image types
	let validTypes = ['background', 'logo'];
	if (validTypes.indexOf(type) < 0) {
		return res.status(400).json({
			ok: false,
			meesage: 'Allowed types: ' + validTypes.join(', ')
		});
	}

	// The name of the input field is used to retrieve the uploaded file
	let file = req.files.image;

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
	let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

	// Use the mv() method to place the file somewhere on your server
	file.mv(`uploads/${type}/${filename}`, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
		}
		uploadImage(id, res, filename, type);
	});
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
