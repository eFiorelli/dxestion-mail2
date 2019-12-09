require('../config/config');
const User = require('../models/user');

createAdminUser = async () => {
	try {
		const userDB = await User.findOne({
			username: 'dxestion'
		});
		if (userDB) {
			logger().log({
				level: 'warn',
				message: 'Admin user already exists'
			});
		} else {
			let user = new User({
				name: 'dxestion',
				email: 'soporte@dxestion.com',
				password: 'Dxestion0180',
				username: 'dxestion',
				role: 'ADMIN_ROLE'
			});

			const savedUser = await user.save();
			if (savedUser) {
				logger().log({
					level: 'info',
					message: 'Admin user created sucessfully'
				});
			} else {
				logger().log({
					level: 'error',
					message: 'Error saving admin user'
				});
			}
		}
	} catch (err) {
		logger().log({
			level: 'error',
			message: 'Error creating admin user'
		});
	}
};

module.exports = createAdminUser();
