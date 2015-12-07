var fetchFromVzaar;
var LiePromise = require('lie');
var proxyquire = require('proxyquire');

describe('fetchFromVzaar(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;
    var response;
    var jsonp;

    beforeEach(function(done) {
        requestDeferreds = {};
        jsonp = jasmine.createSpy('jsonp()').and.callFake(function(uri) {
            var deferred = {};
            var req = {
                then: function(resolve, reject) {
                    deferred.resolve = resolve;
                    deferred.reject = reject;
                }
            };
            deferred.request = req;

            requestDeferreds[uri] = deferred;

            return LiePromise.resolve(req);
        });

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        fetchFromVzaar = proxyquire('../../lib/fetchers/vzaar.js', {
            '../utils/jsonp': jsonp,
            'lie': LiePromise,
            
            '@noCallThru': true
        });
        
        var mockResponse = '{"type":"video","version":"1.0","width":448,"height":252,"html":"","video_status_id":2,"video_status_description"' +
            ':"Transcoded","play_count":51,"total_size":6886911,"title":"test video please do not watch.mp4","des' +
            'cription":"","author_name":"VzaarZaar","author_url":"http://app.vzaar.com/users/VzaarZaar","author_a' +
            'ccount":40,"provider_name":"vzaar","provider_url":"http://vzaar.com","video_url":"https://view.vzaar' +
            '.com/5700429/video","thumbnail_url":"https://view.vzaar.com/5700429/thumb","thumbnail_width":"120","' +
            'thumbnail_height":"90","framegrab_url":"https://view.vzaar.com/5700429/image","framegrab_width":448,' +
            '"framegrab_height":252,"duration":36.78,"renditions":[{"type":"sd","status_id":3,"status":"finished"' +
            '},{"type":"hls","status_id":3,"status":"finished"}]}';
        response = JSON.parse(mockResponse);

        options = {
            uri: 'http://vzaar/tv/5700429',
            type: 'vzaar',
            id: '5700429'
        };

        result = fetchFromVzaar(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to V2 of Vimeo\'s API', function() {
        expect(jsonp).toHaveBeenCalledWith('http://vzaar.com/api/videos/5700429.json');
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
                type: 'vzaar',
                id: '5700429',
                uri: 'http://vzaar/tv/5700429',
                title: 'test video please do not watch.mp4',
                description: '',
                duration: 36.78,
                hd: false,
                tags: null,
                publishedTime: null,
                views: 51
            });
        });
    });

    ['youtube', 'dailymotion', 'vast', 'instagram', 'jwplayer', 'vimeo', 'wistia'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                requestDeferreds = {};
                success.calls.reset();
                failure.calls.reset();
                jsonp.calls.reset();
                options.type = type;

                fetchFromVzaar(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(jsonp).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a Vzaar config.'));
            });
        });
    });

    describe('if a subset of fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            jsonp.calls.reset();
            options.fields = ['duration', 'tags'];

            fetchFromVzaar(options).then(success, failure).then(done, done);

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 36.78,
                tags: null
            });
        });
    });

    describe('if only local data fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            jsonp.calls.reset();
            options.fields = ['type', 'id', 'uri'];

            fetchFromVzaar(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(jsonp).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vzaar',
                id: '5700429',
                uri: 'http://vzaar/tv/5700429'
            });
        });
    });

    describe('if some invalid fields are provided', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            jsonp.calls.reset();
            options.fields = ['foo', 'id', 'bar'];

            fetchFromVzaar(options).then(success, failure).then(done, done);
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                id: '5700429'
            });
        });
    });
});
