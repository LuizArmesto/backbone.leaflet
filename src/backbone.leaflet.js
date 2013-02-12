/*globals Backbone:true, _:true, jQuery:true, L:true*/

(function ( Backbone, /* Underscore */ _, /* jQuery */ $, /* Leaflet */ L ) {
  "use strict";

  // The top-level namespace. All public classes will be attached to this.
  var Leaflet = {};

  // Current version of the component. Keep in sync with `package.json`.
  Leaflet.VERSION = '<%= pkg.version %>';

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


  // Default filter function to GeoJSON layer.
  var layerFilter = function ( feature, layer ) {
    if ( layer === this.layer ) {
      var model = this._getModelByFeature( feature );
      this.modelFilter( model );
    }
  };

  // Default style function to GeoJSON layer.
  var layerStyle = function ( feature ) {
    var model = this._getModelByFeature( feature );
    this.modelStyle( model );
  };


  // Backbone.Leaflet.GeoCollection
  // ------------------------------

  // Extend Backbone.Collectio, adding georef support.
  var GeoCollection = Leaflet.GeoCollection = function ( models, options ) {
    Backbone.Collection.apply( this, arguments );
    this.options = options || {};
    this._ensureLayer();
  };

  // Set up inheritance.
  GeoCollection.extend = Backbone.Collection.extend;

  // Inherit `Backbone.Collection`.
  _.extend( GeoCollection.prototype, Backbone.Collection.prototype, {

    // Default options used to create the Leaflet map.
    // See http://leafletjs.com/reference.html#geojson-options
    defaultLayerOptions: {
      filter: layerFilter,
      style: layerStyle
    },

    // Default visual style to be applied to model exhibition on map.
    // For more information see
    // http://leafletjs.com/reference.html#marker-options
    // http://leafletjs.com/reference.html#path-options
    // http://leafletjs.com/reference.html#polyline-options
    defaultStyle: {

    },

    // Function that will be used to decide whether to show a feature or not.
    // Returns `true` to show or `false` to hide.
    //
    // The default implementation looks for `filter` option passed to
    // constructor, if none `filter` option was passed shows all models.
    // Override this to create a custom default filter.
    modelFilter: function ( model ) {
      if ( this.options.filter && _.isFunction( this.options.filter ) ) {
        return this.options.filter.apply( this, arguments );
      }
      return true;
    },

    // Function that will be used to get style options for vector layers
    // created for GeoJSON features.
    modelStyle: function ( model ) {
      if ( this.options.style ) {
        if ( _.isFunction( this.options.style ) ) {
          return this.options.style.apply( this, arguments );
        } else {
          return this.options.style;
        }
      }
      if ( model.getStyle && _.isFunction( model.getStyle ) ) {
        return model.getStyle();
      }
      return this.defaultStyle;
    },

    // Returns the Backbone Model associated to the Leaflet Feature received.
    _getModelByFeature: function ( feature ) {
      // TODO
    },

    // Ensure that the collection has a `GeoJSON` layer.
    _ensureLayer: function () {
      if ( !this.layer ) {
        this.layerOptions = _.defaults( this.options.layer || {},
                                        this.defaultLayerOptions );
        var methods = ['filter', 'style'];
        _.each( methods, function ( method ) {
          this.layerOptions[method] = _.bind( this.layerOptions[method], this );
        }, this );
        this.layer = new L.GeoJSON( null, this.layerOptions );
      }
    }

  });


  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;


  // Backbone.Leaflet.MapView
  // ------------------------

  // Backbone view to display `Backbone.Leaflet.GeoModel` and
  // `Backbone.Leaflet.GeoCollection` instances on map.
  var MapView = Leaflet.MapView = function ( options ) {
    Backbone.View.apply( this, arguments );
  };

  // Set up inheritance.
  MapView.extend = Backbone.View.extend;

  // Inherit `Backbone.View`.
  _.extend( MapView.prototype, Backbone.View.prototype, {

    // Default options used to create the Leaflet map.
    defaultMapOptions: {
      center: [ -23.5, -46.6167 ],
      zoom: 14
    },

    // Call `Backbone.View.prototype.delegateEvents` then bind events with
    // `map` selector to `Leaflet` map object.
    //
    // See `Leaflet` documentation to get available events.
    // http://leafletjs.com/reference.html#map-events
    delegateEvents: function ( events ) {
      this._ensureMap();
      var context = 'delegateEvents' + this.cid;
      Backbone.View.prototype.delegateEvents.apply( this, arguments );
      // Do everything as `Backbone` do but bind to `Leaflet`.
      if ( !( events || ( events = _.result( this, 'events' ) ) ) ) {
        return this;
      }
      this._leaflet_events = {};
      for ( var key in events ) {
        var method = events[key];
        if ( !_.isFunction( method ) ) {
          method = this[events[key]];
        }
        if ( !method ) {
          throw new Error( 'Method "' + events[key] + '" does not exist' );
        }
        var match = key.match( delegateEventSplitter ),
            eventName = match[1],
            selector = match[2];
        method = _.bind( method, this );

        // Now we bind events with `map` selector to `Leaflet` map.
        if ( selector === 'map') {
          this.map.on( eventName, method, context );
          // Save the callbacks references to use to undelegate the events.
          this._leaflet_events[eventName] = method;
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the map with our custom
    // `delegateEvents`, then call `undelegateEvents` from `Backbone.View`.
    undelegateEvents: function () {
      var context = 'delegateEvents' + this.cid;
      this.map.off( this._leaflet_events || {}, context );
      this._leaflet_events = null;
      return Backbone.View.prototype.undelegateEvents.apply( this, arguments );
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
    },

    // Ensure that the view has a `Leaflet` map object.
    _ensureMap: function () {
      if ( !this.map ) {
        // Set the map options values. `options.map` accepts all `L.Map` options.
        // http://leafletjs.com/reference.html#map-constructor
        this.mapOptions = _.defaults( this.options.map || {},
                                      this.defaultMapOptions );
        // Create the Leaflet map instance.
        this.map = new L.Map( this.el, this.mapOptions );
        // Get the tile layer and add it to map
        this.tileLayer = this.getTileLayer();
        this.tileLayer.addTo(this.map);
      }
    }

  });


  // Backbone.Leaflet.SatelliteView
  // ------------------------------

  // Backbone view to display `Backbone.Leaflet.GeoModel` and
  // `Backbone.Leaflet.GeoCollection` instances on satellite map.
  // Extends `Backbone.Leaflet.MapView`.
  var SatelliteView = Leaflet.SatelliteView = MapView.extend({

    // Default options used to create the Leaflet map.
    defaultMapOptions: {
      center: [ -23.5, -46.6167 ],
      zoom: 11
    },

    // Replace the default tile layer to use `MapQuest Open Aerial` tiles.
    getTileLayer: function () {
      return new L.TileLayer(
        'http:///{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
        attribution: 'Data and imagery provided by <a href="http://www.mapquest.com/">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency.',
          subdomains: [ 'otile1', 'otile2', 'otile3', 'otile4' ]
        }
      );
    }

  });

}( Backbone, _, jQuery, L ));
