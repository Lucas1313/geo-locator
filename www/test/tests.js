var testManager = (function() {
    function runTests() {
        
        // these test things from plugins.js
        test("Environment is good", function() {
            expect(3);
            ok(!!window.log, "log function present");

            var history = log.history && log.history.length || 0;
            log("logging from the test suite.")
            equals(log.history.length - history, 1, "log history keeps track")

            ok(!!window.Modernizr, "Modernizr global is present");
        });
        
        // documentation on writing tests here: http://docs.jquery.com/QUnit
        // example tests: https://github.com/jquery/qunit/blob/master/test/same.js

        // below are some general tests but feel free to delete them.
        $('body').on('map-coordinate-received',function(e,response){
            var response = response;
           
                module("TESTING ");
                test("site was able to get coordinates ", function() {
                    expect(1);
                    equal( typeof response, 'object', 'Latitude '+ response.lat+' Longtitude '+ response.lon);
                });
           
        });
        // below are some general tests but feel free to delete them.
        $('body').on('helpRequest',function(e,response){
            var response = response;
                module("TESTING Help");
                test("Help message exists ", function() {
                    expect(1);
                    equal( typeof response, 'string', response);
                });
           
        });
        
        
    }
    
    function showTest() {
        $('.test-wrapper').dialog({
            'width' : 700
        });
        
    }

    return {
        runTests : runTests,
        showTest : showTest
    }
})()
$(document).ready(function(){
    testManager.showTest();
    testManager.runTests();
   
})

