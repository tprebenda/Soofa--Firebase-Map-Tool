
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
var geocoder = new google.maps.Geocoder();
function geocodeLatLng(geocoder, leaflet_latlng) {
    var latlng = {lat: leaflet_latlng.lat, lng: leaflet_latlng.lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById('address').value = results[0].formatted_address;
            } 
            else {
                document.getElementById('address').value = 'No results found';
            }
        }
        else {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                document.getElementById('address').value = "Query limit reached, please click marker again."
            }
            else {
                document.getElementById('address').value = 'Error: ' + status;
            }
        }
    });
}

/*                                                                      *
 *                  SETTING UP LEAFLETS API                             *
 *                                                                      */



// var baselayer = L.tileLayer('Esri.NatGeoWorldMap');

///   Tile layer for leaflet   ///
var baselayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidHByZWJlbmRhIiwiYSI6ImNrYWZ2MDQ1djAwaGMyeHF0OTV4eDVzenAifQ.lxCM4eHlgBPXKqeDIr8pFw'
});

///  HEATMAP SETUP: ///
var cfg = {"radius": .007, "maxOpacity": .8, "scaleRadius": true, "useLocalExtrema": true, latField: 'lat', lngField: 'lng', valueField: 'count',  "blur": .8 };
var compositelayer = new HeatmapOverlay(cfg);


// (My house at Tufts University: (42.412660, -71.123060) 

/// Center Map around Cambridge ///
var mymap = new L.map('map', {
    center:  new L.latLng(42.3736, - 71.1097),
    zoom: 13,
    layers: [baselayer, compositelayer]
}); 

compositelayer.setData({max: 0, data:[]});


/// Add Markers to Map on click ///
mymap.on('click', onMapClick);
var marker;
function onMapClick(e) { 
    addMarker(e.latlng, marker);
}

// To keep track of most recently selected marker (for potential deletion)
var currMarker;

/// Adds marker to map, updates scores, and adds marker-dragging functionality ///
function addMarker(latlng, marker) {
    marker = new L.marker(latlng, {draggable:'true'}).addTo(mymap);
    mymap.setView(latlng, mymap.getZoom());
    geocodeLatLng(geocoder, latlng);

    // Updates scores
    for (var name in AllScores) {
        document.getElementById(name).value = calculatescore(latlng.lat, latlng.lng, AllScores[name]);
    }


    // This prevents marker propogation (adding multiple markers by dragging too fast)
    marker.on('dragstart', function(e) {
        mymap.off('click', onMapClick);
    });

    marker.on('dragend', function(e) {
        var position = e.target.getLatLng();
        marker.setLatLng(position, {draggable:'true'});
        geocodeLatLng(geocoder, position);
        mymap.setView(new L.latLng(position.lat, position.lng), mymap.getZoom());

        // Updates scores
        for (var name in AllScores) {
            document.getElementById(name).value = calculatescore(position.lat, position.lng, AllScores[name]);
        }

        // Resets onMapClick (after 10 milliseconds)
        setTimeout(function() {
            mymap.on('click', onMapClick);}, 
            10);
    });

    mymap.addLayer(marker);
    markercontainer.push(marker);
    currMarker = marker;
    marker.on('click', markerOnClick);
}


/// Update scores on click ///
function markerOnClick(e) {
    var latlng = e.latlng;
    for (var name in AllScores) {
        document.getElementById(name).value = calculatescore(latlng.lat,latlng.lng, AllScores[name]); 
    }
    geocodeLatLng(geocoder, latlng);
    mymap.setView(latlng, mymap.getZoom());
    currMarker = e.target;
}


// Remove current marker, re-orient to previous marker and update scores
var removeButton = document.getElementById("removeMarker");
removeButton.onclick = function() {
    var idx = markercontainer.indexOf(currMarker);
    if (idx > -1) {
        markercontainer.splice(idx, 1);
        mymap.removeLayer(currMarker);

        // Re-orient to previous marker, if any
        if (markercontainer.length > 0) {
            currMarker = markercontainer[markercontainer.length - 1];

            var latlng = currMarker.getLatLng();
            for (var name in AllScores) {
                document.getElementById(name).value = calculatescore(latlng.lat,latlng.lng, AllScores[name]); 
            }
            geocodeLatLng(geocoder, latlng);
            mymap.setView(latlng, mymap.getZoom());
        }
        else {
            // No markers left, so clear scores
            document.getElementById('address').value = "(No Active Markers)"
            document.getElementById('average').value = "";
            currMarker = undefined;

            for (var name in AllScores) {
                document.getElementById(name).value = "";
            }
         
            // Trying to return to center of map... doesn't work :/
            // mymap.setView(mymap.getCenter(), mymap.getZoom());
        }
    }
    else {
        console.log("Marker not found, could not remove.");
    }
};
 


/// Function for adding multiple heatmaps together ///
function layertrigger(keyword) {
    index = layersactive.indexOf(keyword);
    if (index > -1){
      layersactive.splice(index, 1);
    } else{
      layersactive.push(keyword);
    }
    if (layersactive.length > 0){
      var newdata = clone(AllScores[layersactive[0]].data);
      for (var j = 1; j < layersactive.length; j++){
        var adder = clone(AllScores[layersactive[j]].data);
        for (var i = 0; i < newdata.length; i++){
          newdata[i].count = newdata[i].count + adder[i].count;
        }
      }

      compositelayer.setData({max:1000, data: newdata}); 
    }

    else{
      compositelayer.setData({max: 0, data: []});
    }
}


/// Function to clone a javascript object ///
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    var copy;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
    }
    // Handle Array
    else if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
    }
    // Handle Object
    else if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
    }
    else {
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    return copy;
}



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
mymap.on('moveend', function(e) {
    var leafletBounds = mymap.getBounds();
    var googleBounds = new google.maps.LatLngBounds(leafletBounds._southWest, leafletBounds._northEast);
    searchBox.setBounds(googleBounds);
});

/// Uses given searchbox address to add marker to map and updates scores ///
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
    }

    places.forEach(function(place) {
        var geo = place.geometry;
        if (!geo) {
            console.log("Returned place contains no geometry");
            return;
        }

        var latlng = L.latLng(geo.location.lat(), geo.location.lng());
        var marker;
        addMarker(latlng, marker);
    });
    // Clear search address
    document.getElementById("searchAddress").value = "";
});


// Rectangle for Tufts University: var rect = L.rectangle([[42.415634, -71.129306], [42.405241, -71.111527]], { dashArray: "10", color: "#4d4d4d",  opacity: .8,  fillOpacity: 0});

/// Adds Dotted Rectangle to Map ///
var rect = L.rectangle([northeastcoord, southwestcoord], { dashArray: "10", color: "#4d4d4d",  opacity: .8,  fillOpacity: 0});
mymap.addLayer(rect);


/// Clears all score/address values before refreshing page ///
window.onbeforeunload = function(e) {
    document.getElementById('address').value = "(No Active Markers)";
    document.getElementById('average').value = "";
    document.getElementById("heatmapselector").reset()

    for (var name in AllScores) {
        document.getElementById(name).value = "";
    }

}



/// Changes city, resets scores and data values
document.getElementById('selectCity').onchange = function() {
    var myScript = document.createElement('script');
    var file = (this.value.split(",")[0] != 'Cambridge') ? this.value.split(",")[0] : 'Default';

    // To run on local server, change 'challenge/data/' back to '/data/'
    myScript.setAttribute('src', 'challenge/data/' + file + 'Heatdata.js');
    document.head.appendChild(myScript);

    myScript.onload = function() {
        compositelayer.setData({max:0, data: []});
        document.getElementById("heatmapselector").reset();
        mymap.setView(new L.LatLng(lat, lng), myZoom); 
        for (var i = 0; i < markercontainer.length; i++) {
            mymap.removeLayer(markercontainer[i]);
        }
        markercontainer = [];
        layersactive = [];
        mymap.removeLayer(rect);
        rect = L.rectangle([northeastcoord, southwestcoord], { dashArray: "10", color: "#4d4d4d",  opacity: .8,  fillOpacity: 0});
        mymap.addLayer(rect);

        for (var name in AllScores) {
            document.getElementById(name).value = "";
        }
        document.getElementById('address').value = "";
        document.getElementById('address').value = "(No Active Markers)";
        // showCheckboxes();
    };
}
