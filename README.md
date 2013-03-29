# Backbone.Leaflet (0.0.1-dev)

[![Continuous Integration status](https://secure.travis-ci.org/LuizArmesto/backbone.leaflet.png)](http://travis-ci.org/LuizArmesto/backbone.leaflet)

*(Disclaimer: This project is in an early development stage. It is not intended to be used in production yet!)*


## Backbone.Leaflet.GeoModel

The `GeoModel` is a [Backbone Model](http://backbonejs.org/#Model) to work with [GeoJSON](http://geojson.org/).

When using `GeoModel` the method `toJSON` will return a JSON object following the [GeoJSON format specification](http://geojson.org/geojson-spec.html). On the other hand you can use either a common JSON or a [GeoJSON object with the type "Feature"](http://geojson.org/geojson-spec.html#feature-objects) as an input data. All other methods works as in ordinary Backbone's model.

### Creating a `GeoModel` instance

```javascript
var geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
};

var geoModel = new Backbone.Leaflet.GeoModel( geojsonFeature );

```

## Backbone.Leaflet.GeoCollection

The `GeoCollection` is a [Backbone Collection](http://backbonejs.org/#Collection) to work with GeoJSON and `GeoModel`. You can create a new collection using either an array of `GeoModels` or a [GeoJSON object with the type "FeatureCollection"](http://geojson.org/geojson-spec.html#feature-collection-objects). The `toJSON` method will return a GeoJSON object.

### Creating a `GeoCollection` instance

```javascript
var geojsonFeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6368, -23.5100]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6156, -23.5016]
      }
    }
  ]
};

var geoCollection = new Backbone.Leaflet.GeoCollection( geojsonFeatureCollection );

```

## Backbone.Leaflet.MapView

The `MapView` is a [Backbone View](http://backbonejs.org/#View) to display `GeoCollection` and `GeoModel` on [Leaflet](http://leafletjs.com/) map using [MapQuest-OSM](http://developer.mapquest.com/web/products/open/map) tiles.


### Creating a simple map

Use `MapView` just like any other `Backbone` view.

```javascript
var mapView = new Backbone.Leaflet.MapView({

  el: '#map',

  collection: geoCollection,  // See above how to create a `GeoCollection` instance.

  map: {
    ...  // Leaflet map options (optional).
  }

});
```

For more informations about map options see the [Leaflet documentation](http://leafletjs.com/reference.html#map-constructor).


### Delegating map events

To delegate map events just define the `events` property like you usually do but use "map" as selector to `Leaflet` map events. To delegate "features" (marks, polygons, etc) events use "feature" as selector.

```javascript
var MyMapView = Backbone.Leaflet.MapView.extend({

  events: {
    'click map': 'onClick',
    'move map': 'onMove',
    'click feature', 'onFeatureClick'
  },

  onClick: function ( evt ) {
    ...
  },

  onMove: function ( evt ) {
    ...
  },

  onFeatureClick: function ( evt ) {
    // Get the Leaflet "feature" object.
    var feature = evt.target;
    // Get the Backbone model associated to the "feature".
    var model = this.collection.get( feature );

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
