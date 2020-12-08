class Router {
	constructor() {
		this.api = null;
		this.appVersion = require(`${__base}/package.json`).version;
		this.controllers = {
			replyController: Loader.export('replyController'),
			messageController: Loader.export('messageController')
		};
	}

	start(server) {
		this.api = server
		
		this.api.get('/ping', (req, res) => { res.send(200, 'pong'); });
		this.api.get('/version', (req, res) => { res.send(200, this.appVersion) });
		this.api.post('/send', this.controllers.messageController.createMessage);
		this.api.post('/reply', this.controllers.replyController.createGatewayReply);
	}
}

module.exports = Router;