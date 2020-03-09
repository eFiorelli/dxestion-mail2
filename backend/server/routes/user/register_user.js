const express = require('express');
const bcrypt = require('bcrypt');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const router = express.Router();

router.post('/register/user', [ checkUserToken, checkAdminRole ], async (req, res) => {
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
				youtube: body.youtube,
				instagram: body.instagram,
				twitter: body.twitter,
				facebook: body.facebook,
				address: body.address,
				role: 'USER_ROLE',
				emailConfig: JSON.parse(body.emailConfig)
			});

			if (req.files) {
				const images = [
					{ type: 'logo', image: req.files.logo_image || '' },
					{ type: 'email', image: req.files.email_image || '' }
				];
				updatedUser = await saveUserImages(user, res, images);
				if (!updatedUser.ok) {
					return res.status(400).json({
						ok: false,
						message: updatedUser.error,
						type: 10
					});
				} else {
					user = updatedUser.userDB;
				}
			}

			const savedUser = await user.save();
			if (savedUser) {
				addToLog('info', `User "${savedUser.username}" added by user "${req.user.username}"`);
				return res.status(200).json({
					ok: true,
					message: 'User successfully created',
					user: savedUser
				});
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

saveUserImages = async (userDB, res, images) => {
	try {
		for (let i = 0; i < images.length; i++) {
			let file = images[i].image;
			if (file) {
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
				let filename = `${userDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;

				if (type === 'logo') {
					await file.mv(`uploads/user/${filename}`);
					userDB.email_img = filename;
				}
				if (type === 'email') {
					await file.mv(`uploads/user/email/${type}/${filename}`);
					userDB.logo_img = filename;
				}
			}
		}
		return { ok: true, userDB };
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
};

module.exports = router;
