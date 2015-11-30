var parseInstagramURI = require('../../lib/uris/instagram');

describe('parseInstagramURI(options)', function() {
    var options;
    var result;

    beforeEach(function() {
        options = {};
    });

    it('should exist', function() {
        expect(parseInstagramURI).toEqual(jasmine.any(Function));
    });

    describe('if the uri is not from instagram', function() {
        it('should throw an error', function() {
            expect(function() { parseInstagramURI({ uri: 'https://vimeo.com/85998522' }); }).toThrow();
            expect(function() { parseInstagramURI({ uri: 'http://www.dailymotion.com/video/x338zz6_corgi-wearing-a-samurai-hat-will-make-your-day_fun' }); }).toThrow();
            expect(function() { parseInstagramURI({ uri: 'https://app.mopub.com/dashboard/' }); }).toThrow();
        });
    });

    describe('if the uri prop is not a URI', function() {
        it('should throw an error', function() {
            expect(function() { parseInstagramURI({ uri: true }); }).toThrow();
            expect(function() { parseInstagramURI({ uri: 'kjsdhfu93y4r83h wu7urhg784 f7834gr8' }); }).toThrow();
            expect(function() { parseInstagramURI({ uri: 44 }); }).toThrow();
        });
    });

    describe('if there is no uri or type and id', function() {
        it('should throw an error', function() {
            expect(function() { parseInstagramURI({}); }).toThrow();
            expect(function() { parseInstagramURI({ type: 'instagram', id: '' }); }).toThrow();
            expect(function() { parseInstagramURI({ type: '', id: 'ufGlBv8Z3NU' }); }).toThrow();
        });
    });

    describe('if there is a type and id', function() {
        describe('but the type is not instagram', function() {
            it('should throw an error', function() {
                expect(function() { parseInstagramURI({ type: 'vimeo', id: 'ufGlBv8Z3NU' }); }).toThrow();
                expect(function() { parseInstagramURI({ type: 'dailymotion', id: 'ufGlBv8Z3NU' }); }).toThrow();
                expect(function() { parseInstagramURI({ type: 'vast', id: 'ufGlBv8Z3NU' }); }).toThrow();
            });
        });

        describe('and the type is instagram', function() {
            beforeEach(function() {
                options.type = 'instagram';
                options.id = '-cAWixtOUv';

                result = parseInstagramURI(options);
            });

            it('should decorate the options with an instagram uri and return them', function() {
                expect(result).toBe(options);
                expect(options.uri).toBe('https://instagram.com/p/-cAWixtOUv');
            });
        });
    });

    describe('if the uri is from instagram', function() {
        var uris = ['https://instagram.com/p/-cAWixtOUv', 'https://www.instagram.com/p/-cAWixtOUv'];

        uris.forEach(function(uri) {
            it('should decorate the options with an instagram type and videoid and return them', function() {
                options.uri = uri;
                result = parseInstagramURI(options);
                expect(result).toBe(options);
                expect(options.type).toBe('instagram');
                expect(options.id).toBe('-cAWixtOUv');
            });
        });
    });
});
