const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const log = require('./common/log');
const routes = require('./routes');

const fourOhFour = require('./middleware/four-o-four');
const errorHandler = require('./middleware/error-handler');

module.exports.init = () => {

	log.debug(process.env);

	// Boing
	const server = express();

	//-=======================================================---
	//------------------ Setup
	//-=======================================================---

	log.info('Starting server setup');

	if (process.env.NODE_ENV !== 'production'){

		// prettify output json by default on non-production env
		server.set('json spaces', 4);

	} else {
		// compress everything
		server.use(compression());
	}

	// POST'ed json is at req.body
	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: true }));

	log.info('Opening access to api');

	server.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	routes(server);

	//-=======================================================---
	//------------------ Fallback Routes
	//-=======================================================---

	log.info('Setting fallback routes');

	// 500
	server.use(errorHandler);

	// 404
	server.use(fourOhFour);

	return server;

};