var fetchFromInstagram;
var LiePromise = require('lie');
var proxyquire = require('proxyquire');

describe('fetchFromInstagram(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;
    var response;
    var stubs;
    var jsonp, getVideoMetadata;

    beforeEach(function(done) {
        jsonp = jasmine.createSpy('jsonp()').and.callFake(function(uri) {
            var deferred = {};
            var req = {
                then: function(resolve, reject) {
                    deferred.resolve = resolve;
                    deferred.reject = reject;
                }
            };
            deferred.request = req;

            requestDeferreds[uri] = deferred;

            return LiePromise.resolve(req);
        });
        getVideoMetadata = jasmine.createSpy();
        stubs = {
            '../utils/jsonp': jsonp,
            '../utils/get_video_metadata': getVideoMetadata,
            
            '@noCallThru': true
        };
        fetchFromInstagram = proxyquire('../../lib/fetchers/instagram.js', stubs);

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        requestDeferreds = {};

        options = {
            uri: 'https://instagram.com/p/6DD1crjvG7/',
            type: 'instagram',
            id: '6DD1crjvG7',
            instagram: { key: 'J051Un2Qa37ZjX8LkU44c9jMK4jF8mO7' }
        };

        result = fetchFromInstagram(options).then(success, failure);

        var mockApiResponse = '{"meta":{"code":200},"data":{"attribution":null,"videos":{"low_bandwidth":{"url":"https://scontent.c' +
            'dninstagram.com/hphotos-xft1/t50.2886-16/11773224_636978613106125_786337119_s.mp4","width":480,"heig' +
            'ht":480},"standard_resolution":{"url":"https://scontent.cdninstagram.com/hphotos-xpf1/t50.2886-16/11' +
            '847040_533864646760736_1934852926_n.mp4","width":640,"height":640},"low_resolution":{"url":"https://' +
            'scontent.cdninstagram.com/hphotos-xft1/t50.2886-16/11773224_636978613106125_786337119_s.mp4","width"' +
            ':480,"height":480}},"tags":[],"location":null,"comments":{"count":54985,"data":[{"created_time":"144' +
            '8235053","text":"@rizzyna  las gatas de Taylor!!!!","from":{"username":"yasrima","profile_picture":"' +
            'https://scontent.cdninstagram.com/hphotos-xap1/t51.2885-19/s150x150/11371043_1622657257985092_148821' +
            '8309_a.jpg","id":"283909624","full_name":"Yasmina"},"id":"1124199571586478805"},{"created_time":"144' +
            '8235114","text":"@yasrima q monaas!!","from":{"username":"rizzyna","profile_picture":"https://sconte' +
            'nt.cdninstagram.com/hphotos-xfa1/t51.2885-19/11055483_593689137434700_438584049_a.jpg","id":"1030970' +
            '7","full_name":"Natalia Plaza"},"id":"1124200083023131396"},{"created_time":"1448254528","text":"@wi' +
            'ldbindi hahahahaa 😂😂😂","from":{"username":"biz1990","profile_picture":"https://scontent.cdninstag' +
            'ram.com/hphotos-xpf1/t51.2885-19/10507831_1454904131433328_2045108801_a.jpg","id":"211102412","full_' +
            'name":"Elizabeth Monaghan"},"id":"1124362939525952108"},{"created_time":"1448273089","text":"I Love ' +
            'you Taylor 💋💋💋💋","from":{"username":"abcgirle9","profile_picture":"https://scontent.cdninstagram' +
            '.com/hphotos-xfp1/t51.2885-19/s150x150/12237353_1516241062002365_1290827637_a.jpg","id":"2213207845"' +
            ',"full_name":"😻😻😻"},"id":"1124518639287857247"},{"created_time":"1448285090","text":"LOOK TAYS CA' +
            'T AND ROSIE ARE TWINNING @charming.harold","from":{"username":"momentswift","profile_picture":"https' +
            '://scontent.cdninstagram.com/hphotos-xpf1/t51.2885-19/s150x150/12256733_1712450738998796_805504619_a' +
            '.jpg","id":"1588695335","full_name":"1D // T.S"},"id":"1124619305419207241"},{"created_time":"144829' +
            '1089","text":"still in love with this","from":{"username":"eggswift","profile_picture":"https://scon' +
            'tent.cdninstagram.com/hphotos-xtp1/t51.2885-19/s150x150/12139625_1673366489543652_1788737008_a.jpg",' +
            '"id":"1717042531","full_name":"☃logan☃"},"id":"1124669633913090303"},{"created_time":"1448291488","t' +
            'ext":"@shayydshay LOL 😂😍","from":{"username":"christi2694","profile_picture":"https://scontent.cdn' +
            'instagram.com/hphotos-xpt1/t51.2885-19/s150x150/12071115_1680230388876220_1248299211_a.jpg","id":"34' +
            '060464","full_name":"Christi2694"},"id":"1124672978803421683"},{"created_time":"1448294189","text":"' +
            '👑👑👑👑👑👑👑","from":{"username":"irem_tayswift1989","profile_picture":"https://scontent.cdninstag' +
            'ram.com/hphotos-xtp1/t51.2885-19/s150x150/12224535_751204068317399_2002195883_a.jpg","id":"161947196' +
            '2","full_name":"💋💝🎶taylorswiftismyQueen ♏akrep"},"id":"1124695638958600651"}]},"filter":"Normal",' +
            '"created_time":"1438876747","link":"https://instagram.com/p/6DD1crjvG7/","likes":{"count":1339638,"d' +
            'ata":[{"username":"kgsop924","profile_picture":"https://scontent.cdninstagram.com/hphotos-xta1/t51.2' +
            '885-19/s150x150/12224239_554535261369708_1674029670_a.jpg","id":"2288761744","full_name":""},{"usern' +
            'ame":"javi_dilaurentis","profile_picture":"https://scontent.cdninstagram.com/hphotos-xpt1/t51.2885-1' +
            '9/s150x150/12224572_549882981834865_2095581609_a.jpg","id":"2288683251","full_name":""},{"username":' +
            '"taimu689","profile_picture":"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-19/s150x150/12' +
            '237165_1646938145565488_1538779728_a.jpg","id":"2289060355","full_name":""},{"username":"ggbelles","' +
            'profile_picture":"https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-19/s150x150/12237078_92018' +
            '3881406910_2052571395_a.jpg","id":"2288743135","full_name":""}]},"images":{"low_resolution":{"url":"' +
            'https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/s320x320/e15/11821147_104753706542520_203' +
            '3718459_n.jpg","width":320,"height":320},"thumbnail":{"url":"https://scontent.cdninstagram.com/hphot' +
            'os-xft1/t51.2885-15/s150x150/e15/11821147_104753706542520_2033718459_n.jpg","width":150,"height":150' +
            '},"standard_resolution":{"url":"https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/e15/11821' +
            '147_104753706542520_2033718459_n.jpg","width":640,"height":640}},"users_in_photo":[],"caption":{"cre' +
            'ated_time":"1438876747","text":"Coming Home to Mixed Reactions - a short film","from":{"username":"t' +
            'aylorswift","profile_picture":"https://scontent.cdninstagram.com/hphotos-prn/t51.2885-19/10617008_54' +
            '0121486120445_1609281390_a.jpg","id":"11830955","full_name":"Taylor Swift"},"id":"104569649085958987' +
            '2"},"type":"video","id":"1045696405547446715_11830955","user":{"username":"taylorswift","profile_pic' +
            'ture":"https://scontent.cdninstagram.com/hphotos-prn/t51.2885-19/10617008_540121486120445_1609281390' +
            '_a.jpg","id":"11830955","full_name":"Taylor Swift"}}}';
        response = JSON.parse(mockApiResponse);

        process.nextTick(done);
    });

    afterEach(function(done) {
        process.nextTick(done);
    });

    it('should return a promise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to the instagram API', function() {
        expect(jsonp).toHaveBeenCalledWith('https://api.instagram.com/v1/media/shortcode/6DD1crjvG7?client_id=J051Un2Qa37ZjX8LkU44c9jMK4jF8mO7');
    });

    describe('when the response is received', function() {
        beforeEach(function() {
            requestDeferreds['https://api.instagram.com/v1/media/shortcode/6DD1crjvG7?client_id=J051Un2Qa37ZjX8LkU44c9jMK4jF8mO7'].resolve({ body: response });
        });

        describe('when the response does not contain any videos', function() {
            beforeEach(function(done) {
                delete response.data.videos;
                result.then(done, done);
            });
            
            it('should not use ffmpeg', function() {
                expect(getVideoMetadata).not.toHaveBeenCalled();
            });
            
            it('should fulfill with a normalized response', function() {
                expect(success).toHaveBeenCalledWith({
                    type: 'instagram',
                    id: '6DD1crjvG7',
                    uri: 'https://instagram.com/p/6DD1crjvG7/',
                    title: null,
                    description: 'Coming Home to Mixed Reactions - a short film',
                    duration: null,
                    hd: false,
                    tags: [],
                    publishedTime: new Date(1438876747000)
                });
            });
        });

        describe('when ffmpeg successfully is able to fetch metadata', function() {
            beforeEach(function(done) {
                getVideoMetadata.and.returnValue(LiePromise.resolve({
                    duration: 123
                }));
                result.then(done, done);
            });
            
            it('should use ffmpeg to get some metadata for the smallest video', function() {
                expect(getVideoMetadata).toHaveBeenCalledWith('https://scontent.cdninstagram.com/hphotos-xft1/t50.2886-16/11773224_636978613106125_786337119_s.mp4');
            });

            it('should fulfill with a normalized response', function() {
                expect(success).toHaveBeenCalledWith({
                    type: 'instagram',
                    id: '6DD1crjvG7',
                    uri: 'https://instagram.com/p/6DD1crjvG7/',
                    title: null,
                    description: 'Coming Home to Mixed Reactions - a short film',
                    duration: 123,
                    hd: false,
                    tags: [],
                    publishedTime: new Date(1438876747000)
                });
            });
        });
        
        describe('when ffmpeg throws an error when trying to fetch metadata', function() {
            beforeEach(function(done) {
                getVideoMetadata.and.returnValue(LiePromise.reject('epic fail'));
                result.then(done, done);
            });
            
            it('should use ffmpeg to get some metadata for the smallest video', function() {
                expect(getVideoMetadata).toHaveBeenCalledWith('https://scontent.cdninstagram.com/hphotos-xft1/t50.2886-16/11773224_636978613106125_786337119_s.mp4');
            });

            it('should fulfill with a normalized response', function() {
                expect(success).toHaveBeenCalledWith({
                    type: 'instagram',
                    id: '6DD1crjvG7',
                    uri: 'https://instagram.com/p/6DD1crjvG7/',
                    title: null,
                    description: 'Coming Home to Mixed Reactions - a short film',
                    duration: null,
                    hd: false,
                    tags: [],
                    publishedTime: new Date(1438876747000)
                });
            });
        });
        
        describe('checking if the video is hd', function() {
            beforeEach(function(done) {
                /* jshint camelcase:false */
                response.data.videos.standard_resolution.height = 721;
                /* jshint camelcase:true */
                getVideoMetadata.and.returnValue(LiePromise.resolve({
                    duration: 123
                }));
                result.then(done, done);
            });
            
            it('should be able to occur', function() {
                var result = success.calls.mostRecent().args[0];
                expect(result.hd).toBe(true);
            });
        });
    });

    describe('if the request fails', function() {
        var error;

        beforeEach(function(done) {
            error = new Error('The request failed.');

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].reject(error);
            });

            result.then(done, done);
        });

        it('should reject the promise', function() {
            expect(failure).toHaveBeenCalledWith(error);
        });
    });

    ['vimeo', 'dailymotion', 'vast'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                success.calls.reset();
                failure.calls.reset();
                jsonp.calls.reset();
                options.type = type;

                fetchFromInstagram(options).then(success, failure).then(done, done);
            });

            it('should not make a request to the instagram api', function() {
                expect(jsonp).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not an Instagram config.'));
            });
        });
    });

    describe('if only certain fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            jsonp.calls.reset();
            options.fields = ['title', 'description', 'tags', 'publishedTime'];

            process.nextTick(function() {
                fetchFromInstagram(options).then(success, failure).then(done, done);
                process.nextTick(function() {
                    Object.keys(requestDeferreds).forEach(function(uri) {
                        requestDeferreds[uri].resolve({ body: response });
                    });
                });
            });
        });

        it('should respond with only the requested fields', function() {
            expect(success).toHaveBeenCalledWith({
                title: null,
                description: 'Coming Home to Mixed Reactions - a short film',
                tags: [],
                publishedTime: new Date(1438876747000)
            });
        });
    });

    describe('if only the type, uri, or id are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            jsonp.calls.reset();
            options.fields = ['type', 'id', 'uri'];

            fetchFromInstagram(options).then(success, failure).then(done, done);
        });

        it('should not make any request', function() {
            expect(jsonp).not.toHaveBeenCalled();
        });

        it('should respond with the requested fields', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'instagram',
                id: '6DD1crjvG7',
                uri: 'https://instagram.com/p/6DD1crjvG7/'
            });
        });
    });

    describe('if unsupported fields are specified', function() {
        beforeEach(function(done) {
            success.calls.reset();
            failure.calls.reset();
            options.fields = ['id', 'foo', 'type'];

            fetchFromInstagram(options).then(success, failure).then(done, done);
        });

        it('should ignore the unknown fields', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id,
                type: options.type
            });
        });
    });
});
