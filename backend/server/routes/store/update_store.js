const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const app = express();

app.put('/update/store/:id', [ checkUserToken, checkAdminRole, checkUserRole ], async (req, res) => {
	let body = req.body;
	let id = req.params.id;

	try {
		const storeDB = await Store.findById(id);
		if (!body.password) {
			await Store.findByIdAndUpdate(storeDB._id, {
				id: body._id,
				name: body.name,
				email: body.email,
				username: body.username,
				database_url: body.database_url,
				database_name: body.database_name,
				database_port: body.database_port,
				database_username: body.database_username,
				database_password: body.database_password,
				user: body.user
			});
		} else {
			await Store.findByIdAndUpdate(storeDB._id, {
				id: body._id,
				name: body.name,
				email: body.email,
				password: bcrypt.hashSync(body.password, 10),
				username: body.username,
				database_url: body.database_url,
				database_name: body.database_name,
				database_port: body.database_port,
				database_username: body.database_username,
				database_password: body.database_password,
				user: body.user
			});
		}

		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'There is no store with that ID',
				type: 12
			});
		} else {
			if (req.files) {
				const images = [
					{
						type: 'background_1',
						image: req.files.background_img_1
					},
					{
						type: 'background_2',
						image: req.files.background_img_2
					},
					{
						type: 'background_3',
						image: req.files.background_img_3
					},
					{
						type: 'background_4',
						image: req.files.background_img_4
					},
					{
						type: 'background_5',
						image: req.files.background_img_5
					},
					{
						type: 'logo',
						image: req.files.logo_image || ''
					}
				];
				await updateStoreImages(storeDB, res, images);
			} else {
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					store: storeDB,
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

updateStoreImages = async (storeDB, res, images) => {
	try {
		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'Store not found',
				type: 11
			});
		} else {
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
					let filename = `${storeDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;

					// Use the mv() method to place the file somewhere on your server
					const oldFilenames = [ storeDB.background_img[i], storeDB.logo_img ];

					let type = '';
					if (images[i].type === `background_${i + 1}`) {
						if (storeDB.background_img[i]) {
							deleteStoreFiles('background', oldFilenames[0]);
						}
						storeDB.background_img[i] = filename;
						type = 'background';
					}
					if (images[i].type === 'logo') {
						if (storeDB.logo_img) {
							deleteStoreFiles('logo', oldFilenames[1]);
						}
						storeDB.logo_img = filename;
						type = 'logo';
					}
					file.mv(`uploads/store/${type}/${filename}`, (err) => {
						if (err) {
							return res.status(500).json({
								ok: false,
								err: err,
								type: 1
							});
						}
					});
				}
			}

			const updatedStore = await Store.findByIdAndUpdate(storeDB._id, {
				background_img: storeDB.background_img,
				logo_image: storeDB.logo_image
			});
			if (updatedStore) {
				updatedStore.save();
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					store: updatedStore,
					type: 2
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
};

deleteStoreFiles = (type, filename) => {
	let imagePath = path.resolve(`uploads/store/${type}/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = app;
