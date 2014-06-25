(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'leaflet'], function(Backbone, _, L) {
      return factory(Backbone, _, L);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var L = require('leaflet');
    module.exports = factory(Backbone, _, L);
  } else {
    factory(root.Backbone, root._, root.Leaflet);
  }

}(this, function(Backbone, _, L) {
  "use strict";

  // @include ../backbone.leaflet.js
  return Backbone;
}));
