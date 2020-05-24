
/// Default Values for heatmap

var googlefoodData = {max: 0, data: []};
var googlecommunityData = {max: 0, data: []};
var googlebigshopsData = {max: 0, data: []};
var googlesmallshopsData = {max: 0, data: []};
var googletransitData = {max: 0, data: []};
var googletouristData = {max: 0, data: []};

var yelpfoodData = {max: 0, data: []};
var yelpshoppingData = {max: 0, data: []};
var yelpcommunityData= {max: 0, data: []};

var walkscoreData = {max: 0, data: []};
var averageData = {max: 0, data: []};
var compositeData = {max: 0, data: []};
var markercontainer = new Array();

var layersactive = [];


//// Google Reverse Geocodeing Setup (for address display) ////
// ERROR- REMOVE CONSOLE LOGS
var geocoder = new google.maps.Geocoder;
function geocodeLatLng(geocoder, leaflet_latlng) {
    console.log("function called");
    var latlng = {lat: leaflet_latlng.lat, lng: leaflet_latlng.lng};
    console.log("here1");

    geocoder.geocode({'location': latlng}, function(results, status) {
        console.log("here2");
        // console.log(results[0].formatted_address);
        if (status === 'OK') {
            console.log("good");
            if (results[0]) {
                console.log("changing address");
                document.getElementById('address').value = results[0].formatted_address;
            } 
            else {
                document.getElementById('address').value = 'No results found';
            }
        }
        else {
            console.log("bad");
            document.getElementById('address').value = 'Error: ' + status;
        }
        console.log('-');
    });
    console.log("here3");
    console.log("--end of function--");
}


/*                                                                      *
 *                  SETTING UP LEAFLETS API                             *
 *                                                                      */

///   Map is set around my house at Tufts University :)   ///
var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidHByZWJlbmRhIiwiYSI6ImNrYWZ2MDQ1djAwaGMyeHF0OTV4eDVzenAifQ.lxCM4eHlgBPXKqeDIr8pFw'
});


// var baseMaps = { "Map View": baseLayer };

// var heatmap = h337.create({
//   container: document.getElementById('map');
// });

// heatmap.setData({
//     max: 5,
//     data: [{ x: 10, y: 15, value: 5}]
//   });


// /// Create Map Layers ///
// var compositegroup = L.layerGroup([compositelayer]);    
// /// Add Layers to Map ///
// mymap.addLayer(compositegroup);   

/********   HEATMAP SETUP:   **********/
// var cfg = {"radius": .007, "maxOpacity": .8, "scaleRadius": true, "useLocalExtrema": true, latField: 'lat', lngField: 'lng', valueField: 'count',  "blur": .8 };
// var compositelayer = new HeatmapOverlay(cfg);  

var mymap = new L.map('map', {
    center:  new L.latLng(42.412660, -71.123060),
    zoom: 14,
    layers: [baseLayer]
    // layers: [baseLayer, compositeLayer]
}); 

// /// Set Data ///
// var testData = {
//     max: 8,
//     data: [{lat: 42.412600, lng: -71.123000, count: 3}]        // TEST DATA
//   };
//   // {max: 0, data:[]}
// compositelayer.setData(testData);


/// Add Markers to Map on click ///
mymap.on('click', onMapClick);
var marker;
function onMapClick(e) { 
    addMarker(e.latlng, marker);
}

/// Adds marker to map, updates scores, and adds marker-dragging functionality ///
function addMarker(latlng, marker) {
    marker = new L.marker(latlng, {draggable:'true'}).addTo(mymap);
    mymap.setView(latlng, 15);
    geocodeLatLng(geocoder, latlng);

    // for (var name in AllScores) {
    //     document.getElementById(name).value = calculatescore(e.latlng.lat, e.latlng.lng, AllScores[name]);

    //     // (Backup):
    //     // document.getElementById(name).value = calculatescore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]);
    // }

    marker.on('dragend', function(event) {
        var position = event.target.getLatLng();
        marker.setLatLng(position, {draggable:'true'});
        geocodeLatLng(geocoder, position);
        mymap.setView(new L.latLng(position.lat, position.lng), 15);

        // for (var name in AllScores) {
        //     // **** FOR DEBUGGING- IF CONSOLE PRINTS SAME TWO VALUES, CAN DELETE COMMENTED-OUT LINE BELOW CALCULATESCORES CALL
        //     // console.log(marker.getLatLng().lng);
        //     // console.log(position.lng);

        //     document.getElementById(name).value = calculatescore(position.lat, position.lng, AllScores[name]);
        //     // document.getElementById(name).value = calculatescore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]);
        // }
    });

    mymap.addLayer(marker);
    markercontainer.push(marker);
    marker.on('click', markerOnClick);
}


/// Update scores on click ///
function markerOnClick(e) {
    // for (var name in AllScores) {
    //     document.getElementById(name).value = calculatescore(e.latlng.lat,e.latlng.lng, AllScores[name]); 
    // }
    geocodeLatLng(geocoder, e.latlng);
    mymap.setView(e.latlng, 15);
}

 

/// Function for adding multiple heatmaps together ///
// function layertrigger(keyword){
//     index = layersactive.indexOf(keyword);
//     if (index > -1){
//         layersactive.splice(index, 1);
//     } 
//     else{
//         layersactive.push(keyword);
//     }
//     if (layersactive.length > 0) {
//         var newdata = clone(AllScores[layersactive[0]].data);
//         for (var j = 1; j < layersactive.length; j++) {
//             var adder = clone(AllScores[layersactive[j]].data);
//             for (var i = 0; i < newdata.length; i++) {
//             newdata[i].count = newdata[i].count + adder[i].count;
//             }
//         }

//         compositelayer.setData({max:1000, data: newdata}); 
//     }
//     else {
//         compositelayer.setData({max: 0, data: []});
//     }
// }


/// Show checkboxes for heatmap layers ///
var expanded = false;
function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } 
    else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}



/*                                                                      *
 *                  SETTING UP GOOGLE SEARCHBOX                         *
 *                                                                      */

var searchBox = new google.maps.places.SearchBox(document.getElementById('searchAddress'));

/// Sets searchBox bounds to converted GMaps bounds, biases searchBox to current viewpoint  ///
mymap.on('moveend', function(event) {
    var leafletBounds = mymap.getBounds();
    var googleBounds = new google.maps.LatLngBounds(leafletBounds._southWest, leafletBounds._northEast);
    searchBox.setBounds(googleBounds);
});

/// Uses given searchbox address to add marker to map (by calling addMarker()), and updates scores ///
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
    }

    places.forEach(function(place) {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }

        var latlng = L.latLng(place.geometry.location.lat(), place.geometry.location.lng());
        var marker;
        addMarker(latlng, marker);
    });
});


/// Adds Dotted Rectangle to Map ///
var rect = L.rectangle([[42.415634, -71.129306], [42.405241, -71.111527]], { dashArray: "10", color: "#4d4d4d",  opacity: .8,  fillOpacity: 0});
mymap.addLayer(rect);


/// Clears all score/address values before refreshing page ///
window.onbeforeunload = function(e) {
    document.getElementById('address').value = "(No Active Markers)";
    document.getElementById('avgdisplay').value = "";

    // for (var name in AllScores) {
    //     document.getElementById(name).value = "";
    // }

}







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
