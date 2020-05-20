/*                                                                      *
 *                  SETTING UP LEAFLETS API                             *
 *                                                                      */

var mymap = L.map('map').setView([42.412660,-71.123060], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidHByZWJlbmRhIiwiYSI6ImNrYWZ2MDQ1djAwaGMyeHF0OTV4eDVzenAifQ.lxCM4eHlgBPXKqeDIr8pFw'
}).addTo(mymap);


// Create marker
var marker;
function onMapClick(e) {
    if (marker == null) {
        marker = L.marker(e.latlng).addTo(mymap)
    }
    else {
    marker.setLatLng(e.latlng)
    }
}
mymap.on('click', onMapClick);




/*                                                                      *
 *                  SETTING UP GOOGLE MAPS API                          *
 *                                                                      */

// // Create the script tag, set the appropriate attributes
// var script = document.createElement('script');
// script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBR55aptcBIiYUnfqlSQKvg8WjPg2dScqA&callback=initMap';
// script.defer = true;
// script.async = true;

// var myC = {lat: 42.412660, lng: -71.123060};

// // Attach your callback function to the `window` object
// window.initMap = function() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: myC,
//         zoom: 12
//     });
// };
// document.head.appendChild(script);


// // Add movable marker        -- DOESN'T WORK --
// var marker = new google.maps.Marker({
//     position: myC,
//     animation:google.maps.Animation.DROP
// });
// marker.setMap(map);

// window.google.maps.event.addListener(marker, 'click', function(event) {
//     placeMarker(event.latLng);
// });

