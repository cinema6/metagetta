var jsonp;
var proxyquire = require('proxyquire');

describe('jsonp', function() {
    var jsonpLib;
    
    beforeEach(function() {
        jsonpLib = jasmine.createSpy('jsonp()');
        jsonp = proxyquire('../../lib/utils/jsonp.js', {
            'jsonp': jsonpLib,
            
            '@noCallThru': true
        });
    });
    
    it('should use the jsonp module', function() {
        jsonp('the url');
        expect(jsonpLib).toHaveBeenCalledWith('the url', jasmine.any(Function));
    });
    
    it('should resolve on success', function(done) {
        jsonpLib.and.callFake(function(url, callback) {
            callback(null, 'the body');
        });
        jsonp('the url').then(function(response) {
            expect(response).toEqual({
                body: 'the body'
            });
            done();
        }).catch(done.fail);
    });
    
    it('should reject on a failure', function(done) {
        jsonpLib.and.callFake(function(url, callback) {
            callback('epic fail', 'the body');
        });
        jsonp('the url').then(done.fail).catch(function(error) {
            expect(error).toBe('epic fail');
            done();
        });
    });
});
