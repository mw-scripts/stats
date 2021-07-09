const Provider = require('../index');
const Twitter = require('twitter-lite');
const config = require('../../../config.json');

const twit = new Twitter({
	...config.providers.twitter.auth
});

class TwitterProvider extends Provider {
	async send(type, data) {
		let content;

		switch (type) {
			case 'site-stats':
				content = this.getSiteStats(data);
				break;
			case 'stubs':
				content = this.getStubs(data);
		}

		return await twit.post('/statuses/update', {
			status: content
		});
	}
}

module.exports = TwitterProvider;
