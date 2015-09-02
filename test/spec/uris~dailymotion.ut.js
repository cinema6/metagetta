var parseDailymotionURI = require('../../lib/uris/dailymotion');

describe('parseDailymotionURI(options)', function() {
    var calls;

    function call() {
        return calls[calls.push({
            result: parseDailymotionURI.apply(null, arguments),
            args: Array.prototype.slice.call(arguments)
        }) - 1].result;
    }

    beforeEach(function() {
        calls = [];
    });

    it('should parse the URI into a type and ID', function() {
        expect(call({ uri: 'http://www.dailymotion.com/video/x346bo6_moment-elephant-attacks-safari-truck_animals' })).toEqual(jasmine.objectContaining({ type: 'dailymotion', id: 'x346bo6' }));
        expect(call({ uri: 'http://www.dailymotion.com/video/x34792s_another-human-flying-machine-built-out-of-drones_sport' })).toEqual(jasmine.objectContaining({ type: 'dailymotion', id: 'x34792s' }));
        expect(call({ uri: 'http://www.dailymotion.com/video/x309bpx' })).toEqual(jasmine.objectContaining({ type: 'dailymotion', id: 'x309bpx' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should parse the type and ID into a URI', function() {
        expect(call({ type: 'dailymotion', id: 'x346bo6' })).toEqual(jasmine.objectContaining({ uri: 'http://www.dailymotion.com/video/x346bo6' }));
        expect(call({ type: 'dailymotion', id: 'x34792s' })).toEqual(jasmine.objectContaining({ uri: 'http://www.dailymotion.com/video/x34792s' }));
        expect(call({ type: 'dailymotion', id: 'x309bpx' })).toEqual(jasmine.objectContaining({ uri: 'http://www.dailymotion.com/video/x309bpx' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should throw an error if the type is not dailymotion or the URI is not a dailymotion URI', function() {
        var error = new Error('Not a Dailymotion config.');

        expect(function() { call({ type: 'youtube', id: 'x34792s'}); }).toThrow(error);
        expect(function() { call({ type: 'vimeo', id: 'x34792s'}); }).toThrow(error);
        expect(function() { call({ type: 'vast', id: 'x34792s'}); }).toThrow(error);

        expect(function() { call({ uri: 'https://www.youtube.com/watch?v=ewPburLEZyY'}); }).toThrow(error);
        expect(function() { call({ uri: 'https://vimeo.com/136337308'}); }).toThrow(error);
        expect(function() { call({ uri: 'http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml2'}); }).toThrow(error);
    });

    it('should throw an error if no id, type or URI is provided', function() {
        var error = new Error('Missing configuration.');

        expect(function() { call({ type: 'dailymotion' }); }).toThrow(error);
        expect(function() { call({ id: 'x34792s' }); }).toThrow(error);
        expect(function() { call({}); }).toThrow(error);
    });
});
