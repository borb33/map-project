// Create empty array of markers
var markers = [];

// Set the default locations that will be displayed in the map
var locations = [
    {
        title: 'Buenos Aires Botanical Garden',
        originalName:'Jardín Botánico Carlos Thays',
        location: {lat: -34.582576,lng: -58.417388},
        image : null,
        description: null
    },
    {
        title: 'MALBA',
        originalName:'MALBA',
        location: {lat: -34.577012,lng: -58.403330},
        image : null,
        description: null
    },
    {
        title: 'National Museum of Decorative Arts',
        originalName:'Museo Nacional de Bellas Artes',
        location: {lat: -34.583780, lng: -58.392342},
        image : null,
        description: null
    },
];

// Callback function from Google maps api
// Creates a new map with the location of Buenos Aires, Argentina
var initMap = function() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: -34.587066, lng: -58.426996}
    });

    var markerInfowindow = new google.maps.InfoWindow();

    // Create an array of markers based on the locations
    for(var i=0; i<locations.length; i++) {
        // Get the title and the position
        var title = locations[i].title;
        var location = locations[i].location;

        // Create the markers and put them into the array markers
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);

        // Create an onclick event to open the markerInfoWindow
        marker.addListener('click', function() {
            openInfoWindow(this, markerInfowindow);
        });
    }

    // Open an infoWindow with the information of the marker
    // when is clicked
    var openInfoWindow = function(marker, infoWindow) {

        // Check if is not already open
        if(marker != infoWindow.marker) {

            // Set the image path if was already getted from API
            var imageUrl = locations[marker.id]['image'] !== null ?
                locations[marker.id]['image'] :
                'images/blank.png';

            // Set the description path if was already getted from the API
            var description = locations[marker.id]['description'] !== null ?
                locations[marker.id]['description'] :
                'Loading description...';

            // Set the tile and base elements in the infowindow
            infoWindow.setContent(`
                <div class="info-container">
                    <h2>`+marker.title+`</h2>
                    <img src="`+imageUrl+`" id="location-image" alt="`+marker.title+`">
                    <p id="location-description">`+description+`</p>
                </div>
            `);
            infoWindow.marker = marker;

            // Clear the marker property when the infowindow is closed
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            })

            // Check if the location item has an image otherwise
            // get the information from the Foursquare API
            if(locations[marker.id]['image'] === null) {
                var markerLocation = locations[marker.id].location;
                $.ajax({
                    url: 'https://api.foursquare.com/v2/venues/search?'+
                            'll='+markerLocation.lat+','+markerLocation.lng+'&'+
                            'client_id=KOO1EUSAY50U1VPWO4S51XAQQQWBEDSC2VMUGBYER25AW5T2&'+
                            'client_secret=M04BBX5TH4EWRN22OPIPYLYZBO0LHFJS0CGJXRD1EBMH4DOY&'+
                            'v=20180801&'+
                            'query='+locations[marker.id]['originalName'],
                    dataType: 'json',
                    success: function(data) {
                        // Get the picture using the venue id received
                        getPicture(data.response.venues[0].id, marker.id);
                    },
                    error: function() {
                        return false;
                    }
                });
            }

            // Check if the location item has the description otherwise
            // get the information from the Wiki API
            if(locations[marker.id]['description'] === null) {
                $.ajax({
                    url: 'https://en.wikipedia.org/w/api.php?action=opensearch&'+
                            'search='+locations[marker.id]['title']+'&'+
                            'format=json',
                    dataType: 'jsonp',
                    success: function(data) {
                        // Get the result from api if not found set as null
                        var descriptionApi = data[2][0] !== undefined ?
                            data[2][0] : null;

                        // Display the description in the infoWindow
                        $('#location-description').text(
                            descriptionApi!=null ? descriptionApi :
                            'Unable to get the description for this location.'
                        );

                        // Save the description in the location object
                        locations[marker.id]['description'] = descriptionApi;
                    },
                    error: function() {
                        return false;
                    }
                });
            }

            // Open the infowindow
            infoWindow.open(map, marker);
        }
    }

    // This function will return the picture url from Foursquare API
    // using the venue id provided, then set the url into the img tag and
    // save the result url in the location object
    var getPicture = function(venueId, locationId) {
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/'+venueId+'/photos?'+
                    'client_id=KOO1EUSAY50U1VPWO4S51XAQQQWBEDSC2VMUGBYER25AW5T2&'+
                    'client_secret=M04BBX5TH4EWRN22OPIPYLYZBO0LHFJS0CGJXRD1EBMH4DOY&'+
                    'v=20180801',
            dataType: 'json',
            success: function(data) {
                var venuePhoto = data.response.photos.items[0];

                // Set the picture in the infowindow img tag
                var locationUrl = venuePhoto != undefined ?
                    venuePhoto.prefix+'200x100'+venuePhoto.suffix : null;
                $('#location-image').attr('src',
                    locationUrl != null ? locationUrl : 'images/blank.png'
                );

                // Save the url in the location object
                locations[locationId]['image'] = locationUrl;
            },
            error: function() {
                return false;
            }
        });
    }
}

// ViewModel
var ViewModel = function() {
    var self = this;

    // Toogle to display or hide the list container
    self.toogleContainer = function() {
        $('.list-container').slideToggle('fast');
    };

}

ko.applyBindings(new ViewModel());
