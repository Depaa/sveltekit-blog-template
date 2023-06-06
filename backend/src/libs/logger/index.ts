const logger = {
	debug: (message: any, parse = true) => {
		process.env.ENV !== 'prod' ? console.debug(parse ? JSON.stringify(message) : message) : null;
	},
	info: (message: any, parse = true) => {
		console.info(parse ? JSON.stringify(message) : message);
	},
	error: (message: any) => {
		console.error(message);
	},
};

export default logger;
