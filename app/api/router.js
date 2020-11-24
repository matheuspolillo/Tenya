class Router {
	constructor() {
		this.api = null;
		this.appVersion = require(`${__base}/package.json`).version;
	}

	start(server) {
		this.api = server
		
		this.api.get('/ping', (req, res) => { res.send(200, 'pong'); });
		this.api.get('/version', (req, res) => { res.send(200, this.appVersion) });
	}
}

module.exports = Router;