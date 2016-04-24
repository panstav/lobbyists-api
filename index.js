require('dotenv').config();

const fs = require('fs');
const log = require('./common/log');

checkForStores()
	.then(startServer)
	.catch(log.error);

function startServer(){

	log.info('Starting server');

	const port = process.env.PORT || 3000;
	require('./server')
		.init()
		.listen(port, () => log.info(`Server is up! Listening on ${port}.`));

}

function checkForStores(){

	log.info('Checking for stores');

	const stores = ['./store/all-names.json', './store/data.json'];

	return Promise.all(stores.map(existsPromises));

	function existsPromises(store){
		return new Promise(resolve => {
			fs.exists(store, is => {
				if (!is){
					const setup = require('./setup');

					return resolve(setup());
				}

				resolve();
			})
		});
	}
}