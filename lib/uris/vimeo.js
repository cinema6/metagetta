'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseVimeoURI(options) {
    var url = parseURL(options.uri || '');
    var id = options.id;
    var type = options.type;
    var isVimeo = (type === 'vimeo' || url.host === 'vimeo.com');

    if ((!type || !id) && !url.host) { throw new Error('Missing configuration.'); }
    if (!isVimeo) { throw new Error('Not a Vimeo config.'); }

    if (id) {
        return set({ uri: 'https://vimeo.com/' + id }, options);
    }

    return set({ type: 'vimeo', id: url.pathname.match(/\d+$/)[0] }, options);
};
