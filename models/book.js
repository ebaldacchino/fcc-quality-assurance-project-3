const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	comments: { type: Array, default: [] },
	title: { type: String, default: '' },
	commentcount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', BookSchema);
