'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db')

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/').get(function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
	res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on port ' + port);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function () {
			try {
				runner.run();
			} catch (e) {
				let error = e;
				console.log('Tests are not valid:');
				console.log(error);
			}
		}, 1500);
	}
});

module.exports = app; //for unit/functional testing