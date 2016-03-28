/* jshint camelcase:false */

var fetchFromDailymotion = require('../../lib/fetchers/dailymotion');
var request = require('superagent');
var LiePromise = require('lie');
var htmlToText = require('../../lib/utils/html_to_text');

describe('fetchFromDailymotion(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;

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

        options = {
            uri: 'http://www.dailymotion.com/video/x30080c_cats-vs-water_lifestyle',
            type: 'dailymotion',
            id: 'x30080c'
        };

        result = fetchFromDailymotion(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request for the video', function() {
        expect(request.get).toHaveBeenCalledWith('https://api.dailymotion.com/video/x30080c?fields=title%2Cdescription%2Cduration%2Cavailable_formats%2Ctags%2Ccreated_time%2Cviews_total%2Cthumbnail_120_url%2Cthumbnail_url&ssl_assets=1');
    });

    describe('when the response is received', function() {
        var response;

        beforeEach(function(done) {
            response = {
                'available_formats': [
                    'l1',
                    'l2',
                    'ld',
                    'sd',
                    'hq',
                    'hd720',
                    'hd1080'
                ],
                'created_time': 1438454421,
                'description': '<a class="link" rel="nofollow" target="_blank" href="http://www.popsugar.com/food/Starbucks-Pumpkin-Spice-Latte-Recipe-38272478"></a><p>Starbucks released its new Pumpkin Spice Latte</a>, now made with real pumpkin. But if you don\'t want to shell out several bucks every day to get your Fall fix, we hacked the recipe to figure out how to make our own version. Pumpkin spice and vanilla syrups combine with steamed milk and coffee to create a PSL that rivals Starbucks\'s. </p><br />',
                'duration': 82,
                'tags': [
                    'afv',
                    'americaacirc128153s',
                    'funniest',
                    'videos',
                    'buzzfeed',
                    'video',
                    'dog',
                    'drink',
                    'fail',
                    'fall'
                ],
                'title': 'Cats Vs. Water',
                'views_total': 123,
                'thumbnail_120_url': 'https://s2-ssl.dmcdn.net/MwnaC/x120-Jo2.jpg',
                'thumbnail_url': 'https://s2-ssl.dmcdn.net/MwnaC.jpg'
            };

            requestDeferreds[request.get.calls.mostRecent().args[0]].resolve({ body: response });
            result.then(done, done);
        });

        it('should be fulfilled with a formatted response', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'dailymotion',
                id: options.id,
                uri: options.uri,
                title: response.title,
                description: htmlToText(response.description),
                duration: response.duration,
                hd: true,
                tags: response.tags,
                publishedTime: new Date(response.created_time * 1000),
                views: 123,
                thumbnails: {
                    small: 'https://s2-ssl.dmcdn.net/MwnaC/x120-Jo2.jpg',
                    large: 'https://s2-ssl.dmcdn.net/MwnaC.jpg'
                }
            });
        });
    });

    ['youtube', 'vimeo', 'vast'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                requestDeferreds = {};
                success.calls.reset();
                failure.calls.reset();
                request.get.calls.reset();
                options.type = type;

                fetchFromDailymotion(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a Dailymotion config.'));
            });
        });
    });

    describe('if only a subset of fields are provided', function() {
        var response;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['id', 'uri', 'title', 'hd', 'tags'];

            response = {
                'available_formats': [
                    'l1',
                    'l2',
                    'ld',
                    'sd',
                    'hq',
                    'hd720',
                    'hd1080'
                ],
                'tags': [
                    'afv',
                    'americaacirc128153s',
                    'funniest',
                    'videos',
                    'buzzfeed',
                    'video',
                    'dog',
                    'drink',
                    'fail',
                    'fall'
                ],
                'title': 'Cats Vs. Water'
            };

            fetchFromDailymotion(options).then(success, failure).then(done, done);
            requestDeferreds[request.get.calls.mostRecent().args[0]].resolve({ body: response });
        });

        it('should only request those fields', function() {
            expect(request.get).toHaveBeenCalledWith('https://api.dailymotion.com/video/x30080c?fields=title%2Cavailable_formats%2Ctags&ssl_assets=1');
        });

        it('should respond with that subset', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id,
                uri: options.uri,
                title: response.title,
                hd: true,
                tags: response.tags
            });
        });
    });

    describe('if all the fields requested are available locally', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri'];

            fetchFromDailymotion(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'dailymotion',
                id: options.id,
                uri: options.uri
            });
        });
    });

    describe('if some bogus fields are provided', function() {
        var response;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['id', 'fhdsofh', 'title', 'cool', 'hey'];

            response = {
                'title': 'Cats Vs. Water'
            };

            fetchFromDailymotion(options).then(success, failure).then(done, done);
            requestDeferreds[request.get.calls.mostRecent().args[0]].resolve({ body: response });
        });

        it('should be ignored', function() {
            expect(request.get).toHaveBeenCalledWith('https://api.dailymotion.com/video/x30080c?fields=title&ssl_assets=1');
            expect(success).toHaveBeenCalledWith({
                id: options.id,
                title: response.title
            });
        });
    });
});
