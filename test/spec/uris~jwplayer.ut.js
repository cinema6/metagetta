var parseJWPlayerURI = require('../../lib/uris/jwplayer');

describe('parseJWPlayerURI(options)', function() {
    var calls;

    function call() {
        return calls[calls.push({
            result: parseJWPlayerURI.apply(null, arguments),
            args: Array.prototype.slice.call(arguments)
        }) - 1].result;
    }

    beforeEach(function() {
        calls = [];
    });

    it('should convert the URI into a type and id', function() {
        expect(call({ uri: 'https://content.jwplatform.com/previews/quiPCuHv' })).toEqual(jasmine.objectContaining({ type: 'jwplayer', id: 'quiPCuHv' }));
        expect(call({ uri: 'https://content.jwplatform.com/previews/quiPCuHv-n5DiyUyn' })).toEqual(jasmine.objectContaining({ type: 'jwplayer', id: 'quiPCuHv' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should convert a type and id into a URI', function() {
        expect(call({ type: 'jwplayer', id: 'quiPCuHv' })).toEqual(jasmine.objectContaining({ uri: 'https://content.jwplatform.com/previews/quiPCuHv' }));
        expect(call({ type: 'jwplayer', id: 'iGznZrKK' })).toEqual(jasmine.objectContaining({ uri: 'https://content.jwplatform.com/previews/iGznZrKK' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should throw an error if the type is not "vimeo"', function() {
        var error = new Error('Not a JWPlayer config.');

        expect(function() { call({ type: 'youtube', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'dailymotion', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'vast', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'vimeo', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'instagram', id: '136651984' }); }).toThrow(error);
    });

    it('should throw an error if the URI is not a JWPlayer URI', function() {
        var error = new Error('Not a JWPlayer config.');

        expect(function() { call({ uri: 'http://www.dailymotion.com/video/x3408ko_halo-5-guardians-opening-cinematic-trailer-first-look-official-xbox-one-exclusive-game-2015_shortfilms3' }); }).toThrow(error);
        expect(function() { call({ uri: 'https://www.youtube.com/watch?v=ewPburLEZyY' }); }).toThrow(error);
        expect(function() { call({ uri: 'http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml2' }); }).toThrow(error);
    });

    it('should throw an error if neither an ID nor URI are provided', function() {
        var error = new Error('Missing configuration.');

        expect(function() { call({ type: 'jwplayer' }); }).toThrow(error);
    });
});
