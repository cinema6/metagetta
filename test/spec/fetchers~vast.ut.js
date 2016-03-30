var fetchAsVAST = require('../../lib/fetchers/vast');
var LiePromise = require('lie');
var VAST = require('vastacular').VAST;

describe('fetchAsVAST(options)', function() {
    var options;
    var success, failure;
    var resolve, reject;
    var result;

    beforeEach(function() {
        options = {
            uri: 'http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2'
        };

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        spyOn(VAST, 'fetch').and.returnValue(new LiePromise(function(_resolve_, _reject_) {
            resolve = _resolve_;
            reject = _reject_;
        }));

        result = fetchAsVAST(options);
        result.then(success, failure);
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should fetch the VAST', function() {
        expect(VAST.fetch).toHaveBeenCalledWith(options.uri, { resolveWrappers: true, maxRedirects: 5 });
    });

    describe('when the VAST is fetched', function() {
        describe('if there is a linear creative', function() {
            describe('with all the requested fields', function() {
                beforeEach(function(done) {
                    resolve(new VAST({
                        version: '2.0',
                        ads: [
                            {
                                id: '12345',
                                type: 'inline',
                                system: { name: 'Some System' },
                                title: 'My Ad',
                                impressions: [{ uri: 'some-pixel' }],
                                creatives: [
                                    {
                                        type: 'companions',
                                        companions: [
                                            {
                                                width: 300,
                                                height: 250,
                                                resources: [{ type: 'iframe', data: 'iframe.html' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'nonLinear',
                                        ads: [
                                            {
                                                width: 300,
                                                height: 250,
                                                resources: [{ type: 'iframe', data: 'iframe.html' }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: '12345',
                                type: 'inline',
                                system: { name: 'Some System' },
                                title: 'My Ad',
                                description: 'This is a great ad!',
                                impressions: [{ uri: 'some-pixel' }],
                                creatives: [
                                    {
                                        id: 'my-creative',
                                        type: 'companions',
                                        companions: [
                                            {
                                                width: 300,
                                                height: 250,
                                                resources: [{ type: 'iframe', data: 'iframe.html' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'linear',
                                        duration: 44,
                                        mediaFiles: [
                                            { delivery: 'progressive', type: 'application/flash', uri: 'swf.swf', width: 800, height: 600 },
                                            { delivery: 'progressive', type: 'video/webm', uri: 'ad.webm', width: 600, height: 480 },
                                            { delivery: 'progressive', type: 'video/mp4', uri: 'ad.mp4', width: 1080, height: 720 },
                                            { delivery: 'progressive', type: 'video/mp4', uri: 'ad2.mp4', width: 480, height: 320 }
                                        ]
                                    },
                                    {
                                        type: 'nonLinear',
                                        ads: [
                                            {
                                                width: 300,
                                                height: 250,
                                                resources: [{ type: 'iframe', data: 'iframe.html' }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }));
                    result.then(done, done);
                });

                it('should respond with a formatted object', function() {
                    expect(success).toHaveBeenCalledWith({
                        type: 'vast',
                        id: '12345',
                        uri: options.uri,
                        title: 'My Ad',
                        description: 'This is a great ad!',
                        duration: 44,
                        hd: true,
                        tags: null,
                        publishedTime: null,
                        views: null,
                        thumbnails: {
                            small: null,
                            large: null
                        }
                    });
                });
            });

            describe('with only the required fields', function() {
                beforeEach(function(done) {
                    resolve(new VAST({
                        version: '2.0',
                        ads: [
                            {
                                id: '12345',
                                type: 'inline',
                                system: { name: 'Some System' },
                                title: 'My Ad',
                                impressions: [{ uri: 'some-pixel' }],
                                creatives: [
                                    {
                                        type: 'linear',
                                        duration: 15,
                                        mediaFiles: [
                                            { delivery: 'progressive', type: 'application/flash', uri: 'swf.swf', width: 800, height: 600 },
                                            { delivery: 'progressive', type: 'video/webm', uri: 'ad.webm', width: 600, height: 480 },
                                            { delivery: 'progressive', type: 'video/mp4', uri: 'ad2.mp4', width: 480, height: 320 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }));
                    result.then(done, done);
                });

                it('should set the unknown fields to null', function() {
                    expect(success).toHaveBeenCalledWith({
                        type: 'vast',
                        id: '12345',
                        uri: options.uri,
                        title: 'My Ad',
                        description: null,
                        duration: 15,
                        hd: false,
                        tags: null,
                        publishedTime: null,
                        views: null,
                        thumbnails: {
                            small: null,
                            large: null
                        }
                    });
                });
            });
        });

        describe('if there is no linear creative', function() {
            beforeEach(function(done) {
                resolve(new VAST({
                    version: '2.0',
                    ads: [
                        {
                            id: '12345',
                            type: 'inline',
                            system: { name: 'Some System' },
                            title: 'My Ad',
                            impressions: [{ uri: 'some-pixel' }],
                            creatives: [
                                {
                                    type: 'companions',
                                    companions: [
                                        {
                                            width: 300,
                                            height: 250,
                                            resources: [{ type: 'iframe', data: 'iframe.html' }]
                                        }
                                    ]
                                },
                                {
                                    type: 'nonLinear',
                                    ads: [
                                        {
                                            width: 300,
                                            height: 250,
                                            resources: [{ type: 'iframe', data: 'iframe.html' }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: '12345',
                            type: 'inline',
                            system: { name: 'Some System' },
                            title: 'My Ad',
                            description: 'This is a great ad!',
                            impressions: [{ uri: 'some-pixel' }],
                            creatives: [
                                {
                                    id: 'my-creative',
                                    type: 'companions',
                                    companions: [
                                        {
                                            width: 300,
                                            height: 250,
                                            resources: [{ type: 'iframe', data: 'iframe.html' }]
                                        }
                                    ]
                                },
                                {
                                    type: 'nonLinear',
                                    ads: [
                                        {
                                            width: 300,
                                            height: 250,
                                            resources: [{ type: 'iframe', data: 'iframe.html' }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }));
                result.then(done, done);
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('VAST has no linear creative.'));
            });
        });
    });

    describe('if only a subset of fields is requested', function() {
        beforeEach(function(done) {
            VAST.fetch.calls.reset();
            success.calls.reset();
            failure.calls.reset();
            VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                resolve = _resolve_;
                reject = _reject_;
            }));

            options.fields = ['type', 'uri', 'duration', 'title'];

            fetchAsVAST(options).then(success, failure).then(done, done);
            resolve(new VAST({
                version: '2.0',
                ads: [
                    {
                        id: '12345',
                        type: 'inline',
                        system: { name: 'Some System' },
                        title: 'My Ad',
                        description: 'This is a great ad!',
                        impressions: [{ uri: 'some-pixel' }],
                        creatives: [
                            {
                                type: 'linear',
                                duration: 120,
                                mediaFiles: [
                                    { delivery: 'progressive', type: 'application/flash', uri: 'swf.swf', width: 800, height: 600 },
                                    { delivery: 'progressive', type: 'video/webm', uri: 'ad.webm', width: 600, height: 480 },
                                    { delivery: 'progressive', type: 'video/mp4', uri: 'ad.mp4', width: 1080, height: 720 },
                                    { delivery: 'progressive', type: 'video/mp4', uri: 'ad2.mp4', width: 480, height: 320 }
                                ]
                            }
                        ]
                    }
                ]
            }));
        });

        it('should respond with only that subset of fields', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vast',
                uri: options.uri,
                duration: 120,
                title: 'My Ad'
            });
        });
    });

    describe('if only local fields are requested', function() {
        beforeEach(function(done) {
            VAST.fetch.calls.reset();
            success.calls.reset();
            failure.calls.reset();
            VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                resolve = _resolve_;
                reject = _reject_;
            }));

            options.fields = ['type', 'uri', 'tags', 'publishedTime'];

            fetchAsVAST(options).then(success, failure).then(done, done);
        });

        it('should not fetch the VAST', function() {
            expect(VAST.fetch).not.toHaveBeenCalled();
        });

        it('should fulfill with the result', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vast',
                uri: options.uri,
                tags: null,
                publishedTime: null
            });
        });
    });

    describe('if unsupported fields are requested', function() {
        beforeEach(function(done) {
            VAST.fetch.calls.reset();
            success.calls.reset();
            failure.calls.reset();
            VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                resolve = _resolve_;
                reject = _reject_;
            }));

            options.fields = ['type', 'dkjhdf', 'duration', '893hrf'];

            fetchAsVAST(options).then(success, failure).then(done, done);
            resolve(new VAST({
                version: '2.0',
                ads: [
                    {
                        id: '12345',
                        type: 'inline',
                        system: { name: 'Some System' },
                        title: 'My Ad',
                        description: 'This is a great ad!',
                        impressions: [{ uri: 'some-pixel' }],
                        creatives: [
                            {
                                type: 'linear',
                                duration: 30,
                                mediaFiles: [
                                    { delivery: 'progressive', type: 'application/flash', uri: 'swf.swf', width: 800, height: 600 },
                                    { delivery: 'progressive', type: 'video/webm', uri: 'ad.webm', width: 600, height: 480 },
                                    { delivery: 'progressive', type: 'video/mp4', uri: 'ad.mp4', width: 1080, height: 720 },
                                    { delivery: 'progressive', type: 'video/mp4', uri: 'ad2.mp4', width: 480, height: 320 }
                                ]
                            }
                        ]
                    }
                ]
            }));
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vast',
                duration: 30
            });
        });
    });

    describe('if there is no URI', function() {
        beforeEach(function(done) {
            VAST.fetch.calls.reset();
            success.calls.reset();
            failure.calls.reset();
            VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                resolve = _resolve_;
                reject = _reject_;
            }));

            options.uri = null;
            fetchAsVAST(options).then(success, failure).then(done, done);
        });

        it('should not fetch anything', function() {
            expect(VAST.fetch).not.toHaveBeenCalled();
        });

        it('should reject the promise', function() {
            expect(failure).toHaveBeenCalledWith(new Error('No URI specified.'));
        });
    });

    ['youtube', 'vimeo', 'dailymotion'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                VAST.fetch.calls.reset();
                success.calls.reset();
                failure.calls.reset();
                VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                    resolve = _resolve_;
                    reject = _reject_;
                }));

                options.type = type;

                fetchAsVAST(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(VAST.fetch).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not configured for VAST.'));
            });
        });
    });

    describe('if the type is vast', function() {
        beforeEach(function(done) {
            VAST.fetch.calls.reset();
            success.calls.reset();
            failure.calls.reset();
            VAST.fetch.and.returnValue(new LiePromise(function(_resolve_, _reject_) {
                resolve = _resolve_;
                reject = _reject_;
            }));

            options.type = 'vast';

            fetchAsVAST(options).then(success, failure);
            LiePromise.resolve().then(done);
        });

        it('should request the VAST', function() {
            expect(VAST.fetch).toHaveBeenCalled();
        });

        it('should not reject the promise', function() {
            expect(failure).not.toHaveBeenCalled();
        });
    });
});
