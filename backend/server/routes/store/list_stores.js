const express = require('express');
const Store = require('../../models/store');
const { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const app = express();

app.get('/stores', [ checkUserToken, checkAdminRole, checkUserRole ], (req, res) => {
	Store.find(
		{ active: true, user: req.query.user_id },
		'_id name email username database_url database_name database_port database_username database_password logo_img'
	).exec((err, stores) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		Store.countDocuments({ active: true, user: req.user }, (err, count) => {
			return res.status(200).json({
				ok: true,
				stores: stores,
				count: count
			});
		});
	});
});

app.get('/store/:id', [ checkUserToken, checkAdminRole ], (req, res) => {
	let id = req.params.id;

	Store.findById(id, (err, storeDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		}

		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'Store not found'
			});
		} else {
			return res.status(200).json({
				ok: true,
				store: storeDB
			});
		}
	});
});

module.exports = app;
