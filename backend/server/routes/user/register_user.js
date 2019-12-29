const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const app = express();

app.post('/register/user', [ checkUserToken, checkAdminRole ], async (req, res) => {
	let body = req.body;

	try {
		const userDB = await User.findOne({
			username: body.username
		});
		if (userDB) {
			return res.status(400).json({
				ok: false,
				message: 'There already exists an user with this username',
				type: 2
			});
		} else {
			let user = new User({
				name: body.name,
				email: body.email,
				password: bcrypt.hashSync(body.password, 10),
				username: body.username,
				role: 'USER_ROLE'
			});

			const savedUser = await user.save();
			if (savedUser) {
				if (req.files) {
					const images = [
						{
							type: 'logo',
							image: req.files.logo_image
						}
					];
					await saveUserImages(savedUser._id, req, res, images);
				} else {
					logger().log({
						level: 'info',
						message: `User ${savedUser.username} added by user ${req.user.username}`
					});
					return res.status(200).json({
						ok: true,
						message: 'User successfully created',
						user: savedUser
					});
				}
			} else {
				return res.status(400).json({
					ok: false,
					message: 'Failed on creating user',
					type: 3
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

saveUserImages = async (id, req, res, images) => {
	try {
		const userDB = await User.findById(id);
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
			let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

			file.mv(`uploads/user/${filename}`, (err) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err: err
					});
				}
			});

			userDB.logo_img = filename;
			await userDB.save();
			logger().log({
				level: 'info',
				message: `User ${userDB.username} added by user ${req.user.username}`
			});
			return res.status(200).json({
				ok: true,
				message: 'User successfully created',
				user: userDB
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

module.exports = app;
