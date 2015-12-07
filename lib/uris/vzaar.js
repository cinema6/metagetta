'use strict';

var parseURL = require('url').parse;
var set = require('../utils/set');

module.exports = function parseVimeoURI(options) {
    var url = parseURL(options.uri || '');
    var id = options.id;
    var type = options.type;
    var isVimeo = (type === 'vzaar' || url.host === 'app.vzaar.com' || url.host === 'vzaar.tv');

    if ((!type || !id) && !url.host) { throw new Error('Missing configuration.'); }
    if (!isVimeo) { throw new Error('Not a Vzaar config.'); }

    if (id) {
        return set({ uri: 'http://vzaar.tv/' + id }, options);
    }

    var matchedId = null;
    switch(url.host) {
    case 'app.vzaar.com':
        matchedId = url.pathname.replace(/^\/videos\//, '').match(/^\d+/)[0];
        break;
    case 'vzaar.tv':
        matchedId = url.pathname.replace(/^\//, '').match(/^\d+/)[0];
        break;
    }
    return set({ type: 'vzaar', id: matchedId }, options);
};
