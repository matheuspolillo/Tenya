class Validator {
	constructor() {
		this.validateBody = {
			ok: null,
			status: null,
			response: null
		};
	}

	buildValidateBody(ok, status, response) {
		let validate = this.validateBody;
		validate['ok'] = ok;
		validate['status'] = status;
		validate['response'] = response;

		return validate;
	}

	validateReqBody(reqBody, endpoint) {
		let validate = this.buildValidateBody(false, 400, null);
		switch (endpoint) {
			case '/reply/create':
				let queueIdOk = false;
				let numberOk = false;
				let messageContentOk = false;
				if (reqBody.hasOwnProperty('queueId') && reqBody['queueId'] != null) queueIdOk = true;
				else validate['response'] = 'queueId missing';

				if (reqBody.hasOwnProperty('number') && reqBody['number'] != null) numberOk = true;
				else validate['response'] = 'number missing';

				if (reqBody.hasOwnProperty('messageContent') && reqBody['messageContent'] != null) messageContentOk = true;
				else validate['response'] = 'messageContent missing';

				if (queueIdOk && numberOk && messageContentOk) {
					validate['ok'] = true;
					validate['status'] = 200;
					validate['response'] = '';
				}
				break;
		}
		return validate;
	}

	validateMongoReturn(result, type) {
		let validate = this.buildValidateBody(false, 500, null);
		switch (type) {
			case 'insert':
				if (result.n >= 1 && result.ok >= 1 && result.n == result.ok) {
					validate['ok'] = true;
					validate['status'] = 201;
					validate['response'] = 'ok';
				}
				break;
			case 'update':
				if (result.n >= 1 && result.ok >= 1 && result.n == result.ok) {
					if (result.nModified >= 1 && result.nModified == result.n && result.nModified == result.ok) {
						validate['ok'] = true;
						validate['status'] = 201;
						validate['response'] = 'ok';
					}
				}
		}

		return validate
	}
}

module.exports = Validator;