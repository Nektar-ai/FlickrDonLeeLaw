# flickr-sdk.d.ts

export * from './flickr-sdk';

exports = module.exports = require('./services/rest');

declare module 'flickr-sdk' {

	exports.OAuth = require('./services/oauth');
	exports.Feeds = require('./services/feeds');
	exports.Upload = require('./services/upload');
	exports.Replace = require('./services/replace');

}