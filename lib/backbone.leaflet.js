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

  });


}( Backbone, _, jQuery, L ));
