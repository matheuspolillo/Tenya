class ReportSmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Report connected');
	}

	start() {}
}

module.exports = ReportSmpp;