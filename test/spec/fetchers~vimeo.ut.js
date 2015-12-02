/* jshint camelcase:false */

var fetchFromVimeo = require('../../lib/fetchers/vimeo');
var request = require('superagent');
var LiePromise = require('lie');
var htmlToText = require('../../lib/utils/html_to_text');

describe('fetchFromVimeo(options)', function() {
    var requestDeferreds;
    var options;
    var success, failure;
    var result;

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
            uri: 'https://vimeo.com/137531269',
            type: 'vimeo',
            id: '137531269'
        };

        result = fetchFromVimeo(options).then(success, failure);
        LiePromise.resolve().then(done);
    });

    it('should return a LiePromise', function() {
        expect(result).toEqual(jasmine.any(LiePromise));
    });

    it('should make a request to V2 of Vimeo\'s API', function() {
        expect(request.get).toHaveBeenCalledWith('https://vimeo.com/api/v2/video/137531269.json');
    });

    describe('when the response is received', function() {
        var response;

        beforeEach(function(done) {
            response = [
                {
                    'id': 137531269,
                    'title': 'Wire Cutters',
                    'description': 'A chance encounter proves fateful for 2 robots mining on a desolate planet.<br />\r\n<br />\r\nContact: Hello@Jackanders.com<br />\r\n<br />\r\nCrew:<br />\r\nCreated By: Jack Anderson<br />\r\nOriginal Score By: Cody Bursch<br />\r\nSound Design By: Jackie! Zhou<br />\r\nAdditional Animation: Jen Re, Erica Robinson, Hunter Schmidt, Justine Stewart, Jacqueline Yee<br />\r\nAdditional FX: Danny Corona, Matthew Robillard,  Tim Trankle<br />\r\nCloud FX: Chase Levin<br />\r\nColorist: Bryan Smaller<br />\r\nRigging: Katelyn Roland<br />\r\nAdvisor: Bill Kroyer<br />\r\n<br />\r\nFINALIST: 2015 Student Academy Awards<br />\r\nFINALIST: 2015 Student BAFTA Film Awards<br />\r\nGRAND JURY PRIZE: BEST STUDENT FILM: NASHVILLE FILM FESTIVAL <br />\r\nWINNER: BEST ANIMATED FILM- SONOMA INTERNATIONAL FILM FESTIVAL<br />\r\nWINNER: \'BEST ACHIEVEMENT IN ANIMATION\' CECIL AWARDS 2014<br />\r\nRUNNER UP: ANCHORAGE INTERNATIONAL FILM FESTIVAL (ANIMATION CATAGORY)<br />\r\n<br />\r\nFestivals & Markets:<br />\r\nSanta Barbara International Film Festival<br />\r\nOttawa Film Festival<br />\r\nCleveland International Film Festival<br />\r\nRiver Run International Film Festival<br />\r\nLA Shorts Fest<br />\r\nRhode Island Film Festival<br />\r\nTraverse City Film Festival<br />\r\nNew Hampshire Film Festival<br />\r\nFIRST CUT 2014 @ DGA in Los Angeles & New York<br />\r\nFargo Film Festival<br />\r\nPune International Film Festival<br />\r\nOmaha International Film Festival<br />\r\nSedona International Film Festival<br />\r\nIndependent Film Festival Of Boston<br />\r\nMinneapolis International Film Festival<br />\r\nAthens Animfest <br />\r\nCannes Short Film Corner<br />\r\nNewport Beach International Film Festival<br />\r\nRiver Film Festival<br />\r\nPrescott Film Festival<br />\r\nFree Range Film Festival<br />\r\nBreckenridge Film Festival<br />\r\nFareham Arts Festival',
                    'url': 'https://vimeo.com/137531269',
                    'upload_date': '2015-08-27 16:38:21',
                    'mobile_url': 'https://vimeo.com/137531269',
                    'thumbnail_small': 'https://i.vimeocdn.com/video/532653570_100x75.jpg',
                    'thumbnail_medium': 'https://i.vimeocdn.com/video/532653570_200x150.jpg',
                    'thumbnail_large': 'https://i.vimeocdn.com/video/532653570_640.jpg',
                    'user_id': 4756555,
                    'user_name': 'Jack Anderson',
                    'user_url': 'https://vimeo.com/jackanders',
                    'user_portrait_small': 'https://i.vimeocdn.com/portrait/8829372_30x30.jpg',
                    'user_portrait_medium': 'https://i.vimeocdn.com/portrait/8829372_75x75.jpg',
                    'user_portrait_large': 'https://i.vimeocdn.com/portrait/8829372_100x100.jpg',
                    'user_portrait_huge': 'https://i.vimeocdn.com/portrait/8829372_300x300.jpg',
                    'stats_number_of_likes': 957,
                    'stats_number_of_plays': 203389,
                    'stats_number_of_comments': 42,
                    'duration': 522,
                    'width': 1920,
                    'height': 1080,
                    'tags': 'CGI, Mining, dodge College, Maya, fable, Chapman University, Gems, Robots, Mental Ray, mechanical, astroids, space travel, greed',
                    'embed_privacy': 'anywhere'
                }
            ];

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });

            result.then(done, done);
        });

        it('should respond with a formatted response object', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vimeo',
                id: options.id,
                uri: options.uri,
                title: response[0].title,
                description: htmlToText(response[0].description),
                duration: response[0].duration,
                hd: true,
                tags: response[0].tags.split(/,\s*/),
                publishedTime: new Date(2015, 7, 27),
                views: 203389
            });
        });
    });

    ['youtube', 'dailymotion', 'vast'].forEach(function(type) {
        describe('if the type is ' + type, function() {
            beforeEach(function(done) {
                requestDeferreds = {};
                success.calls.reset();
                failure.calls.reset();
                request.get.calls.reset();
                options.type = type;

                fetchFromVimeo(options).then(success, failure).then(done, done);
            });

            it('should not make a request', function() {
                expect(request.get).not.toHaveBeenCalled();
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Not a Vimeo config.'));
            });
        });
    });

    describe('if a subset of fields are requested', function() {
        var response;

        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['duration', 'tags'];

            response = [
                {
                    'id': 137531269,
                    'title': 'Wire Cutters',
                    'description': 'A chance encounter proves fateful for 2 robots mining on a desolate planet.<br />\r\n<br />\r\nContact: Hello@Jackanders.com<br />\r\n<br />\r\nCrew:<br />\r\nCreated By: Jack Anderson<br />\r\nOriginal Score By: Cody Bursch<br />\r\nSound Design By: Jackie! Zhou<br />\r\nAdditional Animation: Jen Re, Erica Robinson, Hunter Schmidt, Justine Stewart, Jacqueline Yee<br />\r\nAdditional FX: Danny Corona, Matthew Robillard,  Tim Trankle<br />\r\nCloud FX: Chase Levin<br />\r\nColorist: Bryan Smaller<br />\r\nRigging: Katelyn Roland<br />\r\nAdvisor: Bill Kroyer<br />\r\n<br />\r\nFINALIST: 2015 Student Academy Awards<br />\r\nFINALIST: 2015 Student BAFTA Film Awards<br />\r\nGRAND JURY PRIZE: BEST STUDENT FILM: NASHVILLE FILM FESTIVAL <br />\r\nWINNER: BEST ANIMATED FILM- SONOMA INTERNATIONAL FILM FESTIVAL<br />\r\nWINNER: \'BEST ACHIEVEMENT IN ANIMATION\' CECIL AWARDS 2014<br />\r\nRUNNER UP: ANCHORAGE INTERNATIONAL FILM FESTIVAL (ANIMATION CATAGORY)<br />\r\n<br />\r\nFestivals & Markets:<br />\r\nSanta Barbara International Film Festival<br />\r\nOttawa Film Festival<br />\r\nCleveland International Film Festival<br />\r\nRiver Run International Film Festival<br />\r\nLA Shorts Fest<br />\r\nRhode Island Film Festival<br />\r\nTraverse City Film Festival<br />\r\nNew Hampshire Film Festival<br />\r\nFIRST CUT 2014 @ DGA in Los Angeles & New York<br />\r\nFargo Film Festival<br />\r\nPune International Film Festival<br />\r\nOmaha International Film Festival<br />\r\nSedona International Film Festival<br />\r\nIndependent Film Festival Of Boston<br />\r\nMinneapolis International Film Festival<br />\r\nAthens Animfest <br />\r\nCannes Short Film Corner<br />\r\nNewport Beach International Film Festival<br />\r\nRiver Film Festival<br />\r\nPrescott Film Festival<br />\r\nFree Range Film Festival<br />\r\nBreckenridge Film Festival<br />\r\nFareham Arts Festival',
                    'url': 'https://vimeo.com/137531269',
                    'upload_date': '2015-08-27 16:38:21',
                    'mobile_url': 'https://vimeo.com/137531269',
                    'thumbnail_small': 'https://i.vimeocdn.com/video/532653570_100x75.jpg',
                    'thumbnail_medium': 'https://i.vimeocdn.com/video/532653570_200x150.jpg',
                    'thumbnail_large': 'https://i.vimeocdn.com/video/532653570_640.jpg',
                    'user_id': 4756555,
                    'user_name': 'Jack Anderson',
                    'user_url': 'https://vimeo.com/jackanders',
                    'user_portrait_small': 'https://i.vimeocdn.com/portrait/8829372_30x30.jpg',
                    'user_portrait_medium': 'https://i.vimeocdn.com/portrait/8829372_75x75.jpg',
                    'user_portrait_large': 'https://i.vimeocdn.com/portrait/8829372_100x100.jpg',
                    'user_portrait_huge': 'https://i.vimeocdn.com/portrait/8829372_300x300.jpg',
                    'stats_number_of_likes': 957,
                    'stats_number_of_plays': 203389,
                    'stats_number_of_comments': 42,
                    'duration': 522,
                    'width': 1920,
                    'height': 1080,
                    'tags': 'CGI, Mining, dodge College, Maya, fable, Chapman University, Gems, Robots, Mental Ray, mechanical, astroids, space travel, greed',
                    'embed_privacy': 'anywhere'
                }
            ];

            fetchFromVimeo(options).then(success, failure).then(done, done);

            Object.keys(requestDeferreds).forEach(function(uri) {
                requestDeferreds[uri].resolve({ body: response });
            });
        });

        it('should respond with only those fields', function() {
            expect(success).toHaveBeenCalledWith({
                duration: response[0].duration,
                tags: response[0].tags.split(/,\s*/)
            });
        });
    });

    describe('if only local data fields are requested', function() {
        beforeEach(function(done) {
            requestDeferreds = {};
            success.calls.reset();
            failure.calls.reset();
            request.get.calls.reset();
            options.fields = ['type', 'id', 'uri'];

            fetchFromVimeo(options).then(success, failure).then(done, done);
        });

        it('should not make a request', function() {
            expect(request.get).not.toHaveBeenCalled();
        });

        it('should fulfill with the data', function() {
            expect(success).toHaveBeenCalledWith({
                type: 'vimeo',
                id: options.id,
                uri: options.uri
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

            fetchFromVimeo(options).then(success, failure).then(done, done);
        });

        it('should be ignored', function() {
            expect(success).toHaveBeenCalledWith({
                id: options.id
            });
        });
    });
});
