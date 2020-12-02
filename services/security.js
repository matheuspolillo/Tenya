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

	validateSmppConnection(pdu) {
		let securityPermission = false;
		if (pdu.hasOwnProperty('system_id') && pdu['system_id'] != null) {
			let username = pdu['system_id'];
			if (pdu.hasOwnProperty('password') && pdu['password'] != null) {
				let password = pdu['password'];
				if (username == this.smppConfig['replyUsername'] && password == this.smppConfig['replyPassword']) securityPermission = 'reply';
				if (username == this.smppConfig['reportUsername'] && password == this.smppConfig['reportPassword']) securityPermission = 'report';
				if (username == this.smppConfig['transmitterUsername'] && password == this.smppConfig['transmitterPassword']) securityPermission = 'transmitter';
			}
		}

		return securityPermission;
	}
}

module.exports = Security;