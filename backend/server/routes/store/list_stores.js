const express = require('express');
const Store = require('../../models/store');
const User = require('../../models/user');
const { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const app = express();

app.get('/stores', [ checkUserToken, checkUserRole ], async (req, res) => {
	try {
		let query = '';
		if (req.user.role === 'ADMIN_ROLE') {
			query = Store.find({});
		} else {
			query = Store.find({
				active: true,
				user: req.query.user_id
			});
			query.select(
				'_id name email username database_url database_name database_port database_username database_password background_img logo_img'
			);
		}

		const stores = await query.exec();
		if (!stores) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting stores',
				type: 13
			});
		}

		const count = await Store.countDocuments({
			active: true,
			user: req.user
		});
		return res.status(200).json({
			ok: true,
			stores: stores,
			count: count
		});
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

app.get('/store/:id', [ checkUserToken ], async (req, res) => {
	const id = req.params.id;
	const is_admin = req.user.role === 'ADMIN_ROLE';
	try {
		const storeDB = await Store.findById(id);
		if (storeDB) {
			if (storeDB.user.toString() !== req.user._id && !is_admin) {
				return res.status(400).json({
					ok: false,
					err: 'You are not allowed to view this store',
					type: 14
				});
			} else {
				return res.status(200).json({
					ok: true,
					store: storeDB
				});
			}
		} else {
			return res.status(400).json({
				ok: false,
				message: 'Store not found'
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
});

module.exports = app;
