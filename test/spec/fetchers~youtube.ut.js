var fetchFromYouTube = require('../../lib/fetchers/youtube');
var request = require('superagent');
var LiePromise = require('lie');

describe('fetchFromYouTube(options)', function() {
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
            uri: 'https://www.youtube.com/watch?v=M-n5vol3CEE',
            type: 'youtube',
            id: 'M-n5vol3CEE',
            youtube: { key: 'uwhd493yt48397trg4637rgh7384r' }
        };

        result = fetchFromYouTube(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    afterEach(function(done) {
        process.nextTick(done);
    });

    it('should return a promise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to the youtube API', function() {
        expect(request.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=M-n5vol3CEE&key=uwhd493yt48397trg4637rgh7384r');
    });

    describe('when the response is received', function() {
        var response;

        beforeEach(function(done) {
            response = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/1jiktavGcPIq7yGuq2JjvbxMPvc\'',
                'pageInfo': {
                    'totalResults': 1,
                    'resultsPerPage': 1
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/rjWhMQbfcHRl7GZDU4Is4hX0MQI\'',
                        'id': 'M-n5vol3CEE',
                        'snippet': {
                            'publishedAt': '2015-07-15T04:15:33.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'True Confessions with Tina Fey and Amy Poehler',
                            'description': 'Jimmy, Tina Fey and Amy Poehler play a game where they take turns confessing to a random fact then interrogate each other to determine who was telling the truth.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nTrue Confessions with Tina Fey and Amy Poehler\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'Jimmy Fallon',
                                'Tonight Show Starring Jimmy Fallon',
                                'The Tonight Show',
                                'NBC',
                                'NBC TV',
                                'Television',
                                'Funny',
                                'Talk Show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'Fallon Stand-up',
                                'Fallon monologue',
                                'tonight',
                                'show',
                                'jokes',
                                'funny video',
                                'interview',
                                'variety',
                                'comedy sketches',
                                'talent',
                                'celebrities',
                                'music',
                                'musical performance',
                                'The Roots',
                                'video',
                                'clip',
                                'highlight',
                                'talking',
                                'youtube',
                                'sketch comedy',
                                'music comedy',
                                'sisters',
                                'sisters movie',
                                'tina fey',
                                'amy poehler'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'True Confessions with Tina Fey and Amy Poehler',
                                'description': 'Jimmy, Tina Fey and Amy Poehler play a game where they take turns confessing to a random fact then interrogate each other to determine who was telling the truth.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nTrue Confessions with Tina Fey and Amy Poehler\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT10M43S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };
            requestDeferreds['https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=M-n5vol3CEE&key=uwhd493yt48397trg4637rgh7384r'].resolve({ body: response });

            result.then(done, done);
        });

        it('should fulfill with a normalized response', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'youtube',
                id: options.id,
                uri: options.uri,
                title: response.items[0].snippet.title,
                description: response.items[0].snippet.description,
                duration: 643,
                hd: true,
                tags: response.items[0].snippet.tags,
                publishedTime: new Date(response.items[0].snippet.publishedAt)
            });
        });
    });

    describe('if the request fails', function() {
        var error;

        beforeEach(function(done) {
            error = new Error('The request failed.');

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].reject(error);
            });

            result.then(done, done);
        });

        it('should reject the promise', function() {
            expect(failure).toHaveBeenCalledWith(error);
        });
    });

    ['vimeo', 'dailymotion', 'vast'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                success.calls.reset();
                failure.calls.reset();
                request.get.calls.reset();
                options.type = type;

                fetchFromYouTube(options).then(success, failure);
                LiePromise.resolve().then(done);
            });

            it('should not make a request to the youtube api', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a YouTube config.'));
            });
        });
    });

    describe('if only snippet fields are requested', function() {
        var response;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['title', 'description', 'tags', 'publishedTime'];

            response = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/Rp6MVrzs34GDCcx310VykAhyj68\'',
                'pageInfo': {
                    'totalResults': 1,
                    'resultsPerPage': 1
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/LSyK2Gf3x_vJlsrJYHjzPU1jS9g\'',
                        'id': 'M-n5vol3CEE',
                        'snippet': {
                            'publishedAt': '2015-07-15T04:15:33.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'True Confessions with Tina Fey and Amy Poehler',
                            'description': 'Jimmy, Tina Fey and Amy Poehler play a game where they take turns confessing to a random fact then interrogate each other to determine who was telling the truth.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nTrue Confessions with Tina Fey and Amy Poehler\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/M-n5vol3CEE/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'Jimmy Fallon',
                                'Tonight Show Starring Jimmy Fallon',
                                'The Tonight Show',
                                'NBC',
                                'NBC TV',
                                'Television',
                                'Funny',
                                'Talk Show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'Fallon Stand-up',
                                'Fallon monologue',
                                'tonight',
                                'show',
                                'jokes',
                                'funny video',
                                'interview',
                                'variety',
                                'comedy sketches',
                                'talent',
                                'celebrities',
                                'music',
                                'musical performance',
                                'The Roots',
                                'video',
                                'clip',
                                'highlight',
                                'talking',
                                'youtube',
                                'sketch comedy',
                                'music comedy',
                                'sisters',
                                'sisters movie',
                                'tina fey',
                                'amy poehler'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'True Confessions with Tina Fey and Amy Poehler',
                                'description': 'Jimmy, Tina Fey and Amy Poehler play a game where they take turns confessing to a random fact then interrogate each other to determine who was telling the truth.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nTrue Confessions with Tina Fey and Amy Poehler\nhttp://www.youtube.com/fallontonight'
                            }
                        }
                    }
                ]
            };

            fetchFromYouTube(options).then(success, failure).then(done, done);
            process.nextTick(function() {
                Object.keys(requestDeferreds).forEach(function(uri) {
                    requestDeferreds[uri].resolve({ body: response });
                });
            });
        });

        it('should only request the snippet', function() {
            expect(request.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=M-n5vol3CEE&key=uwhd493yt48397trg4637rgh7384r');
        });

        it('should respond with only the requested fields', function() {
            expect(success).toHaveBeenCalledWith({
                title: response.items[0].snippet.title,
                description: response.items[0].snippet.description,
                tags: response.items[0].snippet.tags,
                publishedTime: new Date(response.items[0].snippet.publishedAt)
            });
        });
    });

    describe('if only contentDetails fields are requested', function() {
        var response;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['duration', 'hd'];

            response = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/WmBAyJbG_asPSbqz6TOc5W37IOM\'',
                'pageInfo': {
                    'totalResults': 1,
                    'resultsPerPage': 1
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/eWxn-FzmGLT_88gc3Sb7tUksWtI\'',
                        'id': 'M-n5vol3CEE',
                        'contentDetails': {
                            'duration': 'PT10M43S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };

            fetchFromYouTube(options).then(success, failure).then(done, done);
            process.nextTick(function() {
                Object.keys(requestDeferreds).forEach(function(uri) {
                    requestDeferreds[uri].resolve({ body: response });
                });
            });
        });

        it('should only request the contentDetails part', function() {
            expect(request.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=M-n5vol3CEE&key=uwhd493yt48397trg4637rgh7384r');
        });

        it('should respond with only the requested fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 643,
                hd: true
            });
        });
    });

    describe('if only the type, uri, or id are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri'];

            fetchFromYouTube(options).then(success, failure).then(done, done);
        });

        it('should not make any request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should respond with the requested fields', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'youtube',
                id: options.id,
                uri: options.uri
            });
        });
    });

    describe('if multiple videos are requested in the same turn of the event loop', function() {
        var response;
        var options1, options2, options3;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();

            response = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/vgc_7M_v8tsLeH8THz8d94cdgn8\'',
                'pageInfo': {
                    'totalResults': 2,
                    'resultsPerPage': 2
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/ZeJOdKi1Qk2F2cL-P2nn-2snK10\'',
                        'id': 'Nv7Ts4v5_Bs',
                        'snippet': {
                            'publishedAt': '2012-05-25T20:09:21.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                            'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'tight pants',
                                'Will',
                                'Ferrell',
                                'Jimmy',
                                'Fallon',
                                'Late Night with Jimmy Fallon',
                                'nbc',
                                'jimmy fallon',
                                'late',
                                'night',
                                'comedy',
                                'funny',
                                'talk',
                                'show',
                                'nbc show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'fallon stand-up',
                                'skits',
                                'sketch',
                                'monologue',
                                'show clip',
                                'highlights',
                                'Fallon monologue',
                                'entertainment',
                                'jokes',
                                'funny video',
                                'stand up',
                                'interview',
                                'variety',
                                'latenight',
                                'comedy sketches',
                                'A list talent',
                                'talk show',
                                'host',
                                'musical performances',
                                'impersonations',
                                'stand up comedy',
                                'music',
                                'Will Ferrell',
                                'tight',
                                'pants'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                                'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT2M31S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    },
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/T5yXqCGafvWilfc54mr_34z5e1I\'',
                        'id': '1NlxTd8RxFA',
                        'snippet': {
                            'publishedAt': '2013-09-18T04:30:26.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                            'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'Jimmy Fallon',
                                'Late Night With Jimmy Fallon',
                                'Late Night',
                                'NBC',
                                'NBC TV',
                                'Television',
                                'Funny',
                                'Talk Show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'Fallon Stand-up',
                                'Fallon monologue',
                                'latenight',
                                'jokes',
                                'funny video',
                                'interview',
                                'variety',
                                'comedy sketches',
                                'talent',
                                'celebrities',
                                'musical performance',
                                'clip',
                                'Justin Timberlake',
                                'Camp Winnipesaukee',
                                'Hootie & The Blowfish (Musical Group)',
                                'Only Wanna Be With You (Composition)'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                                'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT5M51S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };

            options1 = { type: 'youtube', id: 'Nv7Ts4v5_Bs', uri: 'https://www.youtube.com/watch?v=Nv7Ts4v5_Bs', fields: ['title', 'description', 'tags', 'publishedTime'], youtube: { key: options.youtube.key } };
            options2 = { type: 'youtube', id: '1NlxTd8RxFA', uri: 'https://www.youtube.com/watch?v=1NlxTd8RxFA', fields: ['duration', 'hd'], youtube: { key: options.youtube.key } };
            options3 = { type: 'youtube', id: '_Iiryhsedj0', uri: 'https://www.youtube.com/watch?v=_Iiryhsedj0', fields: ['type', 'id', 'uri'], youtube: { key: options.youtube.key } };

            LiePromise.all([
                fetchFromYouTube(options1).then(success, failure),
                fetchFromYouTube(options2).then(success, failure),
                fetchFromYouTube(options3).then(success, failure)
            ]).then(done, done);
            process.nextTick(function() {
                Object.keys(requestDeferreds).forEach(function(uri) {
                    requestDeferreds[uri].resolve({ body: response });
                });
            });
        });

        it('should only make one request', function() {
            expect(request.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=Nv7Ts4v5_Bs%2C1NlxTd8RxFA&key=uwhd493yt48397trg4637rgh7384r');
            expect(request.get.calls.count()).toBe(1);
        });

        it('should resolve each promise seperately', function() {
            expect(success).toHaveBeenCalledWith({
                title: response.items[0].snippet.title,
                description: response.items[0].snippet.description,
                tags: response.items[0].snippet.tags,
                publishedTime: new Date(response.items[0].snippet.publishedAt)
            });
            expect(success).toHaveBeenCalledWith({
                duration: 351,
                hd: true
            });
            expect(success).toHaveBeenCalledWith({
                type: 'youtube',
                id: '_Iiryhsedj0',
                uri: 'https://www.youtube.com/watch?v=_Iiryhsedj0'
            });
            expect(success.calls.count()).toBe(3);
        });
    });

    describe('if multiple calls are made about the same video', function() {
        var response;
        var options1, options2, options3;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();

            response = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/vgc_7M_v8tsLeH8THz8d94cdgn8\'',
                'pageInfo': {
                    'totalResults': 2,
                    'resultsPerPage': 2
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/ZeJOdKi1Qk2F2cL-P2nn-2snK10\'',
                        'id': 'Nv7Ts4v5_Bs',
                        'snippet': {
                            'publishedAt': '2012-05-25T20:09:21.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                            'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'tight pants',
                                'Will',
                                'Ferrell',
                                'Jimmy',
                                'Fallon',
                                'Late Night with Jimmy Fallon',
                                'nbc',
                                'jimmy fallon',
                                'late',
                                'night',
                                'comedy',
                                'funny',
                                'talk',
                                'show',
                                'nbc show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'fallon stand-up',
                                'skits',
                                'sketch',
                                'monologue',
                                'show clip',
                                'highlights',
                                'Fallon monologue',
                                'entertainment',
                                'jokes',
                                'funny video',
                                'stand up',
                                'interview',
                                'variety',
                                'latenight',
                                'comedy sketches',
                                'A list talent',
                                'talk show',
                                'host',
                                'musical performances',
                                'impersonations',
                                'stand up comedy',
                                'music',
                                'Will Ferrell',
                                'tight',
                                'pants'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                                'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT2M31S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    },
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/T5yXqCGafvWilfc54mr_34z5e1I\'',
                        'id': '1NlxTd8RxFA',
                        'snippet': {
                            'publishedAt': '2013-09-18T04:30:26.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                            'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'Jimmy Fallon',
                                'Late Night With Jimmy Fallon',
                                'Late Night',
                                'NBC',
                                'NBC TV',
                                'Television',
                                'Funny',
                                'Talk Show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'Fallon Stand-up',
                                'Fallon monologue',
                                'latenight',
                                'jokes',
                                'funny video',
                                'interview',
                                'variety',
                                'comedy sketches',
                                'talent',
                                'celebrities',
                                'musical performance',
                                'clip',
                                'Justin Timberlake',
                                'Camp Winnipesaukee',
                                'Hootie & The Blowfish (Musical Group)',
                                'Only Wanna Be With You (Composition)'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                                'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT5M51S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };

            options1 = { type: 'youtube', id: 'Nv7Ts4v5_Bs', uri: 'https://www.youtube.com/watch?v=Nv7Ts4v5_Bs', fields: ['title', 'description', 'tags', 'publishedTime'], youtube: { key: options.youtube.key } };
            options2 = { type: 'youtube', id: '1NlxTd8RxFA', uri: 'https://www.youtube.com/watch?v=1NlxTd8RxFA', fields: ['duration', 'hd'], youtube: { key: options.youtube.key } };
            options3 = { type: 'youtube', id: 'Nv7Ts4v5_Bs', uri: 'https://www.youtube.com/watch?v=Nv7Ts4v5_Bs', youtube: { key: options.youtube.key } };

            LiePromise.all([
                fetchFromYouTube(options1).then(success, failure),
                fetchFromYouTube(options2).then(success, failure),
                fetchFromYouTube(options3).then(success, failure)
            ]).then(done, done);
            process.nextTick(function() {
                Object.keys(requestDeferreds).forEach(function(uri) {
                    requestDeferreds[uri].resolve({ body: response });
                });
            });
        });

        it('should only make one request', function() {
            expect(request.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=Nv7Ts4v5_Bs%2C1NlxTd8RxFA&key=uwhd493yt48397trg4637rgh7384r');
            expect(request.get.calls.count()).toBe(1);
        });

        it('should resolve each promise seperately', function() {
            expect(success).toHaveBeenCalledWith({
                title: response.items[0].snippet.title,
                description: response.items[0].snippet.description,
                tags: response.items[0].snippet.tags,
                publishedTime: new Date(response.items[0].snippet.publishedAt)
            });
            expect(success).toHaveBeenCalledWith({
                duration: 351,
                hd: true
            });
            expect(success).toHaveBeenCalledWith({
                type: 'youtube',
                id: 'Nv7Ts4v5_Bs',
                uri: 'https://www.youtube.com/watch?v=Nv7Ts4v5_Bs',
                title: response.items[0].snippet.title,
                description: response.items[0].snippet.description,
                tags: response.items[0].snippet.tags,
                publishedTime: new Date(response.items[0].snippet.publishedAt),
                duration: 151,
                hd: true
            });
            expect(success.calls.count()).toBe(3);
        });
    });

    describe('if different API keys are provided', function() {
        var response1, response2;
        var options1, options2, options3;
        var uri1, uri2;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();

            response1 = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/vgc_7M_v8tsLeH8THz8d94cdgn8\'',
                'pageInfo': {
                    'totalResults': 2,
                    'resultsPerPage': 2
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/ZeJOdKi1Qk2F2cL-P2nn-2snK10\'',
                        'id': 'Nv7Ts4v5_Bs',
                        'snippet': {
                            'publishedAt': '2012-05-25T20:09:21.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                            'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/Nv7Ts4v5_Bs/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'tight pants',
                                'Will',
                                'Ferrell',
                                'Jimmy',
                                'Fallon',
                                'Late Night with Jimmy Fallon',
                                'nbc',
                                'jimmy fallon',
                                'late',
                                'night',
                                'comedy',
                                'funny',
                                'talk',
                                'show',
                                'nbc show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'fallon stand-up',
                                'skits',
                                'sketch',
                                'monologue',
                                'show clip',
                                'highlights',
                                'Fallon monologue',
                                'entertainment',
                                'jokes',
                                'funny video',
                                'stand up',
                                'interview',
                                'variety',
                                'latenight',
                                'comedy sketches',
                                'A list talent',
                                'talk show',
                                'host',
                                'musical performances',
                                'impersonations',
                                'stand up comedy',
                                'music',
                                'Will Ferrell',
                                'tight',
                                'pants'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Will Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)',
                                'description': 'Tension is high when two seemingly friendly men have a quarrel over whose pants are tighter.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nWill Ferrell and Jimmy Fallon Fight Over Tight Pants (Late Night with Jimmy Fallon)\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT2M31S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    },
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/T5yXqCGafvWilfc54mr_34z5e1I\'',
                        'id': '1NlxTd8RxFA',
                        'snippet': {
                            'publishedAt': '2013-09-18T04:30:26.000Z',
                            'channelId': 'UC8-Th83bH_thdKZDJCrn88g',
                            'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                            'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight',
                            'thumbnails': {
                                'default': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/default.jpg',
                                    'width': 120,
                                    'height': 90
                                },
                                'medium': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/mqdefault.jpg',
                                    'width': 320,
                                    'height': 180
                                },
                                'high': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/hqdefault.jpg',
                                    'width': 480,
                                    'height': 360
                                },
                                'standard': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/sddefault.jpg',
                                    'width': 640,
                                    'height': 480
                                },
                                'maxres': {
                                    'url': 'https://i.ytimg.com/vi/1NlxTd8RxFA/maxresdefault.jpg',
                                    'width': 1280,
                                    'height': 720
                                }
                            },
                            'channelTitle': 'The Tonight Show Starring Jimmy Fallon',
                            'tags': [
                                'Jimmy Fallon',
                                'Late Night With Jimmy Fallon',
                                'Late Night',
                                'NBC',
                                'NBC TV',
                                'Television',
                                'Funny',
                                'Talk Show',
                                'comedic',
                                'humor',
                                'stand-up',
                                'snl',
                                'Fallon Stand-up',
                                'Fallon monologue',
                                'latenight',
                                'jokes',
                                'funny video',
                                'interview',
                                'variety',
                                'comedy sketches',
                                'talent',
                                'celebrities',
                                'musical performance',
                                'clip',
                                'Justin Timberlake',
                                'Camp Winnipesaukee',
                                'Hootie & The Blowfish (Musical Group)',
                                'Only Wanna Be With You (Composition)'
                            ],
                            'categoryId': '23',
                            'liveBroadcastContent': 'none',
                            'localized': {
                                'title': 'Young Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee (Late Night with Jimmy Fallon)',
                                'description': 'Jimmy Fallon & Justin Timberlake are kids at summer camp, singing \'Only Wanna Be With You\' by Hootie & The Blowfish.\n\nSubscribe NOW to The Tonight Show Starring Jimmy Fallon: http://bit.ly/1nwT1aN\n\nWatch The Tonight Show Starring Jimmy Fallon Weeknights 11:35/10:35c\n\nGet more Jimmy Fallon: \nFollow Jimmy: http://Twitter.com/JimmyFallon\nLike Jimmy: https://Facebook.com/JimmyFallon\n\nGet more The Tonight Show Starring Jimmy Fallon: \nFollow The Tonight Show: http://Twitter.com/FallonTonight\nLike The Tonight Show: https://Facebook.com/FallonTonight\nThe Tonight Show Tumblr: http://fallontonight.tumblr.com/\n\nGet more NBC: \nNBC YouTube: http://bit.ly/1dM1qBH\nLike NBC: http://Facebook.com/NBC\nFollow NBC: http://Twitter.com/NBC\nNBC Tumblr: http://nbctv.tumblr.com/\nNBC Google+: https://plus.google.com/+NBC/posts\n\nThe Tonight Show Starring Jimmy Fallon features hilarious highlights from the show including: comedy sketches, music parodies, celebrity interviews, ridiculous games, and, of course, Jimmy\'s Thank You Notes and hashtags! You\'ll also find behind the scenes videos and other great web exclusives.\n\nYoung Jimmy Fallon & Justin Timberlake Sing At Camp Winnipesaukee\nhttp://www.youtube.com/fallontonight'
                            }
                        },
                        'contentDetails': {
                            'duration': 'PT5M51S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };

            response2 = {
                'kind': 'youtube#videoListResponse',
                'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/pe9mYhG3yIFRt3-suvBEkuG04z8\'',
                'pageInfo': {
                    'totalResults': 1,
                    'resultsPerPage': 1
                },
                'items': [
                    {
                        'kind': 'youtube#video',
                        'etag': '\'sGDdEsjSJ_SnACpEvVQ6MtTzkrI/58lp5ydLJiWWA8W8ykkksCmA674\'',
                        'id': '1NlxTd8RxFA',
                        'contentDetails': {
                            'duration': 'PT5M51S',
                            'dimension': '2d',
                            'definition': 'hd',
                            'caption': 'false',
                            'licensedContent': true
                        }
                    }
                ]
            };

            options1 = { type: 'youtube', id: 'Nv7Ts4v5_Bs', uri: 'https://www.youtube.com/watch?v=Nv7Ts4v5_Bs', fields: ['title', 'description', 'tags', 'publishedTime'], youtube: { key: '12345' } };
            options2 = { type: 'youtube', id: '1NlxTd8RxFA', uri: 'https://www.youtube.com/watch?v=1NlxTd8RxFA', fields: ['duration', 'hd'], youtube: { key: 'abcde' } };
            options3 = { type: 'youtube', id: '1NlxTd8RxFA', uri: 'https://www.youtube.com/watch?v=1NlxTd8RxFA', youtube: { key: '12345' } };

            uri1 = 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=Nv7Ts4v5_Bs%2C1NlxTd8RxFA&key=12345';
            uri2 = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=1NlxTd8RxFA&key=abcde';

            process.nextTick(function() {
                request.get.calls.reset();
                LiePromise.all([
                    fetchFromYouTube(options1).then(success, failure),
                    fetchFromYouTube(options2).then(success, failure),
                    fetchFromYouTube(options3).then(success, failure)
                ]).then(done, done);

                process.nextTick(function() {
                    if (requestDeferreds[uri1]) {
                        requestDeferreds[uri1].resolve({ body: response1 });
                    }

                    if (requestDeferreds[uri2]) {
                        requestDeferreds[uri2].resolve({ body: response2 });
                    }
                });
            });
        });

        it('should make seperate requests for each API key', function() {
            expect(request.get).toHaveBeenCalledWith(uri1);
            expect(request.get).toHaveBeenCalledWith(uri2);
            expect(request.get.calls.count()).toBe(2);
        });

        it('should provide proper responses', function() {
            expect(success).toHaveBeenCalledWith({
                title: response1.items[0].snippet.title,
                description: response1.items[0].snippet.description,
                tags: response1.items[0].snippet.tags,
                publishedTime: new Date(response1.items[0].snippet.publishedAt)
            });
            expect(success).toHaveBeenCalledWith({
                duration: 351,
                hd: true
            });
            expect(success).toHaveBeenCalledWith({
                type: 'youtube',
                id: '1NlxTd8RxFA',
                uri: 'https://www.youtube.com/watch?v=1NlxTd8RxFA',
                title: response1.items[1].snippet.title,
                description: response1.items[1].snippet.description,
                tags: response1.items[1].snippet.tags,
                publishedTime: new Date(response1.items[1].snippet.publishedAt),
                duration: 351,
                hd: true
            });

            expect(success.calls.count()).toBe(3);
        });
    });

    describe('if unsupported fields are specified', function() {
        beforeEach(function(done) {
            success.calls.reset();
            failure.calls.reset();
            options.fields = ['id', 'foo', 'type'];

            fetchFromYouTube(options).then(success, failure).then(done, done);
        });

        it('should ignore the unknown fields', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id,
                type: options.type
            });
        });
    });
});
