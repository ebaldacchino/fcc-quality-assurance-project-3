const Book = require('../models/book');

const createBook = async (req, res) => {
	const { title } = req.body;

	if (!title) {
		return res.status(200).send('missing required field title');
	}
	try {
		const book = new Book({ title });
		await book.save();

		const { _id } = book;
		return res.status(200).json({ _id, title });
	} catch (err) {
		return res.status(200).json({ error: err });
	}
};

const readBook = async (req, res) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });

		if (book) {
			return res.status(200).json(book);
		}
	} catch (err) {
		console.log('Error finding a book');
	}
	return res.status(200).send('no book exists');
};

const updateBook = async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;
	if (!comment) {
		return res.status(200).send('missing required field comment');
	}
	if (!id) {
		return res.status(200).send('missing required field title');
	}
	try {
		const book = await Book.findOne({ _id: id });

		if (book) {
			book.comments = [...book.comments, comment];
			book.commentcount++;
			await book.save();
			return res.status(200).json(book);
		}
	} catch (err) {
		console.log('Error finding a book');
	}
	return res.status(200).send('no book exists');
};

const deleteBook = async (req, res) => {
	try {
		const book = await Book.findByIdAndDelete(req.params.id);
		if (book) {
			return res.status(200).send('delete successful');
		}
	} catch (err) {
		return res.status(200).send('no book exists');
	}
	return res.status(200).send('no book exists');
};

module.exports = { createBook, readBook, updateBook, deleteBook };
