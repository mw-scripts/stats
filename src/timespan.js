const timeUnits = {
	years: {
		label: '(?:years?|y)',
		value: 1000 * 60 * 60 * 24 * 365
	},
	months: {
		label: '(?:months?|mo)',
		value: 1000 * 60 * 60 * 24 * 30
	},
	weeks: {
		label: '(?:weeks?|w)',
		value: 1000 * 60 * 60 * 24 * 7
	},
	days: {
		label: '(?:days?|d)',
		value: 1000 * 60 * 60 * 24
	},
	hours: {
		label: '(?:hours?|hrs?|h)',
		value: 1000 * 60 * 60
	},
	minutes: {
		label: '(?:minutes?|mins?|m)',
		value: 1000 * 60
	},
	seconds: {
		label: '(?:seconds?|secs?|s)',
		value: 1000
	},
	milliseconds: {
		label: '(?:milliseconds?|msecs?|ms)',
		value: 1
	}
}

function getTimespan(phrase) {
	const regexString = Object.entries(timeUnits).map(([name, { label }]) => String.raw`(?:(?<${name}>-?(?:\d+)?\.?\d+) *${label})?`).join('\\s*');
	const match = new RegExp(`^${regexString}$`, 'i').exec(phrase);
	if (!match) return null;

	let milliseconds = 0;
	for (const key in match.groups) {
		const value = Number(match.groups[key] || 0);
		milliseconds += value * timeUnits[key].value;
	}

	return milliseconds;
}

module.exports = getTimespan;
