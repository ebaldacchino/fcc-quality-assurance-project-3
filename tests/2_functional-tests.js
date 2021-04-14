/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testId;
const testTitle = 'test';

suite('Functional Tests', () => {
	/*
	 * ----[EXAMPLE TEST]----
	 * Each test should completely test the response of the API end-point including response status code!
	 */
	test('#example Test GET /api/books', (done) => {
		chai
			.request(server)
			.get('/api/books')
			.end((err, res) => {
				assert.equal(res.status, 200, 'Response should be valid');
				assert.isArray(res.body, 'response should be an array');
				if (res.body[0]) {
					assert.property(
						res.body[0],
						'commentcount',
						'Books in array should contain commentcount'
					);
					assert.property(
						res.body[0],
						'title',
						'Books in array should contain title'
					);
					assert.property(
						res.body[0],
						'_id',
						'Books in array should contain _id'
					);
				}
				done();
			});
	});
	/*
	 * ----[END of EXAMPLE TEST]----
	 */

	suite('Routing tests', () => {
		suite(
			'POST /api/books with title => create book object/expect book object',
			() => {
				test('Test POST /api/books with title', (done) => {
					chai
						.request(server)
						.post('/api/books')
						.send({ title: testTitle })
						.end((err, res) => {
							assert.equal(res.status, 200, 'Should return a positive status');
							const { _id, title } = res.body;
							assert.equal(title, testTitle);
							assert.isDefined(_id);
							testId = _id;
							done();
						});
				});

				test('Test POST /api/books with no title given', (done) => {
					chai
						.request(server)
						.post('/api/books')
						.send({ title: '' })
						.end((err, res) => {
							assert.equal(res.status, 200, 'Should return a positive status');
							assert.equal(
								res.text,
								'missing required field title',
								'Should return appropriate error message'
							);
						});
					done();
				});
			}
		);

		suite('GET /api/books => array of books', () => {
			test('Test GET /api/books', (done) => {
				chai
					.request(server)
					.get('/api/books')
					.end((err, res) => {
						assert.equal(res.status, 200, 'Should return a positive status');
						assert.isArray(res.body, 'Should return an array of books');
						done();
					});
			});
		});

		suite('GET /api/books/[id] => book object with [id]', () => {
			test('Test GET /api/books/[id] with id not in db', (done) => {
				chai
					.request(server)
					.get('/api/books/invalid')
					.end((err, res) => {
						assert.equal(res.status, 200, 'Should return a positive status');
						assert.equal(res.text, 'no book exists');
						done();
					});
			});

			test('Test GET /api/books/[id] with valid id in db', (done) => {
				chai
					.request(server)
					.get(`/api/books/${testId}`)
					.end((err, res) => {
						assert.equal(res.status, 200, 'Should return a positive status');
						assert.equal(
							res.body.title,
							testTitle,
							'Should return the testing title'
						);
						assert.equal(res.body._id, testId, 'Should return the testing ID');
						done();
					});
			});
		});

		suite(
			'POST /api/books/[id] => add comment/expect book object with id',
			() => {
				test('Test POST /api/books/[id] with comment', (done) => {
					chai
						.request(server)
						.post(`/api/books/${testId}`)
						.send({ comment: 'valid' })
						.end((err, res) => {
							assert.equal(res.status, 200);
							const { comments, _id } = res.body;
							assert.equal(
								comments[comments.length - 1],
								'valid',
								'Should return the test comment'
							);
							assert.equal(_id, testId, 'Should return the testing ID');
							done();
						});
				});

				test('Test POST /api/books/[id] without comment field', (done) => {
					chai
						.request(server)
						.post(`/api/books/invalid`)
						.send({ comment: '' })
						.end((err, res) => {
							assert.equal(res.status, 200);
							assert.equal(
								res.text,
								'missing required field comment',
								'Should return the appropriate error message'
							);
							done();
						});
				});

				test('Test POST /api/books/[id] with comment, id not in db', (done) => {
					chai
						.request(server)
						.post(`/api/books/invalid`)
						.send({ comment: 'bad luck mate' })
						.end((err, res) => { 
							assert.equal(res.status, 200);
							assert.equal(res.text, 'missing required field comment');
						});
					done();
				});
			}
		);

		suite('DELETE /api/books/[id] => delete book object id', () => {
			test('Test DELETE /api/books/[id] with valid id in db', (done) => {
				chai
					.request(server)
					.delete(`/api/books/${testId}`)
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.text, 'delete successful');
						done();
					});
			});

			test('Test DELETE /api/books/[id] with  id not in db', (done) => {
				chai
					.request(server)
					.delete('/api/books/invalid')
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.text, 'no book exists');
						done();
					});
			});
		});
	});
});
