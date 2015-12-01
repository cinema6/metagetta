'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseJWPlayerURI(options) {
    var url = parseURL(options.uri || '');
    var id = options.id;
    var type = options.type;
    var isJWPlayer = (type === 'jwplayer' || url.host === 'content.jwplatform.com');

    if ((!type || !id) && !url.host) { throw new Error('Missing configuration.'); }
    if (!isJWPlayer) { throw new Error('Not a JWPlayer config.'); }

    if (id) {
        return set({ uri: 'https://content.jwplatform.com/previews/' + id }, options);
    }

    var hash = url.pathname.replace(/^\/previews\//, '').match(/^[a-zA-Z\d-]+/)[0];
    return set({ type: 'jwplayer', id: hash.split('-')[0] }, options);
};
