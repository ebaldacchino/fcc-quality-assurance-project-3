'use strict';

const { readBooks, deleteBooks } = require('../controllers/books');
const {
	createBook,
	readBook,
	updateBook,
	deleteBook,
} = require('../controllers/book');
module.exports = (app) => {
	app
		.route('/api/books')
		.post(createBook)

		.get(readBooks)

		.delete(deleteBooks);

	app
		.route('/api/books/:id')
		.get(readBook)

		.post(updateBook)

		.delete(deleteBook);
};
