var metagetta = require('../../lib/metagetta');
var LiePromise = require('lie');
var extend = require('../../lib/utils/extend');

var parseYouTubeURI = require('../../lib/uris/youtube');
var fetchFromYouTube = require('../../lib/fetchers/youtube');

var parseVimeoURI = require('../../lib/uris/vimeo');
var fetchFromVimeo = require('../../lib/fetchers/vimeo');

var parseDailymotionURI = require('../../lib/uris/dailymotion');
var fetchFromDailymotion = require('../../lib/fetchers/dailymotion');

var fetchAsVAST = require('../../lib/fetchers/vast');

describe('metagetta(uri, options)', function() {
    it('should exist', function() {
        expect(metagetta).toEqual(jasmine.any(Function));
    });

    describe('properties:', function() {
        describe('version', function() {
            it('should be the version from package.json', function() {
                expect(metagetta.version).toBe(require('../../package.json').version);
            });
        });

        describe('pipeline', function() {
            it('should be an Array', function() {
                expect(metagetta.pipeline).toEqual(jasmine.any(Array));
            });

            it('should be configured to fetch from sources', function() {
                expect(metagetta.pipeline).toEqual([
                    parseYouTubeURI,
                    parseVimeoURI,
                    parseDailymotionURI,

                    fetchFromYouTube,
                    fetchFromVimeo,
                    fetchFromDailymotion,
                    fetchAsVAST
                ]);
            });
        });
    });

    describe('methods:', function() {
        describe('withConfig(options)', function() {
            var globalOptions;
            var result;

            beforeEach(function() {
                globalOptions = { youtube: { key: 'wiu3yr289y3reh7438rt7384' } };
                result = metagetta.withConfig(globalOptions);
            });

            it('should return a new instance of metagetta', function() {
                expect(result).toEqual(jasmine.any(Function));
                expect(result.name).toBe('metagetta');

                expect(result.version).toBe(metagetta.version);
                expect(result.pipeline).toEqual(metagetta.pipeline);
                expect(result.pipeline).not.toBe(metagetta.pipeline);

                expect(result.withConfig).toBe(metagetta.withConfig);
            });

            describe('when the returned function is called', function() {
                var one;
                var options;
                var success, failure;

                beforeEach(function(done) {
                    options = { type: 'youtube', id: 'bLBSoC_2IY8' };

                    one = jasmine.createSpy('one()').and.returnValue(LiePromise.resolve({}));
                    result.pipeline = [one];

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    result(options).then(success, failure).then(done, done);
                });

                it('should call each pipeline function with a combination of the global and local configs', function() {
                    expect(one).toHaveBeenCalledWith(extend(globalOptions, options));
                });
            });
        });
    });

    describe('when called', function() {
        var one, two, three;
        var success, failure;

        beforeEach(function() {
            one = jasmine.createSpy('one()').and.returnValue(new LiePromise(function() {}));
            two = jasmine.createSpy('two()').and.returnValue(new LiePromise(function() {}));
            three = jasmine.createSpy('three()').and.returnValue(new LiePromise(function() {}));

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            metagetta.pipeline = [one, two, three];
        });

        describe('with a configuration object', function() {
            var config;
            var response;

            beforeEach(function(done) {
                config = {
                    type: 'youtube',
                    id: 'bLBSoC_2IY8',
                    youtube: { key: '2839ry8934rjh834758943473u5r8934758934' }
                };

                response = { type: 'youtube', id: 'bLBSoC_2IY8' };

                one.and.returnValue(LiePromise.reject('Nope'));
                two.and.returnValue(LiePromise.resolve(response));
                three.and.returnValue(LiePromise.reject('Yep'));

                metagetta(config).then(success, failure).then(done);
            });

            it('should resolve to the fulfilled promise\'s value', function() {
                expect(success).toHaveBeenCalledWith(response);
            });

            it('should call the pipeline functions one at a time', function() {
                expect(one).toHaveBeenCalledWith(config);
                expect(two).toHaveBeenCalledWith(config);
                expect(three).not.toHaveBeenCalled();
            });

            it('should pass each function a copy of the config', function() {
                var oneConfig = one.calls.mostRecent().args[0];
                var twoConfig = two.calls.mostRecent().args[0];

                expect(oneConfig).not.toBe(twoConfig);
                expect(oneConfig.youtube).not.toBe(twoConfig.youtube);
            });

            describe('if no functions fulfill', function() {
                var error1, error2, error3;

                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();
                    one.calls.reset();
                    two.calls.reset();
                    three.calls.reset();

                    error1 = new Error('Not me!');
                    error2 = new Error('Or me!');
                    error3 = new Error('I can\'t help either...');

                    one.and.throwError(error1);
                    two.and.returnValue(LiePromise.reject(error2));
                    three.and.returnValue(LiePromise.reject(error3));

                    metagetta(config).then(success, failure).then(done, done);
                });

                it('should reject with an Error', function() {
                    expect(failure).toHaveBeenCalledWith(new Error('Could not find metadata for the specified resource.'));
                    expect(failure.calls.mostRecent().args[0].reasons).toEqual([error1, error2, error3]);
                    expect(failure.calls.mostRecent().args[0].options).toEqual(extend(config, { uri: undefined }));
                });
            });

            describe('if a function fulfills with the passed config object', function() {
                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();
                    one.calls.reset();
                    two.calls.reset();
                    three.calls.reset();

                    one.and.callFake(function(config) {
                        config.uri = 'http://cinema6.com';

                        return LiePromise.resolve(config);
                    });
                    two.and.returnValue(LiePromise.reject('Nope'));
                    three.and.returnValue(LiePromise.resolve(response));

                    metagetta(config).then(success, failure).then(done);
                });

                it('should fulfill with the response', function() {
                    expect(success).toHaveBeenCalledWith(response);
                });

                it('should call the next function with a copy of the returned config', function() {
                    expect(two).toHaveBeenCalledWith(one.calls.mostRecent().args[0]);
                    expect(two.calls.mostRecent().args[0]).not.toBe(one.calls.mostRecent().args[0]);

                    expect(three).toHaveBeenCalledWith(one.calls.mostRecent().args[0]);
                });
            });
        });

        describe('with an array of configuration objects', function() {
            var configs;
            var youtubeResponse, vimeoResponse;

            beforeEach(function(done) {
                configs = [
                    { type: 'youtube', id: 'bLBSoC_2IY8' },
                    { type: 'vimeo', id: '130781615' }
                ];

                youtubeResponse = { data: { youtube: true } };
                vimeoResponse = { data: { vimeo: true } };

                one.and.callFake(function(config) {
                    if (config.type === 'youtube') {
                        return youtubeResponse;
                    } else {
                        return LiePromise.reject('Not youtube!');
                    }
                });
                two.and.returnValue(LiePromise.reject('Not dailymotion!'));
                three.and.callFake(function(config) {
                    if (config.type === 'vimeo') {
                        return vimeoResponse;
                    } else {
                        return LiePromise.reject('Not vimeo!');
                    }
                });

                metagetta(configs).then(success, failure).then(done, done);
            });

            it('should respond with the responses in an array', function() {
                expect(success).toHaveBeenCalledWith([youtubeResponse, vimeoResponse]);
            });

            it('should call each function for each config in the array', function() {
                expect(one).toHaveBeenCalledWith(configs[0]);
                expect(one).toHaveBeenCalledWith(configs[1]);

                expect(two).not.toHaveBeenCalledWith(configs[0]);
                expect(two).toHaveBeenCalledWith(configs[1]);

                expect(three).not.toHaveBeenCalledWith(configs[0]);
                expect(three).toHaveBeenCalledWith(configs[1]);
            });
        });

        describe('with a string', function() {
            var uri;
            var response;

            beforeEach(function(done) {
                uri = 'https://www.youtube.com/watch?v=bLBSoC_2IY8';
                response = { type: 'youtube', id: 'bLBSoC_2IY8' };

                one.and.returnValue(LiePromise.reject('Nope'));
                two.and.returnValue(LiePromise.reject('Nope'));
                three.and.returnValue(response);

                metagetta(uri).then(success, failure).then(done, done);
            });

            it('should resolve with the response', function() {
                expect(success).toHaveBeenCalledWith(response);
            });

            it('should call each function with a generated configuration object', function() {
                [one, two, three].forEach(function(fn) {
                    expect(fn).toHaveBeenCalledWith({ uri: uri });
                });
            });
        });

        describe('with an array of strings', function() {
            var uris;
            var response;

            beforeEach(function(done) {
                uris = ['https://www.youtube.com/watch?v=bLBSoC_2IY8', 'https://vimeo.com/130781615'];
                response = [{ type: 'youtube', id: 'bLBSoC_2IY8' }, { type: 'vimeo', id: '130781615' }];

                one.and.callFake(function(config) {
                    if (/youtube/.test(config.uri)) {
                        return LiePromise.resolve(response[0]);
                    }

                    return LiePromise.reject('Nope');
                });
                two.and.callFake(function(config) {
                    if (/vimeo/.test(config.uri)) {
                        return LiePromise.resolve(response[1]);
                    }

                    return LiePromise.reject('Nope');
                });
                three.and.returnValue(LiePromise.reject('Nope'));

                metagetta(uris).then(success, failure).then(done, done);
            });

            it('should resolve with the response', function() {
                expect(success).toHaveBeenCalledWith(response);
            });

            it('should call each function with a generated configuration object', function() {
                expect(one).toHaveBeenCalledWith({ uri: uris[0] });
                expect(one).toHaveBeenCalledWith({ uri: uris[1] });

                expect(two).toHaveBeenCalledWith({ uri: uris[1] });
            });
        });

        describe('with a string and an object', function() {
            var uri, config;
            var response;

            beforeEach(function(done) {
                uri = 'https://www.youtube.com/watch?v=bLBSoC_2IY8';
                config = { youtube: { key: 'ufweyyr4390875r348r9u43897r6' } };
                response = { type: 'youtube', id: 'bLBSoC_2IY8' };

                one.and.returnValue(LiePromise.reject('Nope'));
                two.and.returnValue(LiePromise.resolve(response));
                three.and.returnValue(LiePromise.reject('Nope'));

                metagetta(uri, config).then(success, failure).then(done, done);
            });

            it('should resolve with the response', function() {
                expect(success).toHaveBeenCalledWith(response);
            });

            it('should call the functions with a config object that includes the provided one', function() {
                [one, two].forEach(function(fn) {
                    expect(fn).toHaveBeenCalledWith(extend(config, { uri: uri }));
                });
            });
        });

        describe('with an array of strings and an object', function() {
            var uris, config;
            var response;

            beforeEach(function(done) {
                uris = ['https://www.youtube.com/watch?v=bLBSoC_2IY8', 'https://vimeo.com/130781615'];
                config = { youtube: { key: 'ufweyyr4390875r348r9u43897r6' } };
                response = [{ type: 'youtube', id: 'bLBSoC_2IY8' }, { type: 'vimeo', id: '130781615' }];

                one.and.callFake(function(config) {
                    if (/youtube/.test(config.uri)) {
                        return LiePromise.resolve(response[0]);
                    }

                    return LiePromise.reject('Nope');
                });
                two.and.callFake(function(config) {
                    if (/vimeo/.test(config.uri)) {
                        return LiePromise.resolve(response[1]);
                    }

                    return LiePromise.reject('Nope');
                });
                three.and.returnValue(LiePromise.reject('Nope'));

                metagetta(uris, config).then(success, failure).then(done, done);
            });

            it('should resolve with the response', function() {
                expect(success).toHaveBeenCalledWith(response);
            });

            it('should call the functions with a config object that includes the provided one', function() {
                expect(one).toHaveBeenCalledWith(extend(config, { uri: uris[0] }));
                expect(one).toHaveBeenCalledWith(extend(config, { uri: uris[1] }));

                expect(two).toHaveBeenCalledWith(extend(config, { uri: uris[1] }));
            });
        });
    });
});
