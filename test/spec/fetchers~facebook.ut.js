/* jshint camelcase:false */

var fetchFromFacebook = require('../../lib/fetchers/facebook');
var request = require('superagent');
var LiePromise = require('lie');

describe('fetchFromFacebook(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;
    var videoResponse;
    var oAuthResponse;

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
            uri: 'https://www.facebook.com/facebook/videos/10153231379946729/',
            type: 'facebook',
            id: '10153231379946729',
            facebook: {
                key: 'key',
                secret: 'secret'
            }
        };

        oAuthResponse = {
            body: {
                access_token: 'token'
            }
        };
        videoResponse = {
            text: '{"title":"How to Share With Just Friends","description":"How to share with just friends.","length":7' +
                '4.311,"format":[{"embed_html":"\\u003Ciframe src=\\"https:\\/\\/www.facebook.com\\/video\\/embed?vid' +
                'eo_id=10153231379946729\\" width=\\"130\\" height=\\"73\\" frameborder=\\"0\\">\\u003C\\/iframe>","f' +
                'ilter":"130x130","height":73,"picture":"https:\\/\\/scontent.xx.fbcdn.net\\/hvthumb-xat1\\/v\\/t15.0' +
                '-10\\/s130x130\\/10840976_10153231382181729_10153231379946729_54346_313_b.jpg?oh=69be66b245ebd4de665' +
                'c5e0671678345&oe=5791895E","width":130},{"embed_html":"\\u003Ciframe src=\\"https:\\/\\/www.facebook' +
                '.com\\/video\\/embed?video_id=10153231379946729\\" width=\\"480\\" height=\\"270\\" frameborder=\\"0' +
                '\\">\\u003C\\/iframe>","filter":"480x480","height":270,"picture":"https:\\/\\/scontent.xx.fbcdn.net\\' +
                '/hvthumb-xat1\\/v\\/t15.0-10\\/s480x480\\/10840976_10153231382181729_10153231379946729_54346_313_b.j' +
                'pg?oh=af2399f172eb486eaf911c6bfd58add4&oe=57737A1F","width":480},{"embed_html":"\\u003Ciframe src=\\' +
                '"https:\\/\\/www.facebook.com\\/video\\/embed?video_id=10153231379946729\\" width=\\"720\\" height=\\' +
                '"405\\" frameborder=\\"0\\">\\u003C\\/iframe>","filter":"720x720","height":405,"picture":"https:\\/\\' +
                '/scontent.xx.fbcdn.net\\/hvthumb-xat1\\/v\\/t15.0-10\\/s720x720\\/10840976_10153231382181729_10153231' +
                '379946729_54346_313_b.jpg?oh=aa6feb1b33c8a983ffecabc950d3ce4f&oe=5782A5AB","width":720},{"embed_html"' +
                ':"\\u003Ciframe src=\\"https:\\/\\/www.facebook.com\\/video\\/embed?video_id=10153231379946729\\" wid' +
                'th=\\"1280\\" height=\\"720\\" frameborder=\\"0\\">\\u003C\\/iframe>","filter":"native","height":720,' +
                '"picture":"https:\\/\\/scontent.xx.fbcdn.net\\/hvthumb-xat1\\/v\\/t15.0-10\\/10840976_101532313821817' +
                '29_10153231379946729_54346_313_b.jpg?oh=b1b305a6ded3eb7a0dd07d33430d37f8&oe=57864E4D","width":1280}],' +
                '"content_category":"OTHER","created_time":"2014-12-05T08:00:01+0000","id":"10153231379946729"}'
        };

        result = fetchFromFacebook(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    function resolveDeferredRequests() {
        Object.keys(requestDeferreds).forEach(function(uri) {
            if(uri.indexOf('oauth') !== -1) {
                requestDeferreds[uri].resolve(oAuthResponse);
            }
        });
        return new LiePromise(function(resolve) {
            process.nextTick(function() {
                Object.keys(requestDeferreds).forEach(function(uri) {
                    if(uri.indexOf('oauth') === -1) {
                        requestDeferreds[uri].resolve(videoResponse);
                    }
                });
                resolve();
            });
        });
    }
    
    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to V2.5 of Facebook\'s API', function(done) {
        resolveDeferredRequests().then(function() {
            expect(request.get).toHaveBeenCalledWith('https://graph.facebook.com/v2.5/oauth/access_token?client_id=key&client_secret=secret&grant_type=client_credentials');
            expect(request.get).toHaveBeenCalledWith('https://graph.facebook.com/v2.5/10153231379946729?access_token=token&fields=title%2Cdescription%2Clength%2Cformat%2Ccontent_category%2Ccreated_time');
        }).then(done, done.fail);
    });

    describe('when the response is received', function() {
        beforeEach(function(done) {
            resolveDeferredRequests();
            result.then(done, done);
        });

        it('should respond with a formatted response object', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'facebook',
                id: options.id,
                uri: options.uri,
                title: 'How to Share With Just Friends',
                description: 'How to share with just friends.',
                duration: 74.311,
                hd: true,
                tags: ['OTHER'],
                publishedTime: new Date('2014-12-05T08:00:01'),
                views: null,
                thumbnails: {
                    small: 'https://scontent.xx.fbcdn.net/hvthumb-xat1/v/t15.0-10/s130x130/10840976_10153231382181729_10153231379946729_54346_313_b.jpg?oh=69be66b245ebd4de665c5e0671678345&oe=5791895E',
                    large: 'https://scontent.xx.fbcdn.net/hvthumb-xat1/v/t15.0-10/10840976_10153231382181729_10153231379946729_54346_313_b.jpg?oh=b1b305a6ded3eb7a0dd07d33430d37f8&oe=57864E4D'
                }
            });
        });
    });

    ['youtube', 'dailymotion', 'vast'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                requestDeferreds = {};
                success.calls.reset();
                failure.calls.reset();
                request.get.calls.reset();
                options.type = type;

                fetchFromFacebook(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a Facebook config.'));
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

            result = fetchFromFacebook(options).then(success, failure);
            resolveDeferredRequests();
            result.then(done, done);
        });

        it('should request only the specified fields', function() {
            expect(request.get).toHaveBeenCalledWith('https://graph.facebook.com/v2.5/10153231379946729?access_token=token&fields=length%2Ccontent_category');
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 74.311,
                tags: ['OTHER']
            });
        });
    });

    describe('if only local data fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri', 'views'];

            fetchFromFacebook(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'facebook',
                id: options.id,
                uri: options.uri,
                views: null
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

            fetchFromFacebook(options).then(success, failure).then(done, done);
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id
            });
        });
    });
});
