const config = require('../../config.json');

class Provider {
	// noinspection JSUnusedLocalSymbols
	send(type, data) {
		throw new Error('Provider#send(type, data) not implemented');
	}

	getSiteStats(data) {
		// Format numbers
		Object.entries(data).forEach(([k, v]) => data[k] = Number(v).toLocaleString());

		return `There are ${data.articles} articles on ${config.site_name}!
		
${data.edits} edits have been made since wiki creation and ${data.activeusers} users are actively editing the wiki!`
	}

	getStubs(data, hyperlink = false) {
		let random = [...data].sort(() => .5 - Math.random()).slice(0, 3);
		if (!random.length) return;

		const term = random.length === 1 ? 'is one' : 'are a few';
		const plural = random.length === 1 ? '' : 's';

		const formatted = (hyperlink = false) => {
			const url = config.base_url;

			if (hyperlink) return random.map(el => `[${el}](<${encodeURI(`${url}/${el}`)}>)`);

			// Encoding plain URL does not produce clean output for users to read
			return `${url}/${random[0]}`.replaceAll(' ', '_');
		}

		const headline = 'Help the wiki out by editing an article in need of expansion!';

		if (!hyperlink) {
			return `${headline}
			
Here is an article to get you started:
${formatted()}`;
		} else {
			return `${headline}
		
Here ${term} article${plural} to get you started:
${formatted(true).join('\n')}`;
		}
	}
}

module.exports = Provider;
