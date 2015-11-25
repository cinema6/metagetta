'use strict';

var request = require('superagent');
var LiePromise = require('lie');

module.exports = function(url) {
    return LiePromise.resolve(request.get(url));
};
