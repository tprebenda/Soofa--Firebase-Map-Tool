
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
var geocoder = new google.maps.Geocoder;

function geocodeLatLng(geocoder, lat, lng) {
    var latlng = {lat: lat, lng: lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                document.getElementById('address').value = results[0].formatted_address;
            } 
            else {
                document.getElementById('address').value = 'No results found';
            }
        }
        else {
            document.getElementById('address').value = 'Geocoder failed due to: ' + status;
        }
  });
}


/*                                                                      *
 *                  SETTING UP LEAFLETS API                             *
 *                                                                      */

// Map is set around my house at Tufts University :)
var mymap = L.map('map').setView([42.412660,-71.123060], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidHByZWJlbmRhIiwiYSI6ImNrYWZ2MDQ1djAwaGMyeHF0OTV4eDVzenAifQ.lxCM4eHlgBPXKqeDIr8pFw'
}).addTo(mymap);

// var baseMaps = { "Map View": baseLayer };

mymap.on('click', onMapClick);

/// Add Markers to Map on click, plus change scores when marker is dragged  ///
var marker;
function onMapClick(e) {
    marker = L.marker(e.latlng, {draggable:'true'}).addTo(mymap);
    marker.on('click', markerOnClick);
    markercontainer.push(marker);
  
    for (var name in AllScores) {
      document.getElementById(name).value = calculatescore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]);
    }
  
    var currlocation = geocodeLatLng(geocoder, marker.getLatLng().lat, marker.getLatLng().lng);
  
    mymap.panTo(marker.getLatLng());
  
    marker.on('dragend', function(event) {
        var marker = event.target;
        var position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
        currlocation = geocodeLatLng(geocoder, marker.getLatLng().lat, marker.getLatLng().lng);
        marker.addTo(mymap)
  
        for (var name in AllScores) {
            document.getElementById(name).value = escore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]);
        }    
        
        var currlocation = geocodeLatLng(geocoder, marker.getLatLng().lat, marker.getLatLng().lng);
  
        mymap.panTo(new L.LatLng(position.lat, position.lng))
  
    });
  
    mymap.addLayer(marker);
}


/// Update scores on click ///
function markerOnClick(e) {
    for (var name in AllScores) {
        document.getElementById(name).value = calculatescore(e.latlng.lat,e.latlng.lng, AllScores[name]); 
    }
    var currlocation = geocodeLatLng(geocoder, e.latlng.lat, e.latlng.lng);
    mymap.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng));
}


/********   HEATMAP SETUP:   **********/
var cfg1 = {"radius": .007, "maxOpacity": .8, "scaleRadius": true, "useLocalExtrema": true, latField: 'lat', lngField: 'lng', valueField: 'count',  "blur": .8 };
var compositelayer = new HeatmapOverlay(cfg1);  
/// Set Data ///
compositelayer.setData({max: 0, data:[]});
/// Create Map Layers ///
var compositegroup = L.layerGroup([compositelayer]);    
/// Add Layers to Map ///
mymap.addLayer(compositegroup);    



/// Function for adding multiple heatmaps together ///
function layertrigger(keyword){
    index = layersactive.indexOf(keyword);
    if (index > -1){
        layersactive.splice(index, 1);
    } 
    else{
        layersactive.push(keyword);
    }
    if (layersactive.length > 0) {
        var newdata = clone(AllScores[layersactive[0]].data);
        for (var j = 1; j < layersactive.length; j++) {
            var adder = clone(AllScores[layersactive[j]].data);
            for (var i = 0; i < newdata.length; i++) {
            newdata[i].count = newdata[i].count + adder[i].count;
            }
        }

        compositelayer.setData({max:1000, data: newdata}); 
    }
    else {
        compositelayer.setData({max: 0, data: []});
    }
}



// Show checkboxes for heatmap layers   **DISPLAY**
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


// Google Searchbox:
var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
google.maps.event.addListener(searchBox, 'places_changed', function() {
    for (var i = 0; i < searchBox.getPlaces().length; i++) {
        marker = L.marker([searchBox.getPlaces()[i].geometry.location.lat(), searchBox.getPlaces()[i].geometry.location.lng()], {draggable:'true'});
        marker.on('click', markerOnClick);
        markercontainer.push(marker);
    
        for (var name in AllScores){
            document.getElementById(name).value = calculatescore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]); 
        }

        var currlocation = geocodeLatLng(geocoder, marker.getLatLng().lat, marker.getLatLng().lng);

        marker.addTo(mymap)
        mymap.panTo(marker.getLatLng());

        marker.on('dragend', function(event) {
            var marker = event.target;
            var position = marker.getLatLng();
            marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});

            for (var name in AllScores){
                document.getElementById(name).value = calculatescore(marker.getLatLng().lat,marker.getLatLng().lng, AllScores[name]);
            }    

            document.getElementById('address').value = searchBox.getPlaces()[0].address;
            mymap.panTo(new L.LatLng(position.lat, position.lng))

        });
        mymap.addLayer(marker);
    }

});


// Rectangle:
var rect = L.rectangle([[42.418277, -71.109133], [42.410443, -71.141051]], { dashArray: "10", color: "#4d4d4d",  opacity: .8,  fillOpacity: 0});
mymap.addLayer(rect);





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

