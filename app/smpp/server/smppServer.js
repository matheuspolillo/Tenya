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
			session.on('bind_receiver', (pdu) => {
				let smppType = this.security.validateSmppConnection(pdu);
				if (smppType) this.createSession(smppType, session);
			});
			session.on('bind_transmitter', (pdu) => {
				let smppType = this.security.validateSmppConnection(pdu);
				if (smppType) this.createSession(smppType, session);
			});
		});

		this.server.listen(this.port, this.host, () => {
			Logger.log('SmppServerLog', `Listening at ${this.host} on port ${this.port}`);
		});
	}

	createSession(type, session) {
		switch (type) {
			case 'reply':
				this.replySmpp.setSession(session);
				this.replySmpp.start();
				break;
			case 'report':
				this.reportSmpp.setSession(session);
				this.reportSmpp.start();
				break;
			case 'transmitter':
				this.transmitterSmpp.setSession(session);
				this.transmitterSmpp.start();
				break;
		}
	}
}

module.exports = SmppServer;