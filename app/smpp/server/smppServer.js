class SmppServer {
	constructor() {
		this.smpp = require('smpp');
		this.host = process.env.SMPP_SERVER_HOST;
		this.port = process.env.SMPP_SERVER_PORT;
		this.server = {};
		this.replySmpp = Loader.export('replySmpp');
		this.reportSmpp = Loader.export('reportSmpp');
		this.transmitterSmpp = Loader.export('transmitterSmpp');
		this.security = Loader.export('security');
	}

	openConnection() {
		this.server = this.smpp.createServer((session) => {
			let smppType = this.security.validateSmppConnection(session);
			if (smppType) this.createSession(smppType);
		});

		this.server.listen(this.port, this.host, () => {
			Logger.log('SmppServerLog', `Listening at ${this.host} on port ${this.port}`);
		});
	}

	createSession(type) {
		switch (type) {
			case 'reply':
				this.replySmpp.setSession(this.session);
				this.replySmpp.start();
			case 'report':
				this.reportSmpp.setSession(this.session);
				this.reportSmpp.start();
			case 'transmitter':
				this.transmitterSmpp.setSession(this.session);
				this.transmitterSmpp.start();
		}
	}
}

module.exports = SmppServer;