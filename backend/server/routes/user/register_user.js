const express = require("express");
const bcrypt = require("bcrypt");
let {
	checkUserToken,
	checkAdminRole
} = require("../../middlewares/authentication");
const User = require("../../models/user");
const app = express();

app.post(
	"/register/user",
	[checkUserToken, checkAdminRole],
	async (req, res) => {
		let body = req.body;

		try {
			const userDB = await User.findOne({
				username: body.username
			});
			if (userDB) {
				return res.status(400).json({
					ok: false,
					message: "There already exists an user with this email"
				});
			} else {
				let user = new User({
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

				const savedUser = await user.save();
				if (savedUser) {
					if (req.files) {
						const images = [
							{
								type: "background",
								image: req.files.background_image
							},
							{
								type: "logo",
								image: req.files.logo_image
							}
						];
						await saveImages(savedUser._id, res, images);
					} else {
						return res.status(200).json({
							ok: true,
							message: "User successfully created",
							user: savedUser,
							type: 1
						});
					}
				} else {
					return res.status(400).json({
						ok: false,
						message: "Failed on creating user"
					});
				}
			}
		} catch (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
		}
	}
);

saveImages = async (id, res, images) => {
	try {
		const userDB = await User.findById(id);
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: "User does not exists"
			});
		} else {
			for (let i = 0; i < images.length; i++) {
				let file = images[i].image;
				if (file) {
					// Valid extensions
					let validExtensions = ["png", "jpg", "gif", "jpeg"];
					let shortedName = file.name.split(".");
					let extension = shortedName[shortedName.length - 1];

					if (validExtensions.indexOf(extension) < 0) {
						return res.status(400).json({
							ok: false,
							meesage:
								"Allowed extensions: " +
								validExtensions.join(", ")
						});
					}

					// Change filename
					let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

					// Use the mv() method to place the file somewhere on your server
					if (images[i].type === "background") {
						userDB.background_img = `${filename}`;
					}
					if (images[i].type === "logo") {
						userDB.logo_img = `${filename}`;
					}

					file.mv(`uploads/${images[i].type}/${filename}`, err => {
						if (err) {
							return res.status(500).json({
								ok: false,
								err: err
							});
						}
					});
				}
			}
			const updatedUser = await userDB.save();
			if (updatedUser) {
				return res.status(200).json({
					ok: true,
					message: "User successfully created",
					user: updatedUser,
					type: 2
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

module.exports = app;
