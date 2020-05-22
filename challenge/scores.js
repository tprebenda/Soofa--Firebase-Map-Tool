
/// Function to clone a javascript object ///
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) {
        return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}



/***********    SCORING SECTION     ************/

/// Get Scores of Closest Location ///
function closestscore (lat, lng, arr) {
    var bestdist = Math.pow(Math.abs(lat - arr[0].lat), 2) + Math.pow(Math.abs(lng - arr[0].lng), 2);
    var bestindex = 0;

    for (i = 1; i < arr.length; i++){
        // currlat = arr[i].lat;
        // currlng = arr[i].lng;
        currdist = Math.pow(Math.abs(lat - arr[i].lat), 2) + Math.pow(Math.abs(lng - arr[i].lng), 2);
        if (currdist < bestdist) {
            // bestlat = currlat;
            // bestlng = currlng;
            bestindex = i;
            bestdist = currdist;
        }
    }

    return arr[bestindex].count
}

/// Return scores between 0 and 10 ///

function calculatescore(lat, lng, heatmapdata){
    score = closestscore(lat, lng, heatmapdata.data);
    return Math.round(1000*score/heatmapdata.max)/100; // Returns two decimal places
}


/// Code for showing all scores ///
var button = document.getElementById('showscores');
var shown = false;
button.onclick = function() { 
  if (shown){
      document.getElementById('allscores').style.visibility='hidden';  
      shown = !shown; 
  }
  else{
      document.getElementById('allscores').style.visibility='visible';  
      shown = !shown;
  }
}