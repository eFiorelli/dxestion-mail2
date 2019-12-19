const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.put('/update/user', [ checkUserToken, checkAdminRole ], async (req, res) => {
	let body = req.body;
	const id = body._id;

	try {
		const userDB = await User.findById(id);

		if (body.password) {
			await userDB.update({
				username: body.username,
				name: body.name,
				email: body.email,
				password: bcrypt.hashSync(body.password, 10)
			});
		} else {
			await userDB.update({ username: body.username, name: body.name, email: body.email });
		}

		//userDB.save();
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: 'There is no user with that ID',
				type: 5
			});
		} else {
			if (req.files) {
				const images = [
					{
						type: 'logo',
						image: req.files.logo_image || ''
					}
				];
				await updateUserImages(userDB, res, images);
			} else {
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					user: userDB,
					type: 1
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

updateUserImages = async (userDB, res, images) => {
	try {
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: 'User not found',
				type: 4
			});
		} else {
			let file = images[0].image;

			// Valid extensions
			let validExtensions = [ 'png', 'jpg', 'gif', 'jpeg' ];
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

			if (userDB.logo_img) {
				deleteUserFiles(userDB.logo_img);
			}

			file.mv(`uploads/user/${filename}`, (err) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: err,
						type: 1
					});
				}
			});

			userDB.logo_img = filename;
			await userDB.save();
			return res.status(200).json({
				ok: true,
				message: 'User updated successfully',
				user: userDB,
				type: 2
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
};

deleteUserFiles = (filename) => {
	let imagePath = path.resolve(`uploads/user/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = app;
