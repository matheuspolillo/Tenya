const chalk = require('chalk');
const moment = require('moment-timezone');

class Logger {
	constructor(args) {
		this.types = require(args.configPath).types;
		this.timezoneFormat = 'YYYY-MM-DD HH:mm:ss';
	}

	log(type, message) {
		let coloredTimestamp;
		let coloredType;
		if (type == 'ErrorLog') {
			coloredTimestamp = chalk.hex('#FF0000')(moment.tz(process.env.MOMENT_TIMEZONE).format(this.timezoneFormat));
			coloredType = chalk.hex('#FF0000')(type);
		} else {
			if (!this.types.hasOwnProperty(type)) return this.log('ErrorLog', `"${type}" log type does not exist`);
			coloredTimestamp = chalk.hex(this.types[type])(moment.tz(process.env.MOMENT_TIMEZONE).format(this.timezoneFormat));
			coloredType = chalk.hex(this.types[type])(type);
		}

		console.log(`[${coloredTimestamp}] (${coloredType}) ${message}`);
	}
}

module.exports = Logger;