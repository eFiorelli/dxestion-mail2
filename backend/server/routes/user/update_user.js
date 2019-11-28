const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.put('/update/user/:id', [checkUserToken, checkAdminRole], async (req, res) => {
	let body = req.body;
	let id = req.params.id;

	try {
		const userDB = await User.findByIdAndUpdate(id, {
			name: body.name,
			email: body.email,
			password: bcrypt.hashSync(body.password, 10),
			username: body.username,
			database_url: body.database_url,
			database_name: body.database_name,
			database_port: body.database_port,
			database_username: body.database_username,
			database_password: body.database_password
		});
		userDB.save();
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'There is no user with that ID'
				}
			});
		} else {
			if (req.files) {
				const images = [
					{ type: 'background', image: req.files.background_image || '' },
					{ type: 'logo', image: req.files.logo_image || '' }
				];
				await saveImages(userDB, res, images);
			} else {
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					user: userDB
				});
			}

		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

saveImages = async (userDB, res, images) => {
	try {
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'User does not exists'
				}
			});
		} else {
			for (let i = 0; i < images.length; i++) {
				let file = images[i].image;

				// Valid extensions
				let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
				let shortedName = file.name.split('.');
				let extension = shortedName[shortedName.length - 1];

				if (validExtensions.indexOf(extension) < 0) {
					return res.status(400).json({
						ok: false,
						meesage: 'Allowed extensions: ' + validExtensions.join(', ')
					});
				}

				// Change filename
				let filename = `${userDB._id}-${new Date().getMilliseconds()}.${extension}`;

				// Use the mv() method to place the file somewhere on your server
				const oldFilenames = [userDB.background_img, userDB.logo_img];
				if (images[i].type === 'background') {
					userDB.background_img = `${filename}`;
					deleteFiles('background', oldFilenames[0]);
				}
				if (images[i].type === 'logo') {
					userDB.logo_img = `${filename}`;
					deleteFiles('logo', oldFilenames[1]);
				}

				file.mv(`uploads/${images[i].type}/${filename}`, (err) => {
					if (err) {
						return res.status(500).json({
							ok: false,
							err: err
						});
					}
				});
			}

			const updatedUser = await User.findByIdAndUpdate(userDB._id, {
				background_image: userDB.background_image,
				logo_image: userDB.logo_image
			});
			if (updatedUser) {
				updatedUser.save();
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					user: updatedUser
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

deleteFiles = (type, filename) => {
	let imagePath = path.resolve(`uploads/${type}/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = app;
