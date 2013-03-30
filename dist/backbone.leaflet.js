/*! backbone.leaflet - v0.0.1-dev - 3/30/2013
* http://github.com/LuizArmesto/backbone.leaflet
* Copyright (c) 2013 Luiz Armesto; Licensed MIT */

(function ( Backbone, _, L ) {
  "use strict";

  // Get jQuery from Backbone.
  var $ = Backbone.$;

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

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.GeoModel
  // -------------------------

  // Extend `Backbone.Model`, adding georef support.
  var GeoModel = Leaflet.GeoModel = Backbone.Model.extend({

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function ( key, val, options ) {
      var args, attrs, _attrs, geometry;
      args = arguments;
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if ( typeof key === 'object' ) {
        attrs = key;
        options = val;
      }
      // Handle GeoJSON argument.
      if ( attrs && attrs['type'] && attrs['type'] === 'Feature' ) {
        _attrs = _.clone( attrs['properties'] ) || {};
        // Clone the geometry attribute.
        geometry = _.clone( attrs['geometry'] ) || null;
        if ( geometry ) {
          geometry.coordinates = geometry['coordinates'].slice();
        }
        _attrs['geometry'] = geometry;
        args = [_attrs, options];
      }
      return Backbone.Model.prototype.set.apply( this, args );
    },

    // The GeoJSON representation of a `Feature`.
    // http://www.geojson.org/geojson-spec.html#feature-objects
    toJSON: function ( options ) {
      var attrs, props, geometry;
      options = options || {};
      attrs = _.clone( this.attributes );
      props = _.omit( attrs, 'geometry' );
      // Add model cid to internal use.
      if ( options.cid ) {
        props.cid = this.cid;
      }
      // Clone the geometry attribute.
      geometry = _.clone( attrs['geometry'] ) || null;
      if ( geometry ) {
        geometry.coordinates = geometry['coordinates'].slice();
      }
      return {
        type: 'Feature',
        geometry: geometry,
        properties: props
      };
    }

  });

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.GeoCollection
  // ------------------------------

  // Extend `Backbone.Collection`, adding georef support.
  var GeoCollection = Leaflet.GeoCollection = Backbone.Collection.extend({
    // Default model.
    model: GeoModel,

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function ( models, options ) {
      // Accpets FeatureCollection GeoJSON as `models` param.
      if ( models && !_.isArray( models ) && models.features ) {
        models = models.features;
      }
      return Backbone.Collection.prototype.reset.apply( this,
                                                        [models, options] );
    },

    // The GeoJSON representation of a `FeatureCollection`.
    // http://www.geojson.org/geojson-spec.html#feature-collection-objects
    toJSON: function ( options ) {
      var features = Backbone.Collection.prototype.toJSON.apply( this,
                                                                 arguments );
      return {
        type: 'FeatureCollection',
        features: features
      };
    }

  });

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Helper functions
  // ----------------

  // Default pointToLayer function to GeoJSON layer.
  var layerPointToLayer = function ( feature, latLng ) {
    var model = this._getModelByFeature( feature );
    return new L.Marker( latLng, this.modelStyle( model ) );
  };

  // Default filter function to GeoJSON layer.
  var layerFilter = function ( feature, layer ) {
    var model = this._getModelByFeature( feature );
    return this.modelFilter( model );
  };

  // Default style function to GeoJSON layer.
  var layerStyle = function ( feature ) {
    var model = this._getModelByFeature( feature );
    return this.modelStyle( model );
  };

  // Associates Backbone model and GeoJSON layer.
  var layerOnEachFeature = function ( feature, layer ) {
    this._layers[feature.properties.cid] = layer;
    // Add cid to layer object to associate it with the backbone model instance.
    layer.cid = feature.properties.cid;
    // Proxy layer events.
    var layerEvents = ['click', 'mouseover'];
    var that = this;
    _.each( layerEvents, function ( eventName ) {
      layer.on(eventName, function ( e ) {
        var map = layer._map;
        map.fire.apply( map, ['layer_' + eventName].concat( arguments ) );
      });
    });
  };


  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  // Backbone.Leaflet.MapView
  // ------------------------

  // Backbone view to display `Backbone.Leaflet.GeoModel` and
  // `Backbone.Leaflet.GeoCollection` instances on map.
  var MapView = Leaflet.MapView = function ( options ) {
    Backbone.View.apply( this, arguments );
    this._layers = {};
    // Create a GeoJSON layer associated with the collection
    this._layer = this._getLayer();
    this._layer.addTo( this.map );
    if ( this.collection ) {
      if ( !this.collection instanceof GeoCollection ) {
        throw new Error( 'The "collection" option should be instance of ' +
                         '"GeoCollection" to be used within Map view' );
      }
      this._ensureMap();
      // Bind Collection events.
      this.listenTo( this.collection, 'reset', this._onReset );
      this.listenTo( this.collection, 'add', this._onAdd );
      this.listenTo( this.collection, 'remove', this._onRemove );
      this.listenTo( this.collection, 'change', this._onChange );
      this.redraw();
    }
  };

  // Set up inheritance.
  MapView.extend = Backbone.View.extend;

  // Inherit `Backbone.View`.
  _.extend( MapView.prototype, Backbone.View.prototype, {
    // Default options used to create the Leaflet map.
    // See http://leafletjs.com/reference.html#geojson-options
    defaultLayerOptions: {
      pointToLayer: layerPointToLayer,
      filter: layerFilter,
      style: layerStyle,
      onEachFeature: layerOnEachFeature
    },

    // Default visual style to be applied to model exhibition on map.
    // For more information see
    // http://leafletjs.com/reference.html#marker-options
    // http://leafletjs.com/reference.html#path-options
    // http://leafletjs.com/reference.html#polyline-options
    defaultStyle: {

    },

    // Default options used to create the Leaflet map.
    defaultMapOptions: {
      center: [ -23.5, -46.6167 ],
      zoom: 14
    },

    redraw: function () {
      this._layers = {};
      this._layer.clearLayers();
      this._layer.addData( this.collection.toJSON({ cid: true }) );
      return this;
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
      var featureCallback = function ( method ) {
        return function ( e ) {
          var origEvent = e[0];
          method( origEvent );
        };
      };
      this._leaflet_events = {};
      for ( var key in events ) {
        // Get the callback method.
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
        if ( selector === 'map' || selector === 'layer' ) {
          if ( selector === 'layer' ) {
            eventName = 'layer_' + eventName;
            method = featureCallback( method );
          }
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
      // Clear the map events.
      this.map.off( this._leaflet_events || {}, context );
      this._leaflet_events = null;
      return Backbone.View.prototype.undelegateEvents.apply( this, arguments );
    },

    // Return a `L.TileLayer` instance. Uses the `MapQuest` tiles by default.
    // Override this to use a custom tile layer.
    getTileLayer: function () {
      return new L.TileLayer(
        'http:///{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
          attribution: 'Data, imagery and map information provided by ' +
                       '<a href="http://www.mapquest.com/">MapQuest</a>, ' +
                       '<a href="http://www.openstreetmap.org/">' +
                       'Open Street Map</a> and contributors, ' +
                       '<a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                       'CC-BY-SA</a>.',
          subdomains: [ 'otile1', 'otile2', 'otile3', 'otile4' ]
        }
      );
    },

    // Ensure that the view has a `Leaflet` map object.
    _ensureMap: function () {
      if ( !this.map ) {
        // Set the map options values. `options.map` accepts all `L.Map`
        // options.
        // http://leafletjs.com/reference.html#map-constructor
        this.mapOptions = _.defaults( this.options.map || {},
                                      this.defaultMapOptions );
        // Create the Leaflet map instance.
        this.map = new L.Map( this.el, this.mapOptions );
        // Get the tile layer and add it to map
        this.tileLayer = this.getTileLayer();
        this.tileLayer.addTo(this.map);
      }
    },

    // Function that will be used to decide whether to show a feature or not.
    // Returns `true` to show or `false` to hide.
    //
    // The default implementation looks for `filter` option passed to
    // constructor, if none `filter` option was passed shows all models.
    // Override this to create a custom default filter.
    modelFilter: function ( model ) {
      if ( !model ) {
        return true;
      }
      if ( this.options.filter && _.isFunction( this.options.filter ) ) {
        return this.options.filter.apply( this, arguments );
      }
      // Don't allow duplicated points for the same model
      return !this._layers[model.cid];
    },

    // Function that will be used to get style options for vector layers
    // created for GeoJSON features.
    modelStyle: function ( model ) {
      if ( !model ) {
        return this.defaultStyle;
      }
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
      var models = _.where( this.collection.models,
                            {cid: feature.properties.cid} );
      return models[0];
    },

    // Ensure that the collection has a `GeoJSON` layer.
    _getLayer: function () {
      var methods, layerOptions;
      layerOptions = _.defaults( this.options.layer || {},
                                 this.defaultLayerOptions );
      methods = ['pointToLayer', 'filter', 'style', 'onEachFeature'];
      _.each( methods, function ( method ) {
        layerOptions[method] = _.bind( layerOptions[method], this );
      }, this );
      return new L.GeoJSON( null, layerOptions );
    },

    // Add to map the model added to collection
    _onReset: function () {
      this.redraw();
    },

    // Add to map the model added to collection
    _onAdd: function ( model ) {
      this._layer.addData( model.toJSON({ cid: true }) );
    },

    // Remove from map the model removed from collection
    _onRemove: function ( model ) {
      var layer = this._layers[model.cid];
      if ( layer ) {
        this._layer.removeLayer( layer );
        this._layers[model.cid] = null;
      }
    },

    // Update the map layer
    _onChange: function ( model ) {
      // FIXME: Write some tests.
      var newStyle;
      var layer = this._layers[model.cid];
      if ( model.hasChanged( 'geometry' ) ) {
        // The geometry has been changed so we need to create new layer
        this._onRemove( model );  // Removes the old layer
        this._onAdd( model );     // Creates new updated layer
      } else {
        newStyle = this.modelStyle( model );
        if ( layer.setStyle && _.isFunction( layer.setStyle ) ) {
          // We have a path layer
          layer.setStyle( newStyle );
        } else if ( ( layer.setIcon && _.isFunction( layer.setIcon ) ) &&
                    ( layer.setOpacity && _.isFunction( layer.setOpacity ) ) ) {
          // We have a marker
          if ( newStyle.icon ) {
            layer.setIcon( newStyle.icon );
          }
          if ( newStyle.opacity ) {
            layer.setOpacity( newStyle.opacity );
          }
        }
      }
    }

  });

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

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
        attribution: 'Data and imagery provided by ' +
                     '<a href="http://www.mapquest.com/">MapQuest</a>. ' +
                     'Portions Courtesy NASA/JPL-Caltech and ' +
                     'U.S. Depart. of Agriculture, Farm Service Agency.',
          subdomains: [ 'otile1', 'otile2', 'otile3', 'otile4' ]
        }
      );
    }

  });

}( Backbone, _, L ));
