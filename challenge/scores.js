/***********    SCORING SECTION     ************/

/// Code for showing all scores ///
var button = document.getElementById('showscores');
var shown = false;
button.onclick = function() { 
    var scoreset = document.getElementById('allscores');

    if (shown){
        scoreset.style.visibility = 'hidden';  
        button.textContent = 'Show All Scores:';
        shown = !shown; 
    }
    else{
        scoreset.style.visibility='visible';
        button.textContent = '(Hide Scores)'; 
        shown = !shown;
    }
}


/// Return scores between 0 and 10 ///
function calculatescore(lat, lng, heatmapdata){
    score = closestscore(lat, lng, heatmapdata.data);
    return Math.round(1000*score/heatmapdata.max)/100; // Returns two decimal places
}


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

    return arr[bestindex].count;
}
