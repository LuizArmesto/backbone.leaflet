# Backbone.Leaflet (0.0.1-dev)

[![Continuous Integration status](https://secure.travis-ci.org/LuizArmesto/backbone.leaflet.png)](http://travis-ci.org/LuizArmesto/backbone.leaflet)

*(Disclaimer: This project is not usable yet!)*


## Backbone.Leaflet.GeoModel

*TODO*


## Backbone.Leaflet.GeoCollection

*TODO*


## Backbone.Leaflet.MapView

The `MapView` is a [Backbone View](http://backbonejs.org/#View) to display `GeoCollection` and `GeoModel` on [Leaflet](http://leafletjs.com/) map, using [MapQuest-OSM](http://developer.mapquest.com/web/products/open/map) tiles.


### Creating a simple map

Use `MapView` just like any other `Backbone` view.

```javascript
var mapView = new Backbone.Leaflet.MapView({

  el: '#map',

  map: {
    ...  // Leaflet map options (optional).
  }

});
```

For more informations about map options see the [Leaflet documentation](http://leafletjs.com/reference.html#map-constructor).


### Delegating map events

To delegate map events just define the `events` property like you usually do but use "map" as selector to `Leaflet` map events.

```javascript
var MyMapView = Backbone.Leaflet.MapView.extend({

  events: {
    'click map': 'onClick',
    'move map': 'onMove'
  },

  onClick: function ( evt ) {
    ...
  },

  onMove: function ( evt ) {
    ...
  }

});


var myMapView = new MyMapView({
  ...  // View options.
});

```

For more informations about `Leaflet`events see the [map events reference](http://leafletjs.com/reference.html#map-events).


## Backbone.Leaflet.SatelliteView

The `SatelliteView` works similar to `MapView`, except that uses [MapQuest Open Aerial](http://developer.mapquest.com/web/products/open/map) tiles.


## Contributing
Indent your code with 2 spaces, strip trailing whitespace and take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.

Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!


## License
Copyright (c) 2013 Luiz Armesto Licensed under the MIT license.
