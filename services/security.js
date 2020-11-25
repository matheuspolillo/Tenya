class Security {
	constructor() {
		this.smppConfig = {
			replyUsername: process.env.SMPP_SERVER_REPLY_SYSTEM_ID,
			replyPassword: process.env.SMPP_SERVER_REPLY_PASSWORD,
			reportUsername: process.env.SMPP_SERVER_REPORT_SYSTEM_ID,
			reportPassword: process.env.SMPP_SERVER_REPORT_PASSWORD,
			transmitterUsername: process.env.SMPP_SERVER_TRANSMITTER_SYSTEM_ID,
			transmitterPassword: process.env.SMPP_SERVER_TRANSMITTER_PASSWORD
		};
	}

	validateSmppConnection(session) {
		let usernameOk = false;
		let passwordOk = false;
		let securityPermission = false;
		if (session.hasOwnProperty('system_id') && session['session_id'] != null) {
			if (session.hasOwnProperty('password') && session['password'] != null) {
				if (username == this.smppConfig['replyUsername'] && password == this.smppConfig['replyPassword']) securityPermission = 'reply';
				if (username == this.smppConfig['reportUsername'] && password == this.smppConfig['reportPassword']) securityPermission = 'report';
				if (username == this.smppConfig['transmitterUsername'] && password == this.smppConfig['transmitterPassword']) securityPermission = 'transmitter';
			}
		}

		return securityPermission;
	}
}

module.exports = Security;