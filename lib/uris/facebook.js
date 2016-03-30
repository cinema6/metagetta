'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseFacebookURI(options) {
    var url = parseURL(options.uri || '', true);

    if (!url.host || !url.pathname) {
        throw new Error('Must specify a URI for Facebook videos');
    }

    if (url.host.indexOf('facebook.com') !== -1) {
        return set({
            type: 'facebook',
            id: url.pathname.replace(/^\/.+\/videos\//, '').match(/^\d+/)[0]
        }, options);
    }

    throw new Error('Not a Facebook URI');
};
