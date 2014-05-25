

$(document).ready(function(){

  var map = L.map('map').setView([55.609842, 13.002763], 13);

  var searchLatLng;
  var searchRadius = 1.5;

  // add an OpenStreetMap tile layer
  var colorTile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
  var bwTile = L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');
  var stamenTile = L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png')

  var bwTile2 = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'examples.map-20v6611k'
  }).addTo(map);

  var stationsLayer =  L.layerGroup().addTo(map);
  var routesLayer = L.layerGroup().addTo(map);
  var miscLayer =  L.layerGroup().addTo(map);

  var baseMaps = {
    "Color": colorTile,
    "BW": bwTile,
    "BW2": bwTile2,
    "Stamen": stamenTile
  };

  var overlayMaps = {
    "Stations": stationsLayer,
    "Routes": routesLayer,
    "Misc": miscLayer
  };


  L.control.layers(baseMaps, overlayMaps).addTo(map);



  map.on('click', function(e){
    searchLatLng = e.latlng;
    updateMap();
  });



  $( "#slider" ).slider({
    min: 0.0,
    max: 20,
    value: 1.5,
    step: 0.1,
    slide: function(event, ui){
      searchRadius = ui.value;
      updateMap();
    }
  });




  var updateMap = function() {
    //Clear the layer groups
    stationsLayer.clearLayers();
    routesLayer.clearLayers();
    miscLayer.clearLayers();


    //Show the search radius
    L.circle(searchLatLng, searchRadius*1609, {color:'red',  opacity:'0.0', fillOpacity:'0.2'}).addTo(miscLayer);


    //
    //Get nearby stations example
    //

    /*
    $.getJSON('api/StopsNearby/' + searchLatLng.lat + '/' + searchLatLng.lng + '/' + searchRadius, function (data) {
      data.forEach(function (el) {
        stationsLayer.addLayer(L.circleMarker([el.stop_lat, el.stop_lon], {color:'blue', radius:5}).bindPopup(el.stop_name));
      });
    });
    */


    //
    //Get nearby routes example
    //
    $.getJSON('api/routesNearby/' + searchLatLng.lat + '/' + searchLatLng.lng + '/' + searchRadius, function (data) {
      data.forEach(function(route){

        $.getJSON('api/stops/'+route.agency_key+'/' + route.route_id, function (stops) {
          var color = 'rgb(0,0,255)';
          var dash;

          //Train
          if(route.route_type == 2)
            color = 'rgb(220,0,0)';
          //Bus
          if(route.route_type == 3) {
            color = 'rgb(220,100,0)';
            dash = "5, 10";
          }
          //Ferry
          if(route.route_type == 4)
            color = 'rgb(100,100,255)';

          var latlngs = [];
          for(var u=0;u<stops.length;u++){
            latlngs.push([stops[u].stop_lat, stops[u].stop_lon]);
            L.circleMarker([stops[u].stop_lat, stops[u].stop_lon], {color:'blue', radius:5, opacity:0, fillOpacity:0.4})
              .bindLabel(stops[u].stop_name)
              .addTo(stationsLayer);
          }
          L.polyline(latlngs, {color: color, weight: 2, opacity:0.8, 'stroke-linecap':'round', 'stroke-linejoin':'round', dashArray: dash})
            .bindLabel(route.route_short_name + " "+ route.route_long_name)
            .addTo(routesLayer);
        });
      });
    });
  };
});