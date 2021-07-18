var Jsongeo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var JsonPlate = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

console.log("logic.js");

var initialLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 500,
  maxZoom: 13,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var myMap = L.map("mapid", {
  center: [41.505, -0.09],
  zoom: 3
});

initialLayer.addTo(myMap);

function quakeRadius(magnitude) 
{

  if (magnitude == 0) 
    {
      return 1
    };

  return magnitude * 4;

};

function chooseColor(magnitude) 
{

  switch (true) 
  {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "Darkorange";
    case magnitude > 3:
      return "yellow";
    case magnitude > 2:
      return "Lime";
    case magnitude > 5:
      return "LawnGreen";
    default:
      return "GreenYellow";
  }

};

function styleInfo(feature) 
{
  return {
    opacity: 1,
    fillOpacity: 0.75,
    fillColor: chooseColor(feature.properties.mag),
    color: "#000000",
    radius: quakeRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  }
};

var quakeLayer = new L.LayerGroup() ;
var plateLayer = new L.LayerGroup() ;


//Earthquake Data
d3.json(Jsongeo).then(function (data) 
{

  console.log(data);

  //Add geoJson layer
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br> + Location: " + feature.properties.place);
    }

  }).addTo(quakeLayer);

    quakeLayer.addTo(myMap) ;

  //Place legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() 
  {
       
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var colors =
          [
            "GreenYellow",
            "LawnGreen",
            "Lime",
            "yellow",
            "orange",
            "red"
          ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) 
        {
          div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        
        return div;

  };

  //Add legend to map
  legend.addTo(myMap);

});

d3.json(JsonPlate).then(function (data) 
  {
    console.log(data) ;

    L.geoJson(data,  {color: "#FFb114"}).addTo(plateLayer) ;
    
    plateLayer.addTo(myMap) ;

  });


var TerrainBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});

var topography = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

//Create basemaps for control
var baseMaps =
{
  Country: initialLayer,
  Terrain: TerrainBackground,
  Topography: topography,
  Street: street,
  Satellite: WorldImagery
};

//Create overlaymaps for control
var overlayMaps = 
    {
        "Tectonic Plates" : plateLayer,
        Earthquakes : quakeLayer
    } ;

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
