const express = require("express");
const bcrypt = require("bcrypt");
let {
	checkUserToken,
	checkUserRole,
	checkAdminRole
} = require("../../middlewares/authentication");
const Store = require("../../models/store");
const app = express();

app.post(
	"/register/store",
	[checkUserToken, checkAdminRole, checkUserRole],
	async (req, res) => {
		let body = req.body;

		try {
			const storeDB = await Store.findOne({
				username: body.username
			});
			if (storeDB) {
				return res.status(400).json({
					ok: false,
					message: "There already exists an store with this username"
				});
			} else {
				let store = new Store({
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					username: body.username,
					database_url: body.database_url,
					database_name: body.database_name,
					database_port: body.database_port,
					database_username: body.database_username,
					database_password: body.database_password,
					user: req.user
				});

				const savedStore = await store.save();
				if (savedStore) {
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
						await saveStoreImages(savedStore._id, res, images);
					} else {
						return res.status(200).json({
							ok: true,
							message: "Store successfully created",
							store: savedStore,
							type: 1
						});
					}
				} else {
					return res.status(400).json({
						ok: false,
						message: "Failed on creating store"
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

saveStoreImages = async (id, res, images) => {
	try {
		const storeDB = await Store.findById(id);
		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				message: "Store does not exists"
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
						storeDB.background_img = `${filename}`;
					}
					if (images[i].type === "logo") {
						storeDB.logo_img = `${filename}`;
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
			const updatedStore = await storeDB.save();
			if (updatedStore) {
				return res.status(200).json({
					ok: true,
					message: "Store successfully created",
					store: updatedStore,
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
