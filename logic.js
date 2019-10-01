
function markerSize(intensity) {
    return intensity * 5;
};
var locationEarthquakes = new L.LayerGroup();
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data1) {
    L.geoJSON(data1.features, {
        pointToLayer: function (data1features1, point) {
            return L.circleMarker(point, { radius: markerSize(data1features1.properties.mag) });
        },
        style: function (data1features2) {
            return {
              
                fillColor: chooseColor(data1features2.properties.mag),
                fillOpacity: data1features2.properties.mag*2/10,
                weight: 0.1,
                color: 'black'
            }
        },
        onEachFeature: function (data1features3, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(data1features3.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + data1features3.properties.title + "</h5>");
        }
    }).addTo(locationEarthquakes);
    createMap(locationEarthquakes);
});
var plateBoundaries = new L.LayerGroup();
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (data2) {
    L.geoJSON(data2.features, {
        style: function (data2features1) {
            return {
                weight: 2,
                color: 'yellow'
            }
        },
    }).addTo(plateBoundaries);
})

function chooseColor(intensity) {
    if (intensity > 5) {
        return 'red'
    } else if (intensity > 4) {
        return 'darkorange'
    } else if (intensity > 3) {
        return 'tan'
    } else if (intensity > 2) {
        return 'yellow'
    } else if (intensity > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

function createMap() {
    var GrayMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });
    var ColorMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });
    var DarkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });
    var SatelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
    });
    var baseLayers = {
        "High Contrast": GrayMap,
        "Street": ColorMap,
        "Dark": DarkMap,
        "Satellite": SatelliteMap
    };
    var overlays = {
        "Location Earthquakes": locationEarthquakes,
        "Plate Boundaries": plateBoundaries,
    };
    var map = L.map('map', {
        center: [40, -99],
        zoom: 4.3,
        layers: [GrayMap, locationEarthquakes, plateBoundaries]
    });

    L.control.layers(baseLayers, overlays,  {
        collapsed: false
      }
    ).addTo(map);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5];
        div.innerHTML += "<h4 style='margin:4px'>Intensity</h4>"
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<p><i style="background:' + chooseColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '</p>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}

