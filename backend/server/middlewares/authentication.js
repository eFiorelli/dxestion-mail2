const jwt = require('jsonwebtoken');

// =================
// Check for token
// =================
let checkToken = (req, res, next) => {
	// let token = req.get('token');
	let token = '';
	if (req.headers.authorization) {
		token = req.headers.authorization;
	} else {
		token = '';
	}

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Invalid token',
					err: err,
					token: token,
					seed: process.env.SEED
				}
			});
		}

		req.user = decoded.user;
		next();
	});
};

// =================
// check admin role
// =================
let checkAdminRole = (req, res, next) => {
	let user = req.user;

	if (user.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.json({
			ok: false,
			err: {
				message: 'User is not admin'
			}
		});
	}
};

module.exports = {
	checkToken,
	checkAdminRole
};
