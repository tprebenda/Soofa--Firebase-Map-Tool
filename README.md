# Soofa--Firebase-Map-Tool
My own implementation of the Soofa Firebase Map Tool.


--- CHANGES MADE FROM ORIGINAL TOOL ---

 **UI changes:**
1) General repositioning of application elements-
 
 -- Heatmaps only show data in a limited space, so I made the leaflet map smaller to encompass just past these large data points at the extremeties. This created more space below the map, which allowed me to better place elements that engage the map. On that note...
 
-- The heatmap checkbox selector has been relocated beneath the map, for a more natural transition between activating heatlayers and studying the map. The same goes for the city locator. **NOTE:** The city change selection is present, but the corresponding function has not been implemented-- I was struggling to get access to the heatmap data of other locations. I attempted to write my own Python script for translating the data from jsons (parser.py, in the challenge/data folder), but I would have needed more time to get access to all the API's and then work through the data from each.

-- Introduced new title (header) to the site: "Soofa Firebase Tool", which I placed in line with the map on the left side of the window. I took the signature Soofa red from your website :)

-- Google Searchbox aligned with map, just below header.

-- Moved Average Score button next to the map, and placed Show Scores button directly beneath and in-line with Average Score.

-- Changed font and button colors, adding a dynamic text display on clicking All Scores, as well as color shading on hover for both buttons (All Scores and Remove Marker). 

-- Centered all score displays and aligned all labels/scores with identical spacing. (I'm a huge fan of symmetry, and spent a lot of time making these perfect... probably too much time.)

-- Organized all scores in a Current Marker "space", adjacent to map for easy viewing and visual transition from checking scores to placing/updating markers.

-- Placed map tool instructions smoothly under the map, adjacent to associated city/heatmap selection lables.
