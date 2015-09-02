'use strict';

var LiePromise = require('lie');
var copy = require('./utils/copy');
var extend = require('./utils/extend');

var parseYouTubeURI = require('./uris/youtube');
var parseVimeoURI = require('./uris/vimeo');
var parseDailymotionURI = require('./uris/dailymotion');

var fetchFromYouTube = require('./fetchers/youtube');
var fetchFromVimeo = require('./fetchers/vimeo');
var fetchFromDailymotion = require('./fetchers/dailymotion');

function withConfig(config) {
    function pipe(/*uri, options*/) {
        var uri = typeof arguments[0] === 'object' ?
            arguments[0].uri : arguments[0];
        var options = extend(
            config,
            typeof arguments[0] === 'object' ? arguments[0] : arguments[1],
            { uri: uri }
        );

        return metagetta.pipeline.reduce(function(promise, fn) {
            return promise.catch(function callNext(options) {
                var optionsCopy = copy(options);

                return LiePromise.resolve(fn(optionsCopy)).then(function checkConfig(response) {
                    if (response !== optionsCopy) {
                        return response;
                    }

                    return LiePromise.reject(response);
                }, function passConfig() {
                    return LiePromise.reject(optionsCopy);
                });
            });
        }, LiePromise.reject(options)).catch(function fail() {
            throw new Error('Could not find metadata for the specified resource.');
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
        fetchFromDailymotion
    ];
    metagetta.withConfig = withConfig;

    return metagetta;
}

module.exports = withConfig({});
