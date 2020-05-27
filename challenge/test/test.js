
// Test Variables
var places = [new L.latLng(42.4126412, -71.1231043),    // (My house:) 298 Boston Ave, Medford, MA 02155
              new L.latLng(42.40617, -71.11888239),     // (Tufts Library:) 35 Professors Row, Medford, MA 02155
              new L.latLng(42.3950421, -71.1215022),    // (Kung Fu Tea, Davis Square:) 237 Elm St, Somerville, MA 02144
              new L.latLng(42.3693119, -71.078724)];    // (Soofa Office:) 24 Thorndike Street, Cambridge, MA 02141


/// TEST MARKER PLACEMENT-- (Check map) ///
function testAddMarker() {
    for (var i = 0; i < 3; i++) {
        addMarker(places[i], marker);
    }
    // Should see 3 markers- (my house, Tufts Library, Kung Fu Tea)
}

testAddMarker();



// TEST MARKER REMOVAL-- (Check Map/Marker Address Bar) ///
function testRemoveMarker() {
    var id = setInterval(clickRemove, 3500);
    /* SHOULD DISPLAY:
        - 2 markers remaining; '35 Professors Row, Medford, MA 02155' in marker address bar
        - 1 marker remaining; 298 Boston Ave, Medford, MA 02155' in marker address bar
        - No markers remaining; '(No Active Markers)' in marker address bar, and NO SCORES
    */

    // clearInterval(id);           
    // ^^^ This stops function from running in the first place, but without it, function will run forever... cool.
}

function clickRemove() {
    console.log("removed button");
    removeButton.click();
}

testRemoveMarker();



/// TEST GEOCODER-- (Look at address bar/console logs) ///
function testGeocoder() {
    console.log("testing address: 298 Boston Ave, Medford, MA 02155");
    console.log("Function returned:", geocodeLatLng(geocoder, myHouse));

    console.log("testing address: 5 Professors Row, Medford, MA 02155");
    console.log("Function returned:", geocodeLatLng(geocoder, tuftsLibrary));

    console.log("testing address: 24 Thorndike Street, Cambridge, MA 02141");
    console.log("Function returned:", geocodeLatLng(geocoder, soofaOffice));
}

testGeocoder();






// Testing function to run other functions with given test dataset
// **** DOESN'T WORK, NOT SURE WHY **** //

// function func_runner(testData, f) {
//     for (var key in testData) {
//         console.log(key);
//         ret = f(testData[key]);
//         if (ret) {
//             console.log(ret);
//         }
//     }
// }