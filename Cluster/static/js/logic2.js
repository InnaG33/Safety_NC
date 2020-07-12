// Creating map object
var myMap = L.map("map", {
    center: [35.9132, -79.0558],
    zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var geoData = "static/data/pedestrian-crashes-chapel-hill-region.geojson"


// getting data
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