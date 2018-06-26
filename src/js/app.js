// Create empty array of markers
var markers = [];

// Set the default locations that will be displayed in the map
var locations = [
    {
        title: 'Jardín Botánico Carlos Thays',
        location: {lat: -34.582576,lng: -58.417388}
    },
    {
        title: 'Plaza Serrano',
        location: {lat: -34.5876842,lng: -58.4299145}
    },
    {
        title: 'Museo de Arte Latinoamericano',
        location: {lat: -34.577012,lng: -58.403330}
    },
    {
        title: 'Museo Nacional de Arte Decorativo',
        location: {lat: -34.583780, lng: -58.392342}
    },
];

// Callback function from Google maps api
// Creates a new map with the location of Buenos Aires, Argentina
var initMap = function() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: -34.587066, lng: -58.426996}
    });

    // Create an array of markers with the locations
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
