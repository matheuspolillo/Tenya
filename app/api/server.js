class Server {
	constructor() {
		this.api = require('restify').createServer();
		this.host = process.env.API_HOST;
		this.port = process.env.API_PORT;
		this.router = Loader.export('router');
	}

	uses() {
		this.api.use(require('restify').plugins.bodyParser());
		this.api.use((req, res, next) => {
			Logger.log('ServerLog', `${req.method} - ${req.url}`);
			next();
		});
	}

	listen() {
		this.uses();
		this.router.start(this.api);
		this.api.listen(this.port, () => { Logger.log('ServerLog', `Listening at ${this.host} on port ${this.port}`) });
	}
}

module.exports = Server;