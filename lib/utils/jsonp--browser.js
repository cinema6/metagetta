'use strict';

var LiePromise = require('lie');
var jsonpLib = require('jsonp');

module.exports = function(url) {
    return new LiePromise(function(resolve, reject) {
        jsonpLib(url, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve({body: data});
            }
        });
    });
};
