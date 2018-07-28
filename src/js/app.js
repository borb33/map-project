// Create empty array of markers
var markers = [];

// Set the default locations that will be displayed in the map
var locations = [
    {
        title: 'Jardín Botánico Carlos Thays',
        location: {lat: -34.582576,lng: -58.417388},
        image : null,
        description: null
    },
    {
        title: 'Plaza Serrano',
        location: {lat: -34.5876842,lng: -58.4299145},
        image : null,
        description: null
    },
    {
        title: 'Museo de Arte Latinoamericano',
        location: {lat: -34.577012,lng: -58.403330},
        image : null,
        description: null
    },
    {
        title: 'Museo Nacional de Arte Decorativo',
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

            // Set the tile and base elements in the infowindow
            infoWindow.setContent(`
                <div class="info-container">
                    <h2>`+marker.title+`</h2>
                    <img src="images/blank.png" id="location-image">
                    <p id="location-description">Loading description...</p>
                </div>
            `);
            infoWindow.marker = marker;

            // Clear the marker property when the infowindow is closed
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            })

            // Get the information that will be displayed from the Fousquare API


            // Open the infowindow
            infoWindow.open(map, marker);
        }
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
