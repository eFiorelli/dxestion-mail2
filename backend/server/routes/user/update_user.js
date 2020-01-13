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
		let userDB = await User.findById(id);
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: 'User not found',
				type: 4
			});
		} else {
			if (req.files) {
				const images = [
					{
						type: 'logo',
						image: req.files.logo_image || ''
					}
				];
				const updatedUser = await updateUserImages(userDB, res, images);
				if (!updatedUser.ok) {
					return res.status(500).json({
						ok: false,
						message: 'Fail moving image files',
						type: 1
					});
				} else {
					userDB = updatedUser.userDB;
				}
			}
			if (body.password) {
				await userDB.update({
					username: body.username,
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					logo_img: userDB.logo_img,
					youtube: body.youtube,
					instagram: body.instagram,
					twitter: body.twitter,
					facebook: body.facebook,
					address: body.address
				});
			} else {
				await userDB.update({
					username: body.username,
					name: body.name,
					email: body.email,
					logo_img: userDB.logo_img,
					youtube: body.youtube,
					instagram: body.instagram,
					twitter: body.twitter,
					facebook: body.facebook,
					address: body.address
				});
			}
			addToLog('info', `User "${userDB.username}" updated by user "${req.user.username}"`);
			return res.status(200).json({
				ok: true,
				message: 'User updated successfully',
				user: userDB,
				type: 1
			});
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
		let file = images[0].image;

		// Valid extensions
		let validExtensions = [ 'png', 'jpg', 'gif', 'jpeg' ];
		let shortedName = file.name.split('.');
		let extension = shortedName[shortedName.length - 1];

		if (validExtensions.indexOf(extension) < 0) {
			return { ok: false, error: 'Allowed extensions: ' + validExtensions.join(', ') };
		}

		// Change filename
		let filename = `${userDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;

		if (userDB.logo_img) {
			deleteUserFiles(userDB.logo_img);
		}

		await file.mv(`uploads/user/${filename}`);
		userDB.logo_img = filename;
		return { ok: true, userDB };
	} catch (err) {
		return { ok: false, error: 'Failed on moving file' };
	}
};

deleteUserFiles = (filename) => {
	let imagePath = path.resolve(`uploads/user/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = app;
