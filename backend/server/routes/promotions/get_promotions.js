const express = require('express');
const Promotion = require('../../models/promotion');
const Store = require('../../models/store');
const User = require('../../models/user');
const { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const router = express.Router();

router.get('/promotions', [ checkUserToken, checkUserRole ], async (req, res) => {
	try {
		let query = '';
		if (!req.query.user_id && req.user.role === 'ADMIN_ROLE') {
			query = Promotion.find({});
		} else {
			query = Promotion.find({
				active: true,
				user: req.query.user_id || req.user._id
			});
			query.select('_id name content created_date from_date to_date');
		}

		const promotions = await query.exec();
		if (!promotions) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting promotions',
				type: 13
			});
		}

		return res.status(200).json({
			ok: true,
			promotions: promotions
		});
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

router.get('/promotion/:id', [ checkUserToken ], async (req, res) => {
	const id = req.params.id;
	const is_admin = req.user.role === 'ADMIN_ROLE';
	try {
		const promotionDB = await Promotion.findById(id);
		if (promotionDB) {
			if (promotionDB.user.toString() !== req.user._id && !is_admin) {
				return res.status(400).json({
					ok: false,
					err: 'You are not allowed to view this promotion',
					type: 14
				});
			} else {
				return res.status(200).json({
					ok: true,
					promotion: promotionDB
				});
			}
		} else {
			return res.status(400).json({
				ok: false,
				message: 'Promotion not found'
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
});

module.exports = router;
