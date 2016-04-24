const logger = {
	error: console.error,
	warn: console.log,
	info: console.log,
	debug: process.env.DEBUG ? console.log : () => {}
};

module.exports = logger;