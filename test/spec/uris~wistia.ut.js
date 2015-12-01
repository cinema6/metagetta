var parseWistiaURI = require('../../lib/uris/wistia');

describe('parseWistiaURI(options)', function() {
    var options;
    var result;

    beforeEach(function() {
        options = {};
    });

    it('should exist', function() {
        expect(parseWistiaURI).toEqual(jasmine.any(Function));
    });

    describe('if the uri is not from wistia', function() {
        it('should throw an error', function() {
            expect(function() { parseWistiaURI({ uri: 'https://vimeo.com/85998522' }); }).toThrow();
            expect(function() { parseWistiaURI({ uri: 'http://www.dailymotion.com/video/x338zz6_corgi-wearing-a-samurai-hat-will-make-your-day_fun' }); }).toThrow();
            expect(function() { parseWistiaURI({ uri: 'https://app.mopub.com/dashboard/' }); }).toThrow();
        });
    });

    describe('if the uri prop is not a URI', function() {
        it('should throw an error', function() {
            expect(function() { parseWistiaURI({ uri: true }); }).toThrow();
            expect(function() { parseWistiaURI({ uri: 'kjsdhfu93y4r83h wu7urhg784 f7834gr8' }); }).toThrow();
            expect(function() { parseWistiaURI({ uri: 44 }); }).toThrow();
        });
    });

    describe('if there is no uri', function() {
        it('should throw an error', function() {
            var expectedError = new Error('Must specify a URI for Wistia videos');
            expect(function() { parseWistiaURI({}); }).toThrow(expectedError);
            expect(function() { parseWistiaURI({ type: 'wistia', id: '' }); }).toThrow(expectedError);
            expect(function() { parseWistiaURI({ type: '', id: 'ufGlBv8Z3NU' }); }).toThrow(expectedError);
            expect(function() { parseWistiaURI({ type: 'wistia', id: 'ufGlBv8Z3NU' }); }).toThrow(expectedError);
        });
    });

    describe('if there is a uri', function() {
        beforeEach(function() {
            options.uri = 'https://cinema6.wistia.com/medias/9iqvphjp4u';

            result = parseWistiaURI(options);
        });

        it('should decorate the options with a wistia id and return everything', function() {
            expect(result).toBe(options);
            expect(options.id).toBe('9iqvphjp4u');
            expect(options.type).toBe('wistia');
        });
    });
});
