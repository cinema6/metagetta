'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseYouTubeURI(options) {
    var url = parseURL(options.uri || '', true);
    var type = options.type;
    var id = options.id;

    if ((!type || !id) && !url.host) {
        throw new Error('Missing configuration.');
    }

    if (type === 'youtube' && id) {
        return set({ uri: 'https://www.youtube.com/watch?v=' + id }, options);
    }

    if (url.host === 'www.youtube.com') {
        return set({ type: 'youtube', id: url.query.v }, options);
    }

    throw new Error('Not a YouTube URI');
};
