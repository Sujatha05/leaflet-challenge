// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a base map layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

    // Function to determine color based on earthquake depth category
    function getColor(category) {
      switch (category) {
      case "-10-10":
        return 'blue';
      case "10-30":
        return 'green';
      case "30-50":
        return 'purple';
      case "50-70":
        return 'yellow';
      case "70-90":
        return 'orange';
      case "90+":
        return 'red';
      default:
        return 'gray';
      }
      }

 

// Load USGS Earthquake GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Loop through the earthquake data and add markers to the map
    data.features.forEach(feature => {
      var coordinates = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]]; // Leaflet uses [lat, lng]
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2]; // Depth information is in the third element of the coordinates array
      var place = feature.properties.place; // Place information
      var category = getLegendCategory(depth) //Use getLegendCategory to get the category
     
      // Customize the marker based on magnitude and depth
      var marker = L.circleMarker(coordinates, {
        radius: feature.properties.mag,
        color: 'black',
        fillColor: getColor(category), // Use getColor to get the color
        fillOpacity: 1
      }).addTo(map);

     // Customize the marker tooltip
     var tooltipContent = `<b>Place:</b> ${place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`;
     marker.bindTooltip(tooltipContent, {
         direction: 'top', // Display tooltip above the marker
         permanent: false, // Tooltip is not permanent (only shows on mouseover)
         opacity: 0.7, // Adjust the tooltip opacity
         className: 'custom-tooltip', // Add a custom class for styling
         interactive: true, // Allow interaction with the tooltip
         delay: 300 // Add a slight delay (in milliseconds) before the tooltip appears
     });

      // You can customize the marker popup content based on your preferences
      var popupContent = `<b>Place:</b> ${place}<br><b><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`;
      marker.bindPopup(popupContent);
     
       
     
    });
    

    

   
    // Create a legend control
   var legend = L.control({ position: 'bottomright' });

   legend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'legend');
     //var categories = ["-10-10", "10-30", "30-50","50-70","70-90","90+"];
     
    var legendData = [
      { color: 'blue', label: '-10-10' },
      { color: 'green', label: '10-30' },
      { color: 'purple', label: '30-50' },
      { color: 'yellow', label: '50-70' },
      { color: 'orange', label: '70-90' },
      { color: 'red', label: '90+' }
    ];
     div.innerHTML += '<h4>Legend</h4>';

     // Loop through categories and create legend items
  for (var i = 0; i < legendData.length; i++) {
    var color = getColor(legendData[i].color);
  console.log(color); // Add this line for debugging
 /* div.innerHTML +=
  `<div class="legend-item" style="background-color:${color}; color:${color}">${categories[i]}</div>`;*/
  div.innerHTML += `<div class="legend-item">
                    <span class="legend-color" style="background-color:${legendData[i].color};"></span>
                    <span class="legend-label">${legendData[i].label}</span>
                  </div>`;
  }

  return div;
};

   // Add legend to the map
   legend.addTo(map);
   
 })
 .catch(error => console.error('Error loading USGS Earthquake GeoJSON data:', error));

// Function to determine legend category based on earthquake depth
function getLegendCategory(depth) {
  if (depth > -10 && depth <= 10) {
    return "-10-10";
  } else if (depth > 10 && depth <= 30) {
    return "10-30";
  }  else if (depth > 30 && depth <= 50) {
    return "30-50"; 
  } else if (depth > 50 && depth <= 70) {
    return "50-70";
  } else if (depth > 70 && depth <= 90) {
  return "70-90";
  } else {
    return "90+";
  }
}
  
    
