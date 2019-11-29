const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const app = express();

app.put('/update/store/:id', [checkUserToken, checkAdminRole, checkUserRole], async (req, res) => {
	let body = req.body;
	let id = req.params.id;

	try {
		const storeDB = await Store.findByIdAndUpdate(id, {
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
		storeDB.save();
		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'There is no store with that ID'
				}
			});
		} else {
			if (req.files) {
				const images = [
					{
						type: 'background',
						image: req.files.background_image || ''
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
				err: {
					message: 'Store does not exists'
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
				let filename = `${storeDB._id}-${new Date().getMilliseconds()}.${extension}`;

				// Use the mv() method to place the file somewhere on your server
				const oldFilenames = [storeDB.background_img, storeDB.logo_img];
				if (images[i].type === 'background') {
					storeDB.background_img = `${filename}`;
					deleteStoreFiles('background', oldFilenames[0]);
				}
				if (images[i].type === 'logo') {
					storeDB.logo_img = `${filename}`;
					deleteStoreFiles('logo', oldFilenames[1]);
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

			const updatedStore = await Store.findByIdAndUpdate(storeDB._id, {
				background_image: storeDB.background_image,
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
			err: err
		});
	}
};

deleteStoreFiles = (type, filename) => {
	let imagePath = path.resolve(`uploads/${type}/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = app;
