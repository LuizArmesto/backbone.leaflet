# Backbone.Leaflet (0.0.1-dev)

[![Continuous Integration status](https://secure.travis-ci.org/LuizArmesto/backbone.leaflet.png)](http://travis-ci.org/LuizArmesto/backbone.leaflet)

*This project is not usable yet!*

## Backbone.Leaflet.GeoModel

*TODO*

## Backbone.Leaflet.GeoCollection

*TODO*

## Backbone.Leaflet.MapView

The `MapView` is a [`Backbone` View](http://backbonejs.org/#View) to display `GeoCollection` and `GeoModel` on [`Leaflet`](http://leafletjs.com/) map, using [`MapQuest-OSM`](http://developer.mapquest.com/web/products/open/map) tiles.

```javascript
var mapView = new Backbone.Leaflet.MapView({

  // The DOM element where the map will be rendered.
  el: '#map',

  // See above how to ceate a `GeoCollection` instance.
  collection: geoCollection,

  // `L.map` options (optional).
  // See Leaflet documentation for more informations about this.
  map: {
    ...
  }

});
```

## Backbone.Leaflet.SatelliteView

The `SatelliteView` works similar to `MapView`, except that uses [`MapQuest Open Aerial`](http://developer.mapquest.com/web/products/open/map) tiles.

## Contributing
Indent your code with 2 spaces, strip trailing whitespace and take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.

Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!

## License
Copyright (c) 2013 Luiz Armesto Licensed under the MIT license.
