
// Callback function from Google maps api
var initMap = function() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: -34.587066, lng: -58.426996}
    });
}

// ViewModel
var ViewModel = function() {
    var self = this;

    // Toogle to display or hide the list container
    self.toogleContainer = function() {
        $('.list-container').slideToggle('fast');
    }
}

ko.applyBindings(new ViewModel());
