var request = require('superagent');
var LiePromise = require('lie');
var proxyquire = require('proxyquire');
var fetchFromJWPlayer;

describe('fetchFromJWPlayer(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;
    var response;

    beforeEach(function(done) {
        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        requestDeferreds = {};
        spyOn(request, 'get').and.callFake(function(uri) {
            var deferred = {};
            var req = {
                then: function(resolve, reject) {
                    deferred.resolve = resolve;
                    deferred.reject = reject;
                }
            };
            deferred.request = req;

            requestDeferreds[uri] = deferred;

            return req;
        });

        fetchFromJWPlayer = proxyquire('../../lib/fetchers/jwplayer.js', {
            '../utils/random_int': function() { return 12345678; },
            'superagent': request,
            'lie': LiePromise,
            
            '@noCallThru': true
        });

        var mockResponse = '{"playlist": [{"sources": [{"type": "application/vnd.apple.mpegurl", "file": "//content.jwplatform.c' +
            'om/manifests/iGznZrKK.m3u8"}, {"height": 134, "width": 320, "file": "//content.jwplatform.com/videos' +
            '/iGznZrKK-VRCrJ2UT.mp4", "duration": 734, "label": "H.264 320px", "type": "video/mp4"}, {"height": 2' +
            '00, "width": 480, "file": "//content.jwplatform.com/videos/iGznZrKK-5zfAA76q.mp4", "duration": 734, ' +
            '"label": "H.264 480px", "type": "video/mp4"}, {"height": 300, "width": 720, "file": "//content.jwpla' +
            'tform.com/videos/iGznZrKK-I4VbAGB7.mp4", "duration": 734, "label": "H.264 720px", "type": "video/mp4' +
            '"}, {"height": 534, "width": 1280, "file": "//content.jwplatform.com/videos/iGznZrKK-j9Ry6qY7.mp4", ' +
            '"duration": 734, "label": "H.264 1280px", "type": "video/mp4"}, {"height": -1, "width": -1, "file": ' +
            '"//content.jwplatform.com/videos/iGznZrKK-5H7OqgbG.m4a", "duration": 734, "label": "AAC Audio", "typ' +
            'e": "audio/mp4"}], "tracks": [{"kind": "thumbnails", "file": "//assets-jpcust.jwpsrv.com/strips/iGzn' +
            'ZrKK-120.vtt"}], "mediaid": "iGznZrKK", "description": "Check out this FANTASTIC video description."' +
            ', "pubdate": 1444004242, "title": "tears_of_steel_720p.mov", "link": "//content.jwplatform.com/previ' +
            'ews/iGznZrKK", "image": "//content.jwplatform.com/thumbs/iGznZrKK-720.jpg", "tags": "marco, polo", "' +
            'custom": {}}]}';

        response = JSON.parse(mockResponse);

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(1448924740123));

        options = {
            uri: 'https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn',
            type: 'jwplayer',
            id: 'iGznZrKK'
        };

        result = fetchFromJWPlayer(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to JWPlayer\'s feeds endpoint', function() {
        var videoRequest = request.get.calls.all()[0].args[0];
        expect(videoRequest).toBe('https://content.jwplatform.com/feeds/iGznZrKK.json');
    });
    
    describe('when the response is received', function() {
        beforeEach(function(done) {
            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });

            result.then(done, done);
        });

        it('should respond with a formatted response object', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'jwplayer',
                id: 'iGznZrKK',
                uri: 'https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn',
                title: 'tears_of_steel_720p.mov',
                description: 'Check out this FANTASTIC video description.',
                duration: 734,
                hd: false,
                tags: ['marco', 'polo'],
                publishedTime: new Date(1444004242),
                views: null,
                thumbnails: {
                    small: 'https://content.jwplatform.com/thumbs/iGznZrKK-320.jpg',
                    large: 'https://content.jwplatform.com/thumbs/iGznZrKK-720.jpg'
                }
            });
        });
    });

    ['youtube', 'dailymotion', 'vast', 'instagram', 'vimeo'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                requestDeferreds = {};
                success.calls.reset();
                failure.calls.reset();
                request.get.calls.reset();
                options.type = type;

                fetchFromJWPlayer(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a JWPlayer config.'));
            });
        });
    });

    describe('if a subset of fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['duration', 'tags'];

            fetchFromJWPlayer(options).then(success, failure).then(done, done);

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 734,
                tags: ['marco', 'polo']
            });
        });
    });

    describe('if only local data fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri', 'thumbnails'];

            fetchFromJWPlayer(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'jwplayer',
                id: 'iGznZrKK',
                uri: 'https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn',
                thumbnails: {
                    small: 'https://content.jwplatform.com/thumbs/iGznZrKK-320.jpg',
                    large: 'https://content.jwplatform.com/thumbs/iGznZrKK-720.jpg'
                }
            });
        });
    });

    describe('if some invalid fields are provided', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['foo', 'id', 'bar'];

            fetchFromJWPlayer(options).then(success, failure).then(done, done);
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                id: 'iGznZrKK'
            });
        });
    });
});
