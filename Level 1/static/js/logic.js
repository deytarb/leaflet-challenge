var Jsongeo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

console.log("logic.js");


var initialLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY

});

//Define map object
var myMap = L.map("mapid", {
  center: [41.505, -0.09],
  zoom: 3
});

initialLayer.addTo(myMap);

//Radius of earthquake marker 
function quakeRadius(magnitude) 
{

  if (magnitude == 0) 
    {
      return 1
    };

  return magnitude * 4;

};

// Determine the color of the earthquake based on its magnitude
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

//Circle marker for each earthquake
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
        //Add legend details
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


// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
