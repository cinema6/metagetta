'use strict';

var LiePromise = require('lie');
var copy = require('./utils/copy');
var extend = require('./utils/extend');
var set = require('./utils/set');

var parseYouTubeURI = require('./uris/youtube');
var parseVimeoURI = require('./uris/vimeo');
var parseDailymotionURI = require('./uris/dailymotion');

var fetchFromYouTube = require('./fetchers/youtube');
var fetchFromVimeo = require('./fetchers/vimeo');
var fetchFromDailymotion = require('./fetchers/dailymotion');
var fetchAsVAST = require('./fetchers/vast');

function call(fn/*, ...args*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return new LiePromise(function(resolve) {
        return resolve(fn.apply(null, args));
    });
}

function instantiate(config) {
    function pipe(/*uri, options*/) {
        var uri = typeof arguments[0] === 'object' ?
            arguments[0].uri : arguments[0];
        var options = extend(
            config,
            typeof arguments[0] === 'object' ? arguments[0] : arguments[1],
            { uri: uri }
        );
        var reasons = [];

        return metagetta.pipeline.reduce(function(promise, fn) {
            return promise.catch(function callNext(options) {
                var optionsCopy = copy(options);

                return call(fn, optionsCopy).then(function checkConfig(response) {
                    if (response !== optionsCopy) {
                        return response;
                    }

                    return LiePromise.reject(response);
                }, function passConfig(reason) {
                    reasons.push(reason);

                    return LiePromise.reject(optionsCopy);
                });
            });
        }, LiePromise.reject(options)).catch(function fail() {
            throw set(
                { reasons: reasons, options: options },
                new Error('Could not find metadata for the specified resource.')
            );
        });
    }

    function metagetta(uri, config) {
        function pipeWithConfig(uri) {
            return pipe(uri, config);
        }

        if (uri instanceof Array) {
            return LiePromise.all(uri.map(pipeWithConfig));
        }

        return pipeWithConfig(uri);
    }
    metagetta.version = require('../package.json').version;
    metagetta.pipeline = [
        parseYouTubeURI,
        parseVimeoURI,
        parseDailymotionURI,

        fetchFromYouTube,
        fetchFromVimeo,
        fetchFromDailymotion,
        fetchAsVAST
    ];
    metagetta.withConfig = function withConfig(options) {
        return instantiate(extend(config, options));
    };

    return metagetta;
}

module.exports = instantiate({});
