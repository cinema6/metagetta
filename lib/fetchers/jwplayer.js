'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var sha1 = require('sha1');
var formatURL = require('url').format;
var randomInt = require('../utils/random_int');
var extend = require('../utils/extend');

var QUERIES_KEY = {
    type: null,
    id: null,
    uri: null,

    title: 'videos',
    description: 'videos',
    duration: 'videos',
    hd: 'conversions',
    tags: 'videos',
    publishedTime: 'videos'
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

    title: function(options, video) {
        return video.video.title;
    },
    description: function(options, video) {
        return video.video.description;
    },
    duration: function(options, video) {
        return parseFloat(video.video.duration);
    },
    hd: function(options, video) {
        var originalVideo;
        var videos = video.conversions;
        for(var i=0;i<videos.length;i++) {
            if(videos[i].template.format.key === 'original') {
                originalVideo = videos[i];
                break;
            }
        }
        if(originalVideo) {
            return (originalVideo.height >= 720);
        } else {
            return false;
        }
    },
    tags: function(options, video) {
        var tags = video.video.tags;
        if(tags) {
            return video.video.tags.split(/,\s*/);
        } else {
            return [];
        }
    },
    publishedTime: function(options, video) {
        return new Date(video.video.date);
    }
};
var DEFAULT_FIELDS = Object.keys(QUERIES_KEY);

function createResponse(fields, options, video, conversions) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video, conversions);
        return result;
    }, {});
}

function getQueryParams(key, secret, id) {
    var params = {
        /* jshint camelcase:false */
        api_format: 'json',
        api_key: key,
        api_timestamp: Math.floor(Date.now() / 1000),
        api_nonce: randomInt(10000000, 100000000), // random 8-digit number
        video_key: id
        /* jshint camelcase:true */
    };
    var keys = Object.keys(params).sort();
    var SBS = keys.reduce(function(sbs, key) {
        return sbs + '&' + key + '=' + encodeURIComponent(params[key]);
    }, '').slice(1);
    var signature = sha1(SBS + secret);
    /* jshint camelcase:false */
    return extend(params, { api_signature: signature });
    /* jshint camelcase:true */
}

module.exports = function fetchFromJWPlayer(options) {
    var key = options.jwplayer.key;
    var secret = options.jwplayer.secret;
    var type = options.type;
    var id = options.id;
    var videoUri = formatURL({
        protocol: 'https',
        host: 'api.jwplatform.com',
        pathname: 'v1/videos/show',
        query: getQueryParams(key, secret, id)
    });
    var conversionsUri = formatURL({
        protocol: 'https',
        host: 'api.jwplatform.com',
        pathname: 'v1/videos/conversions/list',
        query: getQueryParams(key, secret, id)
    });
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type !== 'jwplayer') { return LiePromise.reject(new Error('Not a JWPlayer config.')); }

    var requiredQueries = fields.map(function(field) {
        return QUERIES_KEY[field];
    });
    
    var promises = [];
    if(requiredQueries.indexOf('videos') !== -1) {
        promises.push(LiePromise.resolve(request.get(videoUri)));
    }
    if(requiredQueries.indexOf('conversions') !== -1) {
        promises.push(LiePromise.resolve(request.get(conversionsUri)));
    }
    if(promises.length === 0) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.all(promises).then(function extractMetadata(responses) {
        var video = extend.apply(this, responses.map(function(response) {
            return response.body;
        }));
        return createResponse(fields, options, video);
    });
};
