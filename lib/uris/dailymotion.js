'use strict';

var set = require('../utils/set');
var parseURL = require('url').parse;

module.exports = function parseDailymotionURI(options) {
    var url = parseURL(options.uri || '');
    var type = options.type;
    var id = options.id;
    var isDailymotion = (type === 'dailymotion' || url.host === 'www.dailymotion.com');

    if ((!type || !id) && !url.host) { throw new Error('Missing configuration.'); }
    if (!isDailymotion) { throw new Error('Not a Dailymotion config.'); }

    if (id) {
        return set({ uri: 'http://www.dailymotion.com/video/' + id }, options);
    }

    return set({
        type: 'dailymotion',
        id: url.pathname.replace(/^\/video\//, '').match(/[^_]+/)[0]
    }, options);
};
