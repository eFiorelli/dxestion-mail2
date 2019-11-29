const express = require('express');
let { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const app = express();

app.delete('/update/store/:id', [checkUserToken, checkAdminRole], async (req, res) => {
	let id = req.params.id;

	try {
		const storeDB = await Store.findById(id);
		if (storeDB) {
			storeDB.active = false;
			const deletedStore = await storeDB.save();
			if (deletedStore) {
				return res.status(200).json({
					ok: true,
					message: 'Store deleted'
				});
			} else {
				return res.status(400).json({
					ok: true,
					message: 'Store couldnt be deleted'
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			message: 'Error deleting store',
			err: err
		});
	}
});

module.exports = app;