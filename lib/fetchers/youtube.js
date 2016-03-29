'use strict';

var formatURL = require('url').format;
var LiePromise = require('lie');
var request = require('superagent');
var iso8601DurationToSeconds = require('../utils/iso_8601_duration_to_seconds');
var find = require('../utils/find');

var PART_KEY = {
    type: null,
    id: null,
    uri: null,
    title: 'snippet',
    description: 'snippet',
    duration: 'contentDetails',
    hd: 'contentDetails',
    tags: 'snippet',
    publishedTime: 'snippet',
    views: 'statistics',
    thumbnails: 'snippet'
};

var EXTRACTORS = {
    type: function() {
        return 'youtube';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },

    title: function(options, video) {
        return video.snippet.title;
    },
    description: function(options, video) {
        return video.snippet.description;
    },
    tags: function(options, video) {
        return video.snippet.tags;
    },
    publishedTime: function(options, video) {
        return new Date(video.snippet.publishedAt);
    },
    thumbnails: function(options, video) {
        var thumbnails = video.snippet.thumbnails;
        var thumbs = Object.keys(thumbnails).map(function(key) {
            return thumbnails[key];
        }).sort(function(thumbnail1, thumbnail2) {
            return thumbnail1.height - thumbnail2.height;
        });
        return {
            small: thumbs[0].url,
            large: thumbs[thumbs.length - 1].url
        };
    },

    duration: function(options, video) {
        return iso8601DurationToSeconds(video.contentDetails.duration);
    },
    hd: function(options, video) {
        return video.contentDetails.definition === 'hd';
    },
    
    views: function(options, video) {
        return parseInt(video.statistics.viewCount);
    }
};

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        if (EXTRACTORS[field]) {
            result[field] = EXTRACTORS[field](options, video);
        }

        return result;
    }, {});
}

var getVideo = (function() {
    var pending = [];
    var flushScheduled = false;

    function flush() {
        var keys = pending.reduce(function(result, call) {
            return result.indexOf(call.key) < 0 ? result.concat([call.key]) : result;
        }, []);

        keys.forEach(function(key) {
            var calls = pending.filter(function(call) { return call.key === key; });
            var parts = calls.reduce(function(result, call) {
                return result.concat(call.parts.filter(function(part) {
                    return result.indexOf(part) < 0;
                }));
            }, []);
            var ids = calls.reduce(function(result, call) {
                return result.indexOf(call.id) > -1 ? result : result.concat([call.id]);
            }, []);
            var uri = formatURL({
                protocol: 'https',
                host: 'www.googleapis.com',
                pathname: 'youtube/v3/videos',
                query: {
                    part: parts.toString(),
                    id: ids.toString(),
                    key: key
                }
            });
            var rejectors = calls.map(function(call) { return call.reject; });

            LiePromise.resolve(request.get(uri)).then(function resolve(response) {
                calls.forEach(function(call) {
                    call.resolve(find(response.body.items, function(video) {
                        return video.id === call.id;
                    }));
                });
            }, function reject(reason) {
                rejectors.forEach(function(reject) { return reject(reason); });
            });
        });

        flushScheduled = false;
        pending.length = 0;
    }

    return function getVideo(id, parts, key) {
        return new LiePromise(function(resolve, reject) {
            pending.push({
                id: id,
                parts: parts,
                key: key,
                resolve: resolve,
                reject: reject
            });

            if (!flushScheduled) {
                process.nextTick(flush);
                flushScheduled = true;
            }
        });
    };
}());

module.exports = function fetchFromYouTube(options) {
    var key = options.youtube.key;
    var fields = options.fields || Object.keys(PART_KEY);
    var parts = fields.map(function(field) { return PART_KEY[field]; })
        .filter(function(part, index, parts) { return part && parts.indexOf(part) === index; });

    if (options.type !== 'youtube') {
        return LiePromise.reject(new Error('Not a YouTube config.'));
    }

    if (parts.length < 1) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return getVideo(options.id, parts, key).then(function extractMetadata(video) {
        return createResponse(fields, options, video);
    });
};
