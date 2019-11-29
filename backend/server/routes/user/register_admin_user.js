const express = require("express");
const bcrypt = require("bcrypt");
let {
	checkUserToken,
	checkAdminUserRole,
	checkAdminRole
} = require("../../middlewares/authentication");
const AdminUser = require("../../models/user");
const app = express();

app.post(
	"/register/user",
	[checkUserToken, checkAdminUserRole, checkAdminRole],
	async (req, res) => {
		let body = req.body;

		try {
			const adminUserDB = await AdminUser.findOne({
				username: body.username
			});
			if (adminUserDB) {
				return res.status(400).json({
					ok: false,
					message: "There already exists an user with this username"
				});
			} else {
				let adminUser = new AdminUser({
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					username: body.username,
					role: 'USER_ADMIN_ROLE'
				});

				const savedAdminUser = await adminUser.save();
				if (savedAdminUser) {
					if (req.files) {
						const images = [
							{
								type: "logo",
								image: req.files.logo_image
							}
						];
						await saveAdminImages(savedAdminUser._id, res, images);
					} else {
						return res.status(200).json({
							ok: true,
							message: "User successfully created",
							user: savedAdminUser,
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

saveAdminImages = async (id, res, images) => {
	try {
		const adminUserDB = await User.findById(id);
		if (!adminUserDB) {
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

					if (images[i].type === "logo") {
						adminUserDB.logo_img = `${filename}`;
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
			const updatedAdminUser = await adminUserDB.save();
			if (updatedAdminUser) {
				return res.status(200).json({
					ok: true,
					message: "User successfully created",
					user: updatedAdminUser,
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
