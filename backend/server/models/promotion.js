const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let promotionSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	content: {
		type: Object,
		required: [ true, 'Promotion content is required' ]
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [ true, 'User is required' ]
	},
	from_date: {
		type: Date,
		required: [ true, 'From date is required' ]
	},
	to_date: {
		type: Date,
		required: [ true, 'To date is required' ]
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

module.exports = mongoose.model('Promotion', promotionSchema);
