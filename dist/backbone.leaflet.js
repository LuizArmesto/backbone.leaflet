/*! backbone.leaflet - v0.0.1-dev - 2/10/2013
* http://github.com/LuizArmesto/backbone.leaflet
* Copyright (c) 2013 Luiz Armesto; Licensed MIT */

(function ( Backbone, /* Underscore */ _, /* jQuery */ $, /* Leaflet */ L ) {
  "use strict";

  // The top-level namespace. All public classes will be attached to this.
  var Leaflet = {};

  // Current version of the component. Keep in sync with `package.json`.
  Leaflet.VERSION = '0.0.1-dev';

  // Save the previous value of the `Leaflet` attribute.
  var previousBackboneLeaflet = Backbone.Leaflet;

  // Attach our namespace to `Backbone` variable.
  Backbone.Leaflet = Leaflet;

  // Runs Backbone.Leaflet in *noConflict* mode, returning the `Backbone`
  // `Leaflet` attribute to its previous owner. Returns a reference to our
  // object.
  Leaflet.noConflict = function () {
    Backbone.Leaflet = previousBackboneLeaflet;
    return this;
  };


  // Backbone.Leaflet.GeoModel
  // -------------------------

  // Extend Backbone.Model, adding georef support.
  var GeoModel = Leaflet.GeoModel = Backbone.Model.extend({

  });


  // Backbone.Leaflet.GeoCollection
  // ------------------------------

  // Extend Backbone.Collectio, adding georef support.
  var GeoCollection = Leaflet.GeoCollection = Backbone.Collection.extend({

  });


  // Backbone.Leaflet.MapView
  // ------------------------

  // Backbone view to display `Backbone.Leaflet.GeoModel` and
  // `Backbone.Leaflet.GeoCollection` instances on map.
  var MapView = Leaflet.MapView = Backbone.View.extend({

    // Default options used to create the Leaflet map.
    defaultMapOptions: {
      center: [ -23.5, -46.6167 ],
      zoom: 14
    },

    // Create the Leaflet map and handle all events and callbacks.
    initialize: function () {
      // Set the map options values. `options.map` accepts all `L.Map` options.
      this.mapOptions = _.defaults( this.options.map || {},
                                    this.defaultMapOptions );
      // Create the Leaflet map instance.
      this.map = new L.Map( this.el, this.mapOptions );
      // Get the tile layer and add it to map
      this.tileLayer = this.getTileLayer();
      this.tileLayer.addTo(this.map);
    },

    // Return a `L.TileLayer` instance. Uses the `MapQuest` tiles by default.
    // Override this to use a custom tile layer.
    getTileLayer: function () {
      return new L.TileLayer(
        'http:///{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
          attribution: 'Data, imagery and map information provided by <a href="http://www.mapquest.com/">MapQuest</a>, <a href="http://www.openstreetmap.org/">Open Street Map</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',
          subdomains: [ 'otile1', 'otile2', 'otile3', 'otile4' ]
        }
      );
    }

  });


}( Backbone, _, jQuery, L ));
