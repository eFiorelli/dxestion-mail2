const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	email: {
		type: String,
		required: [ true, 'Mail is required' ]
	},
	phone: {
		type: String,
		required: [ true, 'Phone is required' ]
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [ true, 'User is required' ]
	},
	active: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('Client', clientSchema);
