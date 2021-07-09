const Provider = require('../index');
const got = require('got');
const config = require('../../../config.json');

class DiscordProvider extends Provider {
	send(type, data) {
		let content;
		switch (type) {
			case 'site-stats':
				content = this.getSiteStats(data)
				break;
			case 'stubs':
				content = this.getStubs(data, true)
		}

		try {
			return got.post(config.providers.discord.webhook, {
				headers: {
					'Content-Type': 'application/json'
				},
				responseType: 'json',
				body: JSON.stringify({
					content
				})
			});
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = DiscordProvider;
