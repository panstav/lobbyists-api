require('dotenv').config();

const fs = require('fs');
const log = require('./common/log');

checkForStores()
	.then(startServer)
	.catch(log.error);

function startServer(){

	log.info('Starting server');

	const adr = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || 'localhost';
	const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
	
	require('./server')
		.init()
		.listen(port, adr, () => log.info(`Server is up! Listening on ${adr}:${port}.`));

}

function checkForStores(){

	log.info('Checking for stores');

	return new Promise(resolve => {
		fs.exists('./store/data.json', is => {
			if (!is){
				const setup = require('./setup');

				return resolve(setup());
			}

			resolve();
		})
	});

}