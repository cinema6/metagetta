var parseVimeoURI = require('../../lib/uris/vimeo');

describe('parseVimeoURI(options)', function() {
    var calls;

    function call() {
        return calls[calls.push({
            result: parseVimeoURI.apply(null, arguments),
            args: Array.prototype.slice.call(arguments)
        }) - 1].result;
    }

    beforeEach(function() {
        calls = [];
    });

    it('should convert the URI into a type and id', function() {
        expect(call({ uri: 'https://vimeo.com/channels/lexusshortfilms/136651984' })).toEqual(jasmine.objectContaining({ type: 'vimeo', id: '136651984' }));
        expect(call({ uri: 'https://vimeo.com/136337308' })).toEqual(jasmine.objectContaining({ type: 'vimeo', id: '136337308' }));
        expect(call({ uri: 'https://vimeo.com/137531269' })).toEqual(jasmine.objectContaining({ type: 'vimeo', id: '137531269' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should convert a type and id into a URI', function() {
        expect(call({ type: 'vimeo', id: '136651984' })).toEqual(jasmine.objectContaining({ uri: 'https://vimeo.com/136651984' }));
        expect(call({ type: 'vimeo', id: '136337308' })).toEqual(jasmine.objectContaining({ uri: 'https://vimeo.com/136337308' }));
        expect(call({ type: 'vimeo', id: '137531269' })).toEqual(jasmine.objectContaining({ uri: 'https://vimeo.com/137531269' }));

        calls.forEach(function(call) { expect(call.result).toBe(call.args[0]); });
    });

    it('should throw an error if the type is not "vimeo"', function() {
        var error = new Error('Not a Vimeo config.');

        expect(function() { call({ type: 'youtube', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'dailymotion', id: '136651984' }); }).toThrow(error);
        expect(function() { call({ type: 'vast', id: '136651984' }); }).toThrow(error);
    });

    it('should throw an error if the URI is not a vimeo URI', function() {
        var error = new Error('Not a Vimeo config.');

        expect(function() { call({ uri: 'http://www.dailymotion.com/video/x3408ko_halo-5-guardians-opening-cinematic-trailer-first-look-official-xbox-one-exclusive-game-2015_shortfilms3' }); }).toThrow(error);
        expect(function() { call({ uri: 'https://www.youtube.com/watch?v=ewPburLEZyY' }); }).toThrow(error);
        expect(function() { call({ uri: 'http://demo.tremorvideo.com/proddev/vast/vast_inline_linear.xml2' }); }).toThrow(error);
    });

    it('should throw an error if neither an ID nor URI are provided', function() {
        var error = new Error('Missing configuration.');

        expect(function() { call({ type: 'vimeo' }); }).toThrow(error);
    });
});
