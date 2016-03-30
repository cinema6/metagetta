'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;

var IS_LOCAL_KEY = {
    type: true,
    id: true,
    uri: true,
    views: true,
    thumbnails: true,

    title: false,
    description: false,
    duration: false,
    hd: false,
    tags: false,
    publishedTime: false
};
var EXTRACTORS = {
    type: function() {
        return 'jwplayer';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },
    views: function() {
        return null;
    },
    thumbnails: function(options) {
        var id = options.id;
        var prefix = 'https://content.jwplatform.com/thumbs/' + id + '-';
        return {
            small: prefix + '320.jpg',
            large: prefix + '720.jpg'
        };
    },

    title: function(options, video) {
        return video.title;
    },
    description: function(options, video) {
        return video.description;
    },
    duration: function(options, video) {
        var durations = video.sources.filter(function(source) {
            return ('duration' in source);
        }).map(function(source) {
            return source.duration;
        });
        return (durations.length > 0) ? durations[0] : null;
    },
    hd: function(options, video) {
        return video.sources.filter(function(source) {
            return ('height' in source);
        }).some(function(source) {
            return (source.height >= 720);
        });
    },
    tags: function(options, video) {
        var tags = video.tags;
        if(tags) {
            return video.tags.split(/,\s*/);
        } else {
            return [];
        }
    },
    publishedTime: function(options, video) {
        return new Date(video.pubdate);
    }
};
var DEFAULT_FIELDS = Object.keys(IS_LOCAL_KEY);

function createResponse(fields, options, video, conversions) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video, conversions);
        return result;
    }, {});
}

module.exports = function fetchFromJWPlayer(options) {
    var type = options.type;
    var id = options.id;
    var uri = formatURL({
        protocol: 'https',
        host: 'content.jwplatform.com',
        pathname: 'feeds/' + id + '.json',
    });
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type !== 'jwplayer') { return LiePromise.reject(new Error('Not a JWPlayer config.')); }

    if (fields.every(function(field) { return IS_LOCAL_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.resolve(request.get(uri)).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body.playlist[0]);
    });
};
