'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseInstagramURI(options) {
    var url = parseURL(options.uri || '', true);
    var type = options.type;
    var id = options.id;

    if ((!type || !id) && !url.host) {
        throw new Error('Missing configuration.');
    }

    if (type === 'instagram' && id) {
        return set({ uri: 'https://instagram.com/p/' + id }, options);
    }

    if (url.host === 'instagram.com' || url.host === 'www.instagram.com') {
        return set({
            type: 'instagram',
            id: url.pathname.replace(/^\/p\//, '').match(/^[\dA-z_-]+/)[0]
        }, options);
    }

    throw new Error('Not an Instagram URI');
};
