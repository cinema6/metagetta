var htmlToText = require('../../lib/utils/html_to_text');

describe('htmlToText(html)', function() {
    var html;
    var expected;
    var result;

    beforeEach(function() {
        html = 'A chance encounter proves fateful for 2 robots mining on a desolate planet.<br /> <br /> Contact: Hello@Jackanders.com<br /> <br /> Crew:<br /> Created By: Jack Anderson<br /> Original Score By: Cody Bursch<br /> Sound Design By: Jackie! Zhou<br /> Additional Animation: Jen Re, Erica Robinson, Hunter Schmidt, Justine Stewart, Jacqueline Yee<br /> Additional FX: Danny Corona, Matthew Robillard, Tim Trankle<br /> Cloud FX: Chase Levin<br /> Colorist: Bryan Smaller<br /> Rigging: Katelyn Roland<br /> Advisor: Bill Kroyer<br /> <br /> FINALIST: 2015 Student Academy Awards<br /> FINALIST: 2015 Student BAFTA Film Awards<br /> GRAND JURY PRIZE: BEST STUDENT FILM: NASHVILLE FILM FESTIVAL <br /> WINNER: BEST ANIMATED FILM- SONOMA INTERNATIONAL FILM FESTIVAL<br /> WINNER: "BEST ACHIEVEMENT IN ANIMATION" CECIL AWARDS 2014<br /> RUNNER UP: ANCHORAGE INTERNATIONAL FILM FESTIVAL (ANIMATION CATAGORY)<br /> <br /> Festivals & Markets:<br /> Santa Barbara International Film Festival<br /> Ottawa Film Festival<br /> Cleveland International Film Festival<br /> River Run International Film Festival<br /> LA Shorts Fest<br /> Rhode Island Film Festival<br /> Traverse City Film Festival<br /> New Hampshire Film Festival<br /> FIRST CUT 2014 @ DGA in Los Angeles & New York<br /> Fargo Film Festival<br /> Pune International Film Festival<br /> Omaha International Film Festival<br /> Sedona International Film Festival<br /> Independent Film Festival Of Boston<br /> Minneapolis International Film Festival<br /> Athens Animfest <br /> Cannes Short Film Corner<br /> Newport Beach International Film Festival<br /> River Film Festival<br /> Prescott Film Festival<br /> Free Range Film Festival<br /> Breckenridge Film Festival<br /> Fareham Arts Festival';
        expected = 'A chance encounter proves fateful for 2 robots mining on a desolate planet.  Contact: Hello@Jackanders.com  Crew: Created By: Jack Anderson Original Score By: Cody Bursch Sound Design By: Jackie! Zhou Additional Animation: Jen Re, Erica Robinson, Hunter Schmidt, Justine Stewart, Jacqueline Yee Additional FX: Danny Corona, Matthew Robillard, Tim Trankle Cloud FX: Chase Levin Colorist: Bryan Smaller Rigging: Katelyn Roland Advisor: Bill Kroyer  FINALIST: 2015 Student Academy Awards FINALIST: 2015 Student BAFTA Film Awards GRAND JURY PRIZE: BEST STUDENT FILM: NASHVILLE FILM FESTIVAL  WINNER: BEST ANIMATED FILM- SONOMA INTERNATIONAL FILM FESTIVAL WINNER: "BEST ACHIEVEMENT IN ANIMATION" CECIL AWARDS 2014 RUNNER UP: ANCHORAGE INTERNATIONAL FILM FESTIVAL (ANIMATION CATAGORY)  Festivals & Markets: Santa Barbara International Film Festival Ottawa Film Festival Cleveland International Film Festival River Run International Film Festival LA Shorts Fest Rhode Island Film Festival Traverse City Film Festival New Hampshire Film Festival FIRST CUT 2014 @ DGA in Los Angeles & New York Fargo Film Festival Pune International Film Festival Omaha International Film Festival Sedona International Film Festival Independent Film Festival Of Boston Minneapolis International Film Festival Athens Animfest  Cannes Short Film Corner Newport Beach International Film Festival River Film Festival Prescott Film Festival Free Range Film Festival Breckenridge Film Festival Fareham Arts Festival';
        result = htmlToText(html);
    });

    it('should convert the HTML into plain text', function() {
        expect(result).toBe(expected);
    });
    
    it('should convert anchor tags into plain text', function() {
        html = '<a href="www.somewhere.com">Hello World</a>';
        expected = 'Hello World';
        result = htmlToText(html);
        expect(result).toBe(expected);
    });
    
    it('should work with a paragraph tag', function() {
        html = '<p>Hello World</p>';
        expected = 'Hello World';
        result = htmlToText(html);
        expect(result).toBe(expected);
    });
});
