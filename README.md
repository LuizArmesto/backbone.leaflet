# Backbone.Leaflet (0.0.1-dev)

[![Continuous Integration status](https://secure.travis-ci.org/LuizArmesto/backbone.leaflet.png)](http://travis-ci.org/LuizArmesto/backbone.leaflet)

*This project is not usable yet!*

## Backbone.Leaflet.MapView

####1. Create a new GeoCollection

*TODO*

####2. Create a new MapView

```javascript
var mapView = new Backbone.Leaflet.MapView({

  // The DOM element where the map will be rendered.
  el: '#map',

  // The `GeoCollection` created above.
  collection: geoCollection,

  // `L.map` options (optional).
  // See Leaflet documentation for more informations about this.
  map: {
    ...
  }

});
```

## Contributing
Indent your code with 2 spaces, strip trailing whitespace and take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.

Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!

## License
Copyright (c) 2013 Luiz Armesto Licensed under the MIT license.
