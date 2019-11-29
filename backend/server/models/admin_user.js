const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
	values: ['ADMIN_ROLE', 'USER_ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;

let adminUserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	username: {
		type: String,
		unique: true,
		required: [true, 'Name is required']
	},
	email: {
		type: String,
		required: [true, 'Mail is required']
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	logo_img: {
		type: String,
		required: false
	},
	role: {
		type: String,
		default: 'ADMIN_USER_ROLE',
		enum: validRoles
	},
	active: {
		type: Boolean,
		default: true
	}
});

adminUserSchema.methods.toJSON = function () {
	let adminUser = this;
	let adminUserObject = adminUser.toObject();
	delete adminUserObject.password;

	return adminUserObject;
};

adminUserSchema.plugin(uniqueValidator, {
	message: '{PATH} must be unique'
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
