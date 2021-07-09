#!/usr/bin/env node

const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const { MediaWikiJS } = require('@lavgup/mediawiki.js');
const config = require('../config.json');
const getTimeSpan = require('./timespan');

const fs = require('fs');
const path = require('path');

const providersList = fs.readdirSync('./providers')
	.filter(file => fs.statSync(path.join('./providers', file)).isDirectory());
const providerClasses = {};

const scheduler = new ToadScheduler();

const send = (prov, { type, data, options }) => {
	return prov.send(type, data, options)
		.then(() => console.log('New trigger.'));
}

const bot = new MediaWikiJS({
	url: config.api_url
});

// Loop through all providers in config
for (let [key, value] of Object.entries(config.providers)) {
	key = key.toLowerCase();
	if (!providersList.find(p => p === key)) continue;
	if (!value.enabled) continue;

	const Provider = require(`./providers/${key}`);
	providerClasses[key] = new Provider();

	const schedules = Object.keys(value.schedule)
		.map(val => val.replaceAll('_', '-'));

	schedules.forEach(async type => {
		// Check if schedule type is enabled
		if (!value.schedule[type.replaceAll('-', '_')]) return;

		// Check if schedule type is supported
		if (!['site-stats', 'stubs'].includes(type)) return;

		let funcName, params;
		if (type === 'site-stats') {
			funcName = 'getSiteInfo';
			params = ['statistics'];
		} else if (type === 'stubs') {
			funcName = 'getPagesInCategory';
			params = [config.stubs_category, true];
		}

		let data = await bot[funcName](...params);
		if (type === 'site-stats') data = data.statistics;

		const task = new AsyncTask(
			`${key + ' ' + type}`,
			() => send(providerClasses[key], {
				type,
				data
			}),
			err => console.error(err)
		);

		const job = new SimpleIntervalJob({
			milliseconds: getTimeSpan(value.schedule[type.replaceAll('-', '_')])
		}, task);

		scheduler.addSimpleIntervalJob(job);
	});
}
