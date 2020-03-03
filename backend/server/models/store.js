const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let themeColors = {
	values: [ 'Red', 'Green', 'Blue', 'Purple', 'White', 'Black', 'Yellow', 'Orange' ],
	message: '{VALUE} is not a valid theme color'
};

let store_types = {
	values: [ 'FrontRetail/Manager', 'FrontRetail', 'FrontRest/Manager', 'FrontRest', 'Agora' ],
	message: '{VALUE} is not a valid shop type'
};

let Schema = mongoose.Schema;

let storeSchema = new Schema({
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
	commerce_password: {
		type: String,
		required: false,
		default: ''
	},
	free_fields: {
		type: Object,
		required: false
	},
	background_img: {
		type: [ String ],
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
	store_type: {
		type: String,
		default: 'FrontRetail/Manager',
		enum: store_types,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [ true, 'User is required' ]
	},
	gpdr_text: {
		type: String,
		required: [ true, 'GPDR text is required' ]
	},
	allowed_connections: {
		type: String,
		default: 1
	},
	active: {
		type: Boolean,
		default: true
	},
	created_date: {
		type: Date,
		default: Date.now
	}
});

storeSchema.methods.toJSON = function() {
	let store = this;
	let storeObject = store.toObject();
	delete storeObject.password;

	return storeObject;
};

storeSchema.plugin(uniqueValidator, {
	message: '{PATH} must be unique'
});

module.exports = mongoose.model('Store', storeSchema);
