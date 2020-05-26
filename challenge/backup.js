/// Adds marker to map, updates scores, and adds marker-dragging functionality ///
function addMarker(latlng, marker) {
    marker = new L.marker(latlng, {draggable:'true'}).addTo(mymap);
    mymap.setView(latlng, mymap.getZoom());
    geocodeLatLng(geocoder, latlng);

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
    selectMarker(e.target);
    // var latlng = e.latlng;
    // for (var name in AllScores) {
    //     document.getElementById(name).value = calculatescore(latlng.lat,latlng.lng, AllScores[name]); 
    // }
    // geocodeLatLng(geocoder, latlng);
    // mymap.setView(latlng, mymap.getZoom());
    // currMarker = e.target;
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
            marker = markercontainer[markercontainer.length - 1];
            var latlng = marker.getLatLng();
            for (var name in AllScores) {
                document.getElementById(name).value = calculatescore(latlng.lat,latlng.lng, AllScores[name]); 
            }
            geocodeLatLng(geocoder, latlng);
            mymap.setView(latlng, mymap.getZoom());
            currMarker = marker;
        }
        else {
            document.getElementById('address').value = "(No Active Markers)"
        }
    }
    else {
        console.log("Marker not found, could not remove.");
    }
};












//// Google Reverse Geocodeing Setup (for address display) ////
var geocoder = new google.maps.Geocoder();
function geocodeLatLng(geocoder, marker) {
    var mlatlng = marker.getLatLng();
    var latlng = {lat: mlatlng.lat, lng: mlatlng.lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById('address').value = results[0].formatted_address;
                console.log("changing address from:", address_dict[marker]);
                address_dict[marker] = results[0].formatted_address;
                console.log("after change:", address_dict[marker]);
            } 
            else {
                document.getElementById('address').value = 'No results found';
                address_dict[marker] = 'No results found';
            }
        }
        else {
            document.getElementById('address').value = 'Error: ' + status;
            address_dict[marker] = 'Error: ' + status;
        }
    });
}