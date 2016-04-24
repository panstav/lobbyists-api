const log = require('../common/log');

module.exports = (err, req, res, next) => {

	if (process.env.DEBUG){
		log.error({ err: err, req: req });
	}

	if (err.redirect) return res.status(500).redirect(err.redirect);

	if (err.status && err.statusText){
		if (process.env.NODE_ENV === 'test') return res.status(err.status).json(err);

		return res.status(err.status).end(err.statusText);
	}

	res.status(500).end();

};