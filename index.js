const log = require('./common/log');

const port = process.env.PORT || 3000;
require('./server')
	.init()
	.listen(port, () => log.info(`Server is up! Listening on ${port}.`));