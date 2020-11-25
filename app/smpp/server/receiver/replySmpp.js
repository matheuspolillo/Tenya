class ReplySmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Reply connected');
	}

	start() {}
}

module.exports = ReplySmpp;