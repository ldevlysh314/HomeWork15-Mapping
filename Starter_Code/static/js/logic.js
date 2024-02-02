//URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


// Leaflet tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Leaflet map object.
var myMap = L.map("map", {
    center: [38.6270, -90.1994],
    zoom: 3,
    layers: [streetmap]
});


//basemap as the streetmap
let baseMaps = {
    "streets": streetmap
};

//earthquake layerGroup and tectonic plates layerGroup
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};


L.control.layers(baseMaps, overlays).addTo(myMap);

//stying the earthquake points on the map
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])
    }
};

//function for the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "yellow";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "red";
    else if (depth > 40 & depth <= 55) return "purple";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "green";
};

//function for radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*5;
};


//earthquake JSON data with d3
d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) { 
            return L.circleMarker(latlon).bindPopup(feature.id);
        },
        style: styleInfo
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);

    //tectonic data with d3.json
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) {
        L.geoJson(data, {
            color: "blue", 
            weight: 1
        }).addTo(tectonics); 
        tectonics.addTo(myMap);
    });


});
//legend (credit to various examples on stackoverflow.com)
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
    //color-coded legends for different depth ranges
       div.innerHTML += '<span style="background: yellow"><span>(Depth < 10)</span><br>';
       div.innerHTML += '<span style="background: orange"><span>(10 < Depth <= 25)</span><br>';
       div.innerHTML += '<span style="background: red"><span>(25 < Depth <= 40)</span><br>';
       div.innerHTML += '<span style="background: purple"><span>(40 < Depth <= 55)</span><br>';
       div.innerHTML += '<span style="background: blue"><span>(55 < Depth <= 70)</span><br>';
       div.innerHTML += '<span style="background: green"><span>(Depth > 70)</span><br>';
  
    return div;
  };
 
  legend.addTo(myMap);
