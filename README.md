# Backbone.Leaflet (0.1.1)

[![Continuous Integration status](https://secure.travis-ci.org/LuizArmesto/backbone.leaflet.png)](http://travis-ci.org/LuizArmesto/backbone.leaflet)

*(Disclaimer: This project is in an early development stage. It is not intended to be used in production yet!)*

__Backbone.Leaflet__ is a [Backbone](http://backbonejs.org/) plugin designed to work with geospatial data using [GeoJSON](http://geojson.org) specification, providing an extended model (`Backbone.Leaflet.GeoModel`) and an extended collection (`Backbone.Leaflet.GeoCollection`) that accepts and exports GeoJSON data and a couple of views (`Backbone.Leaflet.MapView` and `Backbone.Leaflet.SatelliteView`) to display `GeoModel` instances in a map, using [Leaflet](http://leafletjs.com).

You should be familiar with both Backbone and Leaflet to get the best use out of this plugin.

__Dependencies__:
 * [Backbone 1.1.x](http://backbonejs.org/#downloads) and its dependencies
 * [Leaflet 0.7.x](http://leafletjs.com/download.html)



## Backbone.Leaflet.GeoModel

The `GeoModel` is a [Backbone Model](http://backbonejs.org/#Model) to work with [GeoJSON](http://geojson.org/).

When using `GeoModel` the method `toJSON` will return a JSON object following the [GeoJSON format specification](http://geojson.org/geojson-spec.html). On the other hand you can use either a common JSON or a [GeoJSON object with the type "Feature"](http://geojson.org/geojson-spec.html#feature-objects) as an input data. All other methods works as in ordinary Backbone's model.

### Creating a `GeoModel` Instance

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

### Creating a `GeoCollection` Instance Using "FeatureCollection" GeoJSON

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

The `MapView` is a [Backbone View](http://backbonejs.org/#View) to display `GeoCollection` on [Leaflet](http://leafletjs.com/) map using [MapQuest-OSM](http://developer.mapquest.com/web/products/open/map) tiles.

There are some functions that can be overridden to customize the map behavior and appearance.

 * __getTileLayer()__ - Function that will be used to get an instance of `L.TileLayer`. Can be overridden to use another tiles server.
 * __modelFilter( model )__ - Function that receives a model and returns `true` if the model should be added to map, otherwise `false`. Can be overridden but is recommended to use the `filter` option.
 * __layerStyle( model )__ - Function that receives a model and returns the [Leaflet style options](http://leafletjs.com/reference.html#path-options) used to define the layer appearance. Can be overridden but is recommended to use the `style` option.

### Constructor Options

The `mapView` constructor allows some options.

 * __collection__ - `GeoCollection` instance.
 * __el__ - DOM element used to render the map.
 * __map__ - [Leaflet Map options](http://leafletjs.com/reference.html#map-options) (optional).
 * __popup__ - [Leaflet Popup options](http://leafletjs.com/reference.html#popup-options) (optional).
 * __popupView__ - Constructor of Backbone view used to render the popup content (optional).
 * __layer__ - [Leaflet GeoJSON Layer options](http://leafletjs.com/reference.html#geojson-options) (optional). It is not recommended to set custom callbacks using this option because this will override some important functions used internally.
 * __style__ - [Leaflet style options](http://leafletjs.com/reference.html#path-options) or a function that receives a model and should return a style options object (optional). Prefer using this option instead of override `layerStyle` function or `layer.style` option.
 * __filter__ - Function that will receive a model and should return `true`if the model should be added to map or `false` if not (optional). Prefer using this option instead of override `modelFilter` function or `layer.filter` option.

### Creating a Simple Map

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


### Delegating Map Events

To delegate map events just define the `events` property like you usually do but use _"map"_ as selector to Leaflet map events. To delegate [Layers](http://leafletjs.com/reference.html#ilayer) (markers, polygons, etc) events use _"layer"_ as selector.

```javascript
var MyMapView = Backbone.Leaflet.MapView.extend({

  events: {
    'click map': 'onClick',
    'move map': 'onMove',
    'click layer', 'onLayerClick'
  },

  onClick: function ( evt ) {
    ...
  },

  onMove: function ( evt ) {
    ...
  },

  onLayerClick: function ( evt ) {
    var layer = evt.target;  // Get the Leaflet "layer" object.
    var model = this.collection.get( layer );  // Get the Backbone model associated to the "layer".
    ...
  }

});


var myMapView = new MyMapView({
  ...  // View options.
});

```

For more informations about Leaflet events see the [map events reference](http://leafletjs.com/reference.html#map-events).


## Backbone.Leaflet.SatelliteView

The `SatelliteView` works similar to `MapView`, except that uses [MapQuest Open Aerial](http://developer.mapquest.com/web/products/open/map) tiles.

## Backbone.Leaflet.PopupView

Backbone View used to render the popup content. You can extend this view to create a more complex popup and use the `MapView` `popupView` option to use your custom view.

## Contributing
Indent your code with 2 spaces, strip trailing whitespace and take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.

Also, please don't edit files in the _"dist"_ subdirectory as they are generated via grunt. You'll find source code in the _"src"_ subdirectory!

### Installing Dependencies

To contribute you will have to install some development dependencies. This assume you already have [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed on your system.

First install [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/).

```
  sudo npm install -g grunt-cli
  sudo npm install -g bower
```

Now install all dependencies.

```
  npm install
  bower install
```

Finally, you will be ready to develop and contribute :)

### Testing

Use grunt to test the code.

```
  grunt test
```

### Building

Use grunt to build.

```
  grunt build
```

## License
Copyright (c) 2014 Luiz Armesto Licensed under the MIT license.
