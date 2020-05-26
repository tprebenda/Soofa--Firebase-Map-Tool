<!DOCTYPE html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="UTF-8">
        <title>Soofa Firebase Tool</title>
        <link href="firebase.css" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Arima Madurai' rel='stylesheet'>
        <!-- Google Maps API -->
        <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBR55aptcBIiYUnfqlSQKvg8WjPg2dScqA&libraries=visualization"></script> -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBR55aptcBIiYUnfqlSQKvg8WjPg2dScqA&libraries=places"></script>
        <!-- Other Google Apis -->
        <script src="https://maps.googleapis.com/maps-api-v3/api/js/40/12/common.js"></script>
        <script src="https://maps.googleapis.com/maps-api-v3/api/js/40/12/util.js"></script>
        <script src="https://maps.googleapis.com/maps-api-v3/api/js/40/12/geocoder.js"></script>
        <script src="https://maps.googleapis.com/maps-api-v3/api/js/40/12/controls.js"></script>
        <script src="https://maps.googleapis.com/maps-api-v3/api/js/40/12/places_impl.js"></script>
        <!-- Leaflet API -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
            integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
            crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
            crossorigin=""></script>
    </head>
    <h1>Soofa Firebase Map</h1>
    <body>
        <div id="map"></div>
            
        <div>
            <input id="searchAddress" type="text" placeholder="Enter Location for Marker" class="pac-target-input" autocomplete="off"> 
        </div>
        <div class = "mapInfo">
            <p class="instructions"><b>Click on the map to create a draggable marker.</b></p>
            <p>Display heatmaps on the map by picking from 'Pick Heatmap Layers!' Change cities by selecting from 'Pick a City.'</p> 
            <p class="instructions"><b>Need help?</b></p> 
            <p>If the heatmaps are not displaying, try changing your browser's security settings. </p>
        </div>
        <form id = "heatmapselector">
            <div class="multiselect">
                <div class="selectBox" onclick="showCheckboxes()">
                    <select>
                        <option>Pick Heatmap Layers!</option>
                    </select>
                <div class="overSelect"></div>
                </div>
                <div id="checkboxes">
                    <label style="padding-top: 20px">
                    <input onclick="layertrigger('googlefood');" type="checkbox">Google Food Data</label>
                    <label>
                    <input onclick="layertrigger('googlecommunity');" type="checkbox">Google Community Data</label>
                    <label>
                    <input onclick="layertrigger('googlebigshops');" type="checkbox">Google BigShops Data</label>
                    <label>
                    <input onclick="layertrigger('googlesmallshops');" type="checkbox">Google SmallShops Data</label>
                    <label>
                    <input onclick="layertrigger('googletransit');" type="checkbox">Google Transit Data</label>
                    <label> 
                    <input onclick="layertrigger('googletourist');" type="checkbox">Google Tourist Data</label>
                    <label>
                    <input onclick="layertrigger('yelpfood');" type="checkbox">Yelp Food Data</label>
                    <label>
                    <input onclick="layertrigger('yelpshopping');" type="checkbox">Yelp Shopping Data</label>
                    <label>
                    <input onclick="layertrigger('yelpcommunity');" type="checkbox">Yelp Community Data</label>
                    <label>
                    <input onclick="layertrigger('walkscore');" type="checkbox">Walk Score Data</label>
                    <label>
                    <input onclick="for (key in AllScores){ if (key != 'average'){layertrigger(key)}};" type="checkbox">Show All Layers</label>
                </div>
            </div>
        </form>

        <form id="cityselection">
            <select id="selectCity">
                <option value="default">Pick a City!</option>
                <option value="Cambridge">Cambridge MA</option>
                <option value="Providence">Providence RI</option>
                <option value="Trenton">Trenton NJ</option>
                <option value="Cuero">Cuero TX</option>
                <option value="Portage">Portage MI</option>
                <option value="Lafayette">Lafayette LA</option>
                <option value="ArlingtonHeights">Arlington Heights IL</option>
            </select>
        </form>
        <form>
            <label id="avgbutton" for="average">Average Score:</label>
            <input id="avgdisplay" type="text" readonly="">
        </form>
        <button id="showscores">Show All Scores:</button>
        <form id="allscores">
            <p>
                <label for="googlefood" >Google Food Score:</label>
                <input id="googlefood" type="text" readonly="">
            </p>
            <p>
                <label for="googlecommunity">Google Community Score:</label>
                <input id="googlecommunity" type="text" readonly="">
            </p>
            <p>
                <label for="googlebigshops">Google Big Shops Score:</label>
                <input id="googlebigshops" type="text" readonly="">
            </p>
            <p>
                <label for="googlesmallshops">Google Small Shops Score:</label>
                <input id="googlesmallshops" type="text" readonly="">
            </p>
            <p>
                <label for="googletransit">Google Transit Score:</label>
                <input id="googletransit" type="text" readonly="">
            </p>
            <p>
                <label for="googletransit">Google Tourist Score:</label>
                <input id="googletourist" type="text" readonly="">
            </p>
            <p>
                <label for="yelpfood">Yelp Food Score:</label>
                <input id="yelpfood" type="text" readonly="">
            </p>
            <p>
                <label for="yelpshopping">Yelp Shopping Score:</label>
                <input id="yelpshopping" type="text" readonly="">
            </p>
            <p>
                <label for="yelpcommunity">Yelp Community Score:</label>
                <input id="yelpcommunity" type="text" readonly="">
            </p>
            <p>
                <label for="walkscore">Walking Score:</label>
                <input id="walkscore" type="text" readonly="">
            </p>
            <!-- <p>
                <label for="address">Location of Marker:</label>
                <input id="address" type="text" readonly="">    
            </p> -->
        </form>
        <form id="markerAddress">
            <label for="address"><b>Location of Last Marker:</b></label>
            <input id="address" type="text" value="(No active markers)" readonly="">   
        </form>

        <!-- Change if file is not in immediate directory -->
        <script src="scores.js"></script>
        <script src="maps.js"></script>
        <script src="heatmap.js"></script>
        <script src="leaflet-heatmap.js"></script>
    </body>
</html>