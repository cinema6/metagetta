/* jshint camelcase:false */
'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;

var FIELD_KEY = {
    type: null,
    id: null,
    uri: null,

    title: 'title',
    description: 'description',
    duration: 'duration',
    hd: 'available_formats',
    tags: 'tags',
    publishedTime: 'created_time'
};
var DEFAULT_FIELDS = Object.keys(FIELD_KEY);
var EXTRACTORS = {
    type: function() {
        return 'dailymotion';
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
        return video.description;
    },
    duration: function(options, video) {
        return video.duration;
    },
    hd: function(options, video) {
        return video.available_formats.indexOf('hd720') > -1;
    },
    tags: function(options, video) {
        return video.tags;
    },
    publishedTime: function(options, video) {
        return new Date(video.created_time * 1000);
    }
};

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video);
        return result;
    }, {});
}

module.exports = function fetchFromDailymotion(options) {
    var type = options.type;
    var id = options.id;
    var fields = (options.fields || DEFAULT_FIELDS)
        .filter(function(field) { return DEFAULT_FIELDS.indexOf(field) > -1; });
    var requestFields = fields.map(function(field) { return FIELD_KEY[field]; })
        .filter(function(field) { return !!field; });

    if (type !== 'dailymotion') {
        return LiePromise.reject(new Error('Not a Dailymotion config.'));
    }

    if (requestFields.length < 1) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.resolve(request.get(formatURL({
        protocol: 'https',
        hostname: 'api.dailymotion.com',
        pathname: 'video/' + id,
        query: { fields: requestFields.toString() }
    }))).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body);
    });
};
