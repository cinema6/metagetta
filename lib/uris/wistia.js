'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseWistiaURI(options) {
    var url = parseURL(options.uri || '', true);

    if (!url.host || !url.pathname) {
        throw new Error('Missing configuration.');
    }

    if (url.host.indexOf('wistia.com') !== -1) {
        return set({
            type: 'wistia',
            id: url.pathname.replace(/^\/medias\//, '').match(/^[a-zA-Z\d]+/)[0]
        }, options);
    }

    throw new Error('Not a Wistia URI');
};
