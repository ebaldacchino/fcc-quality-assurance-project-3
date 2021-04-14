const Book = require('../models/book');

const readBooks = async (req, res) => {
	const books = await Book.find();

	return res.status(200).json(books);
};

const deleteBooks = async (req, res) => {
	try {
		await Book.remove()
		return res.status(200).send('complete delete successful')
	} catch(err) {
		return res.status(200).send('error')
	}
};

module.exports = { readBooks, deleteBooks };
