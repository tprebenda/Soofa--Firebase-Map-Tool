# Soofa--Firebase-Map-Tool
My implementation of the Soofa Firebase Map Tool.

**Usage:**

This web app allows the user to place a marker on the map (via click, or searchbox), and find the ideal locations for a Soofa Talk sign, based on the data provided by various city-data API's (Google Maps, Yelp, etc).  

You may also select any combination of heatmap layers to be displayed on the map, to help find the ideal placement with a given API's data in mind.

The 'Remove Marker' button allows you to remove most recently placed marker, and re-orient towards previous marker (if any exist).

**URL:** https://tprebenda.github.io/Soofa--Firebase-Map-Tool/

(URL of original tool:) https://soofaiap.firebaseapp.com/

(It is recommended that this tool be used in a Google Chrome browser, but it is fully functional in all browsers.)



                                          --- CHANGES MADE FROM ORIGINAL TOOL ---


 **UI changes:**

 
 -- Relevant heatmap is only present on a small part of the map, especially with a predefined radius, so I made the leaflet map smaller to encompass just past these large data points at the extremeties. This created more space below the map, which allowed me to better place elements that interact with it. On that note...
 
-- The heatmap checkbox selector has been relocated beneath the map, for a more natural transition between activating heatlayers and studying the map. The same goes for the city selector. 

*Note:* The city selector is... semi-functional. I was able to copy the Soofa heatmap data for most of the cities, but some of them must not have copied over correctly, specifically Providence, Trenton, and Arlington Heights.\. I attempted to write my own Python script for translating new data from jsons (parser.py, in the challenge/data folder), but it would have entailed considerable work, and I had already found your data (it just doesn't work, for whatever reason).  I assumed it would be alright to leave it in this state, considering it's an extremely easy fix with the data files on hand.

-- Introduced new title (header) to the site: "Soofa Firebase Tool", which I placed in line with the map on the left side of the window. I took the signature Soofa red from your website :)

-- Google Searchbox aligned with map, just below header.

-- Moved Average Score button next to the map, and placed Show Scores button directly beneath and in-line with Average Score.

-- Changed font and button colors, adding a dynamic text display on clicking All Scores, as well as color shading on hover for both buttons (All Scores and Remove Marker). Most colors are matched with either the Soofa red, or colors of the leaflet map (light blue, green).

-- Centered all score displays and aligned all labels/scores with identical spacing. (I'm a huge fan of symmetry, and spent a lot of time making these perfect... probably too much time.)

-- Organized all scores in a Current Marker "space", adjacent to map for easy viewing and visual transition from checking scores to placing/updating markers.

-- Placed map tool instructions smoothly under the map, adjacent to associated city/heatmap selection lables for easy visual transition and easy application of instructions.



**Javascript Changes:**

               1) mapping.js
 
-- *General:* I modified a number of variables and function arguments to rely more on local variables, and therefore optimize performance by reducing how far the engine has to dive into the scope chain to access these values. I also reduced the number of 'get' function calls when there were already local variables on hand.

-- Geocoder: Added display change to tell user when query limit has been reached (caused by placing/removing too many markers in a short amount of time... more on this later). I also removed the many local variables that were initialized to the return value of the geocoder function, since these values were never used and were therefore wasting memory.

-- Changed map tile layer to be more pleasant (at least in my opinion)

-- Created AddMarker() function to improve modularity, since both map.onClick and Google Searchbox functionality had almost identical code that could be moved into a single function.

-- Added marker drag timeout to solve the issue of 'fast dragging'- a leaflet bug that causes marker propogation when you drag a marker too quickly.

-- Added Remove Marker functionality- I was frustrated by having to refresh the page every time I wanted to place new markers, so I added a currMarker variable to keep track of the most recently selected marker, and a button to remove this marker. This function also resets the scores/address display to that of the previous marker. 

-- Simplified and optimized Google Searchbox functionality, by employing the more-modular AddMarker() function and also by eliminating unnecessary function calls to access variables/data. The input address is also cleared after being searched.

-- Also added Searchbox bias functionality, which causes Searchbox suggestions to be biased towards the current map pane for faster Searchbox use.

-- Added onbeforeunload function to clear all scores/addresses when the page reloads after a refresh.

                2) scores.js

-- In closestscore() function, removed unnecessary local variables to free up more memory.



                                                 --- Next Steps ---



There were still a number of things I would have liked to change to improve/add to the application, but I just didn't get to them. These include:

-- Adding a 'Total Marker Score' display, which stores the average score values of *all* markers currently on the map. I would also store an array that contains the markers of the top 3 (somewhat arbitrary value) scores, and I would add a button that allows you to remove all markers except for these top 3. 

-- Improving the remove marker function: I wanted to store the associated geocoder address of each marker on the map in a separate variable, so as to reduce the risk of reaching the Over Query GMaps Limit that comes from calling the geocoder too many times in a short period (by quickly adding/removing markers). I know there is a way to do this, but it is tricky and most suggestions involve modifying the (private) data members of markers, which isn't really good practice. If I had more time, I would research this more.

-- I also wanted to add a feature that would highlight the current marker selected (i.e. by making that marker a different color), which would make it easier to discern which marker is the 'Current Marker' when there are multiple on the map.

-- After removing the last marker from the map, I would have liked to recenter the map view it to its original position.

-- Obviously, I would fix the data from the other locations that were not copied properly. 

-- I wanted to add to the onbeforeload function the capacity to reset the heatmap checkboxes and the current city. (It's an annoying problem that doesn't go away with the seemingly very easy solution that I was trying.)

-- There are also a number of opportunities to make functions more modular, but they involve changing a lot of syntax and it would just take some time.

**Thank you so much for this opportunity! I have learned so much from this project alone, and I am very excited to learn more!**

**I hope you enjoy my new Firebase Map Tool!**
