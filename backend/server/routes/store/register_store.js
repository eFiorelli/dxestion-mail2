const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkUserRole, checkAdminRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const app = express();

app.post('/register/store', [ checkUserToken, checkAdminRole, checkUserRole ], async (req, res) => {
	let body = req.body;

	try {
		const storeDB = await Store.findOne({
			username: body.username
		});
		if (storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'There already exists an store with this name',
				type: 9
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
				store_type: body.store_type,
				commerce_password: body.commerce_password,
				user: body.user
			});

			const savedStore = await store.save();
			if (savedStore) {
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
							image: req.files.logo_image
						}
					];
					await saveStoreImages(savedStore._id, res, images);
				} else {
					addToLog('info', `Store ${savedStore.name} created by user ${req.user.username}`);
					return res.status(200).json({
						ok: true,
						message: 'Store successfully created',
						store: savedStore,
						type: 1
					});
				}
			} else {
				return res.status(400).json({
					ok: false,
					message: 'Failed on creating store',
					type: 10
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

saveStoreImages = async (id, res, images) => {
	try {
		const storeDB = await Store.findById(id);
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

					let type = '';
					// Use the mv() method to place the file somewhere on your server
					if (images[i].type === `background_${i + 1}`) {
						storeDB.background_img[i] = filename;
						type = 'background';
					}
					if (images[i].type === 'logo') {
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
				addToLog('info', `Store ${updatedStore.name} created by user ${req.user.username}`);
				return res.status(200).json({
					ok: true,
					message: 'Store successfully created',
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

module.exports = app;
