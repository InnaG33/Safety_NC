// Load in GeoJson data
var geoData = "static/data/NCDOT_BikePedCrash.geojson"
var geoData1 = "static/data/pedestrian-crashes-chapel-hill-region.geojson"


// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var pedestrian = new L.LayerGroup();
var bikecrash = new L.LayerGroup();

// Adding tile layer

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
})

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v10",
    accessToken: API_KEY
});

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "darkmap": darkmap,
    "Satellite": satelliteMap,
    "Outdoors": outdoorsMap
};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Pedestrians crashes": pedestrian,
    "Bike crashes": bikecrash
};

// Creating map object
var myMap = L.map("map", {
    center: [35.9132, -79.0558],
    zoom: 11,
    layers: [satelliteMap, pedestrian]
});

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    //collapsed: false
}).addTo(myMap);

// getting data
d3.json(geoData, function(data) {

    //console.log(data);

    var heatArray = [];
    //console.log(data.features.length)
    for (var i = 0; i < data.features.length; i++) {
        //console.log(data.features[i])
        var location = data.features[i].geometry;

        //console.log(geometry)
        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0], 0.5]);
        }
    }
    console.log(heatArray);

    L.heatLayer(heatArray, {
        radius: 20
    }).addTo(myMap);
});

// getting data
d3.json(geoData1, function(data) {

    console.log(data);

    var heatArray = [];
    console.log(data.features.length)
    for (var i = 0; i < data.features.length; i++) {
        //console.log(data.features[i])
        var location = data.features[i].geometry;

        //console.log(geometry)
        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0], 0.5]);
        }
    }
    console.log(heatArray);

    L.heatLayer(heatArray, {
        radius: 20
    }).addTo(myMap);
});


// // snakeline animation plugin


var trd = [35.2271, -80.8431],
    mad = [36.0726, -79.7920],
    lnd = [35.9940, -78.8986],
    ams = [35.7796, -78.6382],
    vlc = [36.0646, -75.7057];



var route = L.featureGroup([
    L.marker(trd),
    L.polyline([trd, ams], { snakingSpeed: 200 }),
    L.marker(ams),
    L.polyline([ams, mad], { snakingSpeed: 200 }),
    L.marker(lnd),
    L.polyline([mad, lnd], { snakingSpeed: 200 }),
    L.marker(mad),
    L.polyline([mad, lnd], { snakingSpeed: 200 }),
    L.marker(vlc)
], { snakingPause: 1000 });

var latlngs = []

for (var i = 0, latlngs = [], len = route.length; i < len; i++) {
    latlngs.push(new L.LatLng(route[i][0], route[i][1]));
}

latlngs.push(trd[0], trd[1])
latlngs.push(mad[0], mad[1])
latlngs.push(lnd[0], lnd[1])
latlngs.push(ams[0], ams[1])
latlngs.push(vlc[0], vlc[1])

console.log(latlngs)

//var line = L.polyline(latlngs, { snakingSpeed: 200 });
//line.addTo(myMap).snakeIn();



myMap.fitBounds(route.getBounds());

//myMap.addLayer(new L.Marker(latlngs[0]));
//myMap.addLayer(new L.Marker(latlngs[len - 1]));

myMap.addLayer(route);

function snake() {
    route.snakeIn();
}

route.on('snakestart snake snakeend', function(ev) {
    console.log(ev.type);
});


// Grabbing data with d3...

d3.json(geoData, function(data) {

    console.log(data);

    var heatArray = [];
    console.log(data.features.length)
    for (var i = 0; i < data.features.length; i++) {
        //console.log(data.features[i])
        var location = data.features[i].geometry;

        //console.log(geometry)
        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0], 0.5]);
        }
    }
    console.log(heatArray);

    L.heatLayer(heatArray, {
        radius: 20
            //blur: 35
    }).addTo(myMap);
});

//marker.bindPopup("<h1>" + feature.properties.county + "</h1><hr> <h2>" + feature.properties.crashyear + "</h2").openPopup();

// control box plugin
L.Control.boxzoom({ position: 'topleft' }).addTo(myMap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        //.setContent(e.county)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(myMap);
}
myMap.on('click', onMapClick);
