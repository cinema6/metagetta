var fetchFromWistia = require('../../lib/fetchers/wistia');
var request = require('superagent');
var LiePromise = require('lie');

describe('fetchFromWistia(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result, response;

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
            uri: 'https://cinema6.wistia.com/medias/9iqvphjp4u',
            type: 'wistia',
            id: '9iqvphjp4u',
            wistia: { key: 'and_peele' }
        };

        var mockApiResponse = '{"id":15933042,"name":"Lenny Delivers Video","type":"Video","created":"2015-09-23T14:11:23+00:00","u' +
            'pdated":"2015-09-23T14:13:56+00:00","duration":40.16,"hashed_id":"9iqvphjp4u","description":"<p>Chec' +
            'k out another video featuring Lenny at <a href=\\"http://wistia.com/product\\">wistia.com/product</a><' +
            '/p>","progress":1.0,"status":"ready","thumbnail":{"url":"https://embed-ssl.wistia.com/deliveries/692' +
            '8fcba8355e38de4d95863a659e1de23cb2071.jpg?image_crop_resized=100x60","width":100,"height":60},"proje' +
            'ct":{"id":1931754,"name":"Borrowed Video","hashed_id":"1ite3jblwu"},"assets":[{"url":"http://embed.w' +
            'istia.com/deliveries/2baa370fce2f3ee920553034fbe9db2fe97387aa.bin","width":1280,"height":720,"fileSi' +
            'ze":63010830,"contentType":"video/mp4","type":"OriginalFile"},{"url":"http://embed.wistia.com/delive' +
            'ries/726f21c905a286f7a1ccfd4770efc57f011fe3b5.bin","width":960,"height":540,"fileSize":5729869,"cont' +
            'entType":"video/x-flv","type":"FlashVideoFile"},{"url":"http://embed.wistia.com/deliveries/cc6ffd18c' +
            'b693b8a498fc926e7699743c5212c9d.bin","width":1280,"height":720,"fileSize":10797429,"contentType":"vi' +
            'deo/x-flv","type":"HdFlashVideoFile"},{"url":"http://embed.wistia.com/deliveries/12f5b88d02eb5693c98' +
            '86d401781665ae6a01635.bin","width":960,"height":540,"fileSize":5707280,"contentType":"video/mp4","ty' +
            'pe":"HdMp4VideoFile"},{"url":"http://embed.wistia.com/deliveries/bdc8afaed524c0807004d630cbda9e90304' +
            'd0b65.bin","width":640,"height":360,"fileSize":3711233,"contentType":"video/mp4","type":"IphoneVideo' +
            'File"},{"url":"http://embed.wistia.com/deliveries/1b069310e09cd73235a64bf0d68705bcd295dc9a.bin","wid' +
            'th":960,"height":540,"fileSize":6743400,"contentType":"video/x-flv","type":"MdFlashVideoFile"},{"url' +
            '":"http://embed.wistia.com/deliveries/e5756cdff17218b3cd983013e98a55d74dcf5ebb.bin","width":960,"hei' +
            'ght":540,"fileSize":6711589,"contentType":"video/mp4","type":"MdMp4VideoFile"},{"url":"http://embed.' +
            'wistia.com/deliveries/6928fcba8355e38de4d95863a659e1de23cb2071.bin","width":960,"height":540,"fileSi' +
            'ze":212834,"contentType":"image/jpeg","type":"StillImageFile"}],"embedCode":""}';
        response = JSON.parse(mockApiResponse);

        result = fetchFromWistia(options).then(success, failure);
        process.nextTick(done);
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to V1 of Vimeo\'s API', function() {
        expect(request.get).toHaveBeenCalledWith('https://api.wistia.com/v1/medias/9iqvphjp4u.json?api_password=and_peele');
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
                type: 'wistia',
                id: options.id,
                uri: options.uri,
                title: 'Lenny Delivers Video',
                description: 'Check out another video featuring Lenny at wistia.com/product',
                duration: 40.16,
                hd: true,
                tags: [],
                publishedTime: new Date('2015-09-23T14:11:23+00:00')
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

                fetchFromWistia(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a Wistia config.'));
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

            fetchFromWistia(options).then(success, failure).then(done, done);

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: 40.16,
                tags: []
            });
        });
    });

    describe('if only local data fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri', 'tags'];

            fetchFromWistia(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'wistia',
                id: options.id,
                uri: options.uri,
                tags: []
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

            fetchFromWistia(options).then(success, failure).then(done, done);
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id
            });
        });
    });
});
