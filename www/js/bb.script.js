/* Author: Luc Martin

 */

var geolocator = (function() {

    var brainModel = Backbone.Model.extend({
        initialize : function() {
            console.log('This model has been initialized.');
            this.on('change', function() {
                console.log('- Values for this model have changed.');
            });
        },
        validate : function() {
            console.log('validate')
        },
    });
    // State Object Initialize default values Uses closure to maintain state if necessary
    var brain = new brainModel({
        'searchedUrls' : [],
        'acceptableUrls' : [], // do we need to restrict the input
        'helpMessage' : 'Please enter a web address without the http://, acceptable values could be "google.com" or "linkedin.com"', // customer help
        'errors' : {
            'invalidUrl' : 'The text you entered is not a valid URL, please make sure that the format is correct.', // invalid url error
            'invalidSite' : 'Unfortunately we don\'t provide location services for this website.' // invalide site (if there is restricted sites)
        }
    });
    console.log(JSON.stringify(brain));
    console.log(brain.get('helpMessage'));

    /**
     * @method get map
     * purpose: call Gmap api generates map and add a pointer
     *
     * @author Open source from the web http://www.coderanch.com/t/512806/HTML-CSS-JavaScript/put-pin-google-maps-location
     * @version 1.0
     */
    function initGmap(latitude, longitude) {

        var latlng = new google.maps.LatLng(latitude, longitude);
        var myOptions = {
            zoom : 12,
            center : latlng,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-wrapper"), myOptions);

        // Creating a marker and positioning it on the map
        var marker = new google.maps.Marker({
            position : new google.maps.LatLng(latitude, longitude),
            map : map
        });

    }

    /**
     * @method initListeners
     * Purpose: initialize all listeners in the page
     *
     * @author Luc Martin
     * @version 1.0
     */
    function initListeners() {

        console.log('Init listeners');

        /**
         * @Listener for the help button
         */
        $('body').on('click', '.help', function(e) {

            // set dialog with help
            $('.help-feedback').html('<span class="help">' + brain.get('helpMessage') + '</span>').dialog({
                width : 400,
                position : {
                    my : "left top",
                    at : "left bottom",
                    of : e.target
                }
            });
            $('body').trigger('helpRequest', brain.get('helpMessage'));
        });

        /**
         * @Listener for the submit button
         */
        $('body').on('click', '.button.submit', processUrlSubmit);

        brain.on('change:searchedUrls', function() {
            console.log('Brain has changed')
        })
        return true;
    }

    /**
     * @method ajaxLocate
     * Purpose: Send a request to freegeoip.net and process response
     *
     * @author Luc Martin
     * @version 1.0
     */
    function ajaxLocate(website) {
        website = (website) ? website : '';
        var url = 'http://ip-api.com/json/';
        $.ajax({
            type : 'GET',

            'url' : url + website,
            'success' : processAjaxSuccess,
            'error' : processAjaxError
        });
    }

    /**
     * @method processUrlSubmit
     * Purpose:
     * Validate text entry to make sure the user uses the right format
     * submit a website to freegeoip.net in order get Latitude and Longitude
     *
     * @author Luc Martin
     * @version 1.0
     * @params e Object Event
     */
    function processUrlSubmit(e) {
        var valid = false;

        // initialize error message
        var error = '';

        // grab the website from the view (input)
        var query = $('.locator-input-js').prop('value');

        // Validate using regex accepted values are XXXX.XXX
        if (/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(query)) {

            // entry is valid
            valid = true;
        } else {
            // not valid set error message
            valid = false;
            // grab error message from the brain
            error = brain.get('errors').invalidUrl;
        };

        // test for valid
        if (valid == true) {

            // clear any error message in the View
            $('.error-wrapper').html('');

            // clone array using underscore
            var arr = _.clone(brain.get('searchedUrls'));

            // push new data
            arr.push(query);

            //set data to model
            brain.set({
                'searchedUrls' : arr,
                validate : true
            })

            // send ajax request
            ajaxLocate(query);

        } else {
            // error handling into the view
            $('.error-wrapper').html('<span class="error">' + error + '</span>');
        }
    }

    /**
     * @method processAjaxSuccess
     * Purpose: Process the json object in case of a successfull answer from the ajax request
     *          callback to initGmap with the response longitude and latitude
     *
     * @author Luc Martin
     * @version 1.0
     */
    function processAjaxSuccess(response) {
        $('body').trigger('map-coordinate-received', response);
        // debugg
        console.log(response);

        // the params from the response
        var latitude = response.lat;
        var longitude = response.lon;

        // set the map
        initGmap(latitude, longitude);

    }

    /**
     * @method processAjaxSuccess
     * Purpose: process ajax errors
     *
     * @author Luc Martin
     * @version 1.0
     *
     */
    function processAjaxError(error) {

        // hummmmm
        console.table(error);

    }

    /**
     * @ method initFlowType
     * Purpose: set the font size for responsive/fluid design
     */
    function initFlowType() {
        $('body').flowtype({

            fontRatio : 100,
            minFont : 10,
            maxFont : 50
        });
    }

    /**
     * @return Object
     * purpose: set public functions for the geolocator object
     */
    return {
        initListeners : initListeners,
        ajaxLocate : ajaxLocate,
        initFlowType : initFlowType,
    };

})()

/**
 * @Listener Process javascript after the document is ready
 * @author Luc Martin
 * @version 1.0
 */
$(document).ready(function() {

    // init listeners
    geolocator.initListeners();
    geolocator.initFlowType();

    // set default location
    geolocator.ajaxLocate();

})
