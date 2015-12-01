var request = require('superagent');
var LiePromise = require('lie');
var proxyquire = require('proxyquire');
var fetchFromJWPlayer;

describe('fetchFromJWPlayer(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;
    var videoResponse, conversionsResponse;

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

        var mockVideoResponse = '{"status": "ok", "video": {"status": "ready", "sourceurl": null, "description": "Check out this FANT' +
            'ASTIC video description.", "title": "tears_of_steel_720p.mov", "views": 217, "tags": "marco, polo", ' +
            '"sourceformat": null, "mediatype": "video", "custom": {}, "duration": "734.16", "upload_session_id":' +
            ' null, "link": "", "author": null, "key": "iGznZrKK", "error": null, "date": 1444004242, "md5": "882' +
            '1bfe2b76c5c303ae0990a22f8802d", "sourcetype": "file", "size": "694582843"}}';
        var mockConversionsResponse = '{"conversions": [{"status": "Ready", "template": {"required": true, "format": {"name": "Original", "' +
            'key": "original"}, "id": 23160394, "key": "9aYQf7S8", "name": "Original"}, "mediatype": "video", "he' +
            'ight": 534, "width": 1280, "link": {"path": "/originals/iGznZrKK.mov", "protocol": "http", "address"' +
            ': "content.jwplatform.com"}, "filesize": "372178639", "key": "LBhIav89", "duration": "734.16"}, {"st' +
            'atus": "Ready", "template": {"required": true, "format": {"name": "H.264 Baseline", "key": "mp4"}, "' +
            'id": 23160395, "key": "VRCrJ2UT", "name": "H.264 320px"}, "mediatype": "video", "height": 134, "widt' +
            'h": 320, "link": {"path": "/videos/iGznZrKK-VRCrJ2UT.mp4", "protocol": "http", "address": "content.j' +
            'wplatform.com"}, "filesize": "35656619", "key": "rI6GSEIx", "duration": "734.16"}, {"status": "Ready' +
            '", "template": {"required": false, "format": {"name": "H.264 Baseline", "key": "mp4"}, "id": 2316039' +
            '6, "key": "5zfAA76q", "name": "H.264 480px"}, "mediatype": "video", "height": 200, "width": 480, "li' +
            'nk": {"path": "/videos/iGznZrKK-5zfAA76q.mp4", "protocol": "http", "address": "content.jwplatform.co' +
            'm"}, "filesize": "52350626", "key": "VeExWAeN", "duration": "734.16"}, {"status": "Ready", "template' +
            '": {"required": false, "format": {"name": "H.264 Baseline", "key": "mp4"}, "id": 23160397, "key": "I' +
            '4VbAGB7", "name": "H.264 720px"}, "mediatype": "video", "height": 300, "width": 720, "link": {"path"' +
            ': "/videos/iGznZrKK-I4VbAGB7.mp4", "protocol": "http", "address": "content.jwplatform.com"}, "filesi' +
            'ze": "69906156", "key": "orGONy0I", "duration": "734.16"}, {"status": "Ready", "template": {"require' +
            'd": false, "format": {"name": "H.264 Baseline", "key": "mp4"}, "id": 23160398, "key": "j9Ry6qY7", "n' +
            'ame": "H.264 1280px"}, "mediatype": "video", "height": 534, "width": 1280, "link": {"path": "/videos' +
            '/iGznZrKK-j9Ry6qY7.mp4", "protocol": "http", "address": "content.jwplatform.com"}, "filesize": "1540' +
            '86336", "key": "3RtQ4Wqd", "duration": "734.16"}, {"status": "Ready", "template": {"required": true,' +
            ' "format": {"name": "AAC", "key": "aac"}, "id": 23160400, "key": "5H7OqgbG", "name": "AAC Audio"}, "' +
            'mediatype": "audio", "height": -1, "width": -1, "link": {"path": "/videos/iGznZrKK-5H7OqgbG.m4a", "p' +
            'rotocol": "http", "address": "content.jwplatform.com"}, "filesize": "10404467", "key": "26Qn5Wbq", "' +
            'duration": "734.11"}], "status": "ok", "total": 6, "limit": 50, "offset": 0}';

        videoResponse = JSON.parse(mockVideoResponse);
        conversionsResponse = JSON.parse(mockConversionsResponse);

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(1448924740123));

        options = {
            uri: 'https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn',
            type: 'jwplayer',
            id: 'iGznZrKK',
            jwplayer: {
                key: 'alicia',
                secret: 'ssshhh'
            }
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

    it('should make a request to V1 of JWPlayer\'s API', function() {
        var videoRequest = request.get.calls.all()[0].args[0];
        expect(videoRequest).toBe('https://api.jwplatform.com/v1/videos/show?api_format=json&api_key=alicia&api_timestamp=1448924740&api_nonce=12345678&video_key=iGznZrKK&api_signature=01bba34fdb86e7e4f938d0d4dd821383b742f9b0');
    });
    
    it('should make a request to JWPlayer\'s conversions enpoint', function() {
        var videoRequest = request.get.calls.all()[1].args[0];
        expect(videoRequest).toBe('https://api.jwplatform.com/v1/videos/conversions/list?api_format=json&api_key=alicia&api_timestamp=1448924740&api_nonce=12345678&video_key=iGznZrKK&api_signature=01bba34fdb86e7e4f938d0d4dd821383b742f9b0');
    });

    describe('when the responses are received', function() {
        beforeEach(function(done) {
            Object.keys(requestDeferreds).forEach(function(uri) {
                if(uri.indexOf('conversions') !== -1) {
                    requestDeferreds[uri].resolve({ body: conversionsResponse });
                } else {
                    requestDeferreds[uri].resolve({ body: videoResponse });
                }
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
                duration: 734.16,
                hd: false,
                tags: ['marco', 'polo'],
                publishedTime: new Date(1444004242)
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
                if(uri.indexOf('conversions') !== -1) {
                    requestDeferreds[uri].resolve({ body: conversionsResponse });
                } else {
                    requestDeferreds[uri].resolve({ body: videoResponse });
                }
            });
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 734.16,
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
            options.fields = ['type', 'id', 'uri'];

            fetchFromJWPlayer(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'jwplayer',
                id: 'iGznZrKK',
                uri: 'https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn'
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
