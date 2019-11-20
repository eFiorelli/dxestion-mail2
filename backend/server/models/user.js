const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
	values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
	message: '{VALUE} is not a valid role'
};

let themeColors = {
	values: [ 'Red', 'Green', 'Blue', 'Purple', 'White', 'Black', 'Yellow', 'Orange' ],
	message: '{VALUE} is not a valid theme color'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	username: {
		type: String,
		unique: true,
		required: [ true, 'Name is required' ]
	},
	email: {
		type: String,
		required: [ true, 'Mail is required' ]
	},
	password: {
		type: String,
		required: [ true, 'Password is required' ]
	},
	database_url: {
		type: String,
		required: [ true, 'Database URL is required' ]
	},
	database_name: {
		type: String,
		required: [ true, 'Database NAME is required' ]
	},
	database_port: {
		type: String,
		required: [ true, 'Database PORT is required' ]
	},
	database_username: {
		type: String,
		required: [ true, 'Database username is required' ]
	},
	database_password: {
		type: String,
		required: [ true, 'Database password is required' ]
	},
	free_fields: {
		type: Object,
		required: false
	},
	background_img: {
		type: String,
		required: false
	},
	logo_img: {
		type: String,
		required: false
	},
	theme_color: {
		type: String,
		default: 'Black',
		enum: themeColors
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: validRoles
	},
	active: {
		type: Boolean,
		default: true
	}
});

userSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
};

userSchema.plugin(uniqueValidator, {
	message: '{PATH} must be unique'
});

module.exports = mongoose.model('User', userSchema);
