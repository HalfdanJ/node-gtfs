var gtfs = require('./../../lib/gtfs');

module.exports = function routes(app){
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });


  //AgencyList
  app.get('/api/agencies', function(req, res){
    gtfs.agencies(function(e, data){
      res.send( data || {error: 'No agencies in database'});
    });
  });
   
  app.get('/api/agenciesNearby/:lat/:lon/:radiusInMiles', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon
      , radius = req.params.radiusInMiles;
    gtfs.getAgenciesByDistance(lat, lon, radius, function(e, data){
      res.send( data || {error: 'No agencies within radius of ' + radius + ' miles'});
    });
  });

  app.get('/api/agenciesNearby/:lat/:lon', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon;
    gtfs.getAgenciesByDistance(lat, lon, function(e, data){
      res.send( data || {error: 'No agencies within default radius'});
    });
  });

  //Routelist
  app.get('/api/routes/:agency', function(req, res){
    var agency_key = req.params.agency;
    gtfs.getRoutesByAgency(agency_key, function(e, data){
      res.send( data || {error: 'No routes for agency_key ' + agency_key});
    });
  });
  
  app.get('/api/routesNearby/:lat/:lon/:radiusInMiles', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon
      , radius = req.params.radiusInMiles;
    gtfs.getRoutesByDistance(lat, lon, radius, function(e, data){
      res.send( data || {error: 'No routes within radius of ' + radius + ' miles'});
    });
  });

  app.get('/api/routesNearby/:lat/:lon', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon;
    gtfs.getRoutesByDistance(lat, lon, function(e, data){
      res.send( data || {error: 'No routes within default radius'});
    });
  });

  app.get('/api/routesByStop/:stop_id', function(req, res){
    var stop_id = req.params.stop_id

    gtfs.getRoutesByStop(stop_id, function(e, data){
      res.send( data || {error: 'No routes with this stop_id'});
    });
  });
  
  
  //Stoplist
  app.get('/api/stops/:agency/:route_id/:direction_id', function(req, res){
    var agency_key = req.params.agency
      , route_id = req.params.route_id
      , direction_id = parseInt(req.params.direction_id,10);
    gtfs.getStopsByRoute(agency_key, route_id, direction_id, function(e, data){
      res.send( data || {error: 'No stops for agency/route/direction combination.'});
    });
  });
  app.get('/api/stops/:agency/:route_id', function(req, res){
    var agency_key = req.params.agency
      , route_id = req.params.route_id;
    gtfs.getStopsByRoute(agency_key, route_id, function(e, data){
      res.send( data || {error: 'No stops for agency/route combination.'});
    });
  });

  app.get('/api/stopsOnTrip/:agency/:trip_id', function(req, res){
    var agency_key = req.params.agency
      , trip_id = req.params.trip_id;
    gtfs.getStopsByTrip(agency_key, trip_id, function(e, data){
      res.send( data || {error: 'No stops for agency/trip combination.'});
    });
  });
  
  app.get('/api/stopsNearby/:lat/:lon/:radiusInMiles', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon
      , radius = req.params.radiusInMiles;
    gtfs.getStopsByDistance(lat, lon, radius, function(e, data){
      res.send( data || {error: 'No stops within radius of ' + radius + ' miles'});
    });
  });
  app.get('/api/stopsNearby/:lat/:lon', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon;
    gtfs.getStopsByDistance(lat, lon, function(e, data){
      res.send( data || {error: 'No stops within default radius'});
    });
  });

  //Trips
  app.get('/api/tripsNearby/:lat/:lon/:radiusInMiles', function(req, res){
    var lat = req.params.lat
      , lon = req.params.lon
      , radius = req.params.radiusInMiles;

    gtfs.getTripsNearby(lat, lon, radius, function(e, data){
      res.send( data || {error: 'No stops within default radius'});
    });
  });
  
  //Times
  app.get('/api/times/:agency/:route_id/:stop_id/:direction_id', function(req, res){
    var agency_key = req.params.agency
      , route_id = req.params.route_id
      , stop_id = req.params.stop_id
      , direction_id = parseInt(req.params.direction_id,10);
    gtfs.getTimesByStop(agency_key, route_id, stop_id, direction_id, function(e, data){
      res.send( data || {error: 'No times for agency/route/stop/direction combination.'});
    });
  });
  app.get('/api/times/:agency/:route_id/:stop_id', function(req, res){
    var agency_key = req.params.agency
      , route_id = req.params.route_id
      , stop_id = req.params.stop_id;
    gtfs.getTimesByStop(agency_key, route_id, stop_id, function(e, data){
      res.send( data || {error: 'No times for agency/route/stop combination.'});
    });
  });
    
  app.get('/api/times/:agency/:stop_id', function(req, res){
    var agency_key = req.params.agency
      , route_id = req.params.route_id

    gtfs.getTimesByStop(agency_key, route_id, stop_id, function(e, data){
      res.send( data || {error: 'No times for agency/route/stop combination.'});
    });
  });

  //Nothing specified
  app.all('*', function notFound(req, res) {
    
    res.contentType('application/json');

    res.send({
      error: 'No API call specified'
    });
  });

}
