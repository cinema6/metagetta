var jsonp = require('../../lib/utils/jsonp');
var request = require('superagent');
var LiePromise = require('lie');

describe('jsonp', function() {
    var requestDeferreds;
    
    beforeEach(function() {
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
    });

    it('should use superagent to perform the request since we are in a node environment', function() {
        jsonp('the url');
        expect(request.get).toHaveBeenCalledWith('the url');
    });
    
    it('should resolve if the request fails', function(done) {
        var result = jsonp('the url');
        expect(result).toEqual(jasmine.any(LiePromise));
        requestDeferreds['the url'].resolve('the response');
        result.then(function(response) {
            expect(response).toBe('the response');
            done();
        }).catch(done.fail);
    });
    
    it('should reject if the request fails', function(done) {
        var result = jsonp('the url');
        expect(result).toEqual(jasmine.any(LiePromise));
        requestDeferreds['the url'].reject('epic fail');
        result.then(done.fail).catch(function(error) {
            expect(error).toBe('epic fail');
            done();
        });
    });
});
