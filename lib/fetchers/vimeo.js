/* jshint camelcase:false */
'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;
var htmlToText = require('../utils/html_to_text');

var IS_LOCAL_KEY = {
    type: true,
    id: true,
    uri: true,

    title: false,
    description: false,
    duration: false,
    hd: false,
    tags: false,
    publishedTime: false,
    views: false,
    thumbnails: false
};
var EXTRACTORS = {
    type: function() {
        return 'vimeo';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },

    title: function(options, video) {
        return video.title;
    },
    description: function(options, video) {
        return htmlToText(video.description);
    },
    duration: function(options, video) {
        return video.duration;
    },
    hd: function(options, video) {
        return video.height >= 720;
    },
    tags: function(options, video) {
        return video.tags.split(/,\s*/);
    },
    publishedTime: function(options, video) {
        var parts = video.upload_date.match(/^(\d+)-(\d+)-(\d+)/).slice(1)
            .map(parseFloat);
        var year = parts[0], month = parts[1], day = parts[2];

        return new Date(year, month - 1, day);
    },
    views: function(options, video) {
        return video.stats_number_of_plays;
    },
    thumbnails: function(options, video) {
        return {
            small: video.thumbnail_small,
            large: video.thumbnail_large
        };
    }
};
var DEFAULT_FIELDS = Object.keys(IS_LOCAL_KEY);

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video);
        return result;
    }, {});
}

module.exports = function fetchFromVimeo(options) {
    var type = options.type;
    var id = options.id;
    var uri = formatURL({
        protocol: 'https',
        host: 'vimeo.com',
        pathname: 'api/v2/video/' + id + '.json'
    });
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type !== 'vimeo') { return LiePromise.reject(new Error('Not a Vimeo config.')); }

    if (fields.every(function(field) { return IS_LOCAL_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.resolve(request.get(uri)).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body[0]);
    });
};
