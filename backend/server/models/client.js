const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	email: {
		type: String,
		required: [true, 'Mail is required']
	},
	phone: {
		type: String,
		required: [true, 'Phone is required']
	},
	signature: {
		type: String,
		required: false
	},
	store: {
		type: Schema.Types.ObjectId,
		ref: 'Store',
		required: [true, 'Store is required']
	},
	active: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('Client', clientSchema);
