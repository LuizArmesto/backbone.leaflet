/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true, window: true*/

(function () {
  "use strict";

  // Seting some helpful objects.
  var featureGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5]
    },
    properties: {}
  };

  var featureA = _.clone( featureGeoJSON );
  var featureB = _.clone( featureGeoJSON );

  featureA.properties = { id: 1 };
  featureB.properties = { id: 2 };

  var featureCollectionGeoJSON = {
    type: 'FeatureCollection',
    features: [
      featureA,
      featureB
    ]
  };

  // GeoCollection tests
  // -------------------
  describe( 'GeoCollection', function () {

    beforeEach( function () {
      // Create new `GeoCollection` instance before each test.
      this.geoCollection = new Backbone.Leaflet.GeoCollection( [], {} );
    });

    afterEach( function () {
      // Remove the `GeoCollection` instance after each test.
      this.geoCollection = null;
    });

    // Constructor tests
    // -----------------
    describe( 'Constructor', function () {

      it( 'should allow inheritance', function () {
        var GeoCollection = Backbone.Leaflet.GeoCollection;
        expect( GeoCollection.extend ).to.be.equal( Backbone.Collection.extend );
        expect( GeoCollection.prototype.initialize ).to.be.equal( Backbone.Collection.prototype.initialize, 'should not override `initialize` function' );
      });

      it( 'should initialize `layer` property', function () {
        expect( this.geoCollection ).to.have.property( 'layer' );
        expect( this.geoCollection.layer ).to.be.instanceOf( L.GeoJSON );
      });

      it( 'should accept GeoJSON as `models` param', function () {
        var geoCollection = new Backbone.Leaflet.GeoCollection( featureCollectionGeoJSON, {} );
        expect( geoCollection.models.length ).to.be.equal( 2, 'should create 2 models' );
        expect( geoCollection.models[0].id ).to.be.equal( 1 );
        expect( geoCollection.models[1].id ).to.be.equal( 2 );
        expect( geoCollection.models[0] ).to.be.instanceOf( Backbone.Leaflet.GeoModel );
      });
    });

    // Map elements filter tests
    // -------------------------
    describe( 'modelFilter', function () {

      it( 'should not filter models by default', function () {
        var modelFake = {};
        expect( this.geoCollection.modelFilter( modelFake ) ).to.be.equal( true );
      });

      it( 'should accept `filter` option', function () {
        var modelFake = {};
        var geoCollection = new Backbone.Leaflet.GeoCollection( [], {
          filter: function ( model ) {
            // Should receive the `modelFilter` arguments.
            expect( model ).to.be.equal( modelFake );
            // Should be binded.
            expect( this ).to.be.equal( geoCollection );
            return false;
          }
        });
        // Should returns the return from `filter`function defined above.
        expect( geoCollection.modelFilter( modelFake ) ).to.be.equal( false );
      });

    });

    // Map elements style tests
    // ------------------------
    describe( 'modelStyle', function () {

      it( 'should use `defaultStyle` as fallback to `modelStyle` function', function () {
        var modelFake = {};
        expect( this.geoCollection.modelStyle( modelFake ) ).to.be.equal( this.geoCollection.defaultStyle );
      });

      it( 'should get style from  models `getStyle` function if exists', function () {
        var myStyle = { color: '#fff' };
        var modelFake = {
          getStyle: function () {
            return myStyle;
          }
        };
        expect( this.geoCollection.modelStyle( modelFake ) ).to.be.equal( myStyle );
      });

    });

    // Backbone functions tests
    // ------------------------
    describe( 'toJSON', function () {

      it( 'should return GeoJSON', function () {
        var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
        var geoCollection = new Backbone.Leaflet.GeoCollection( [model] );
        expect( geoCollection.toJSON() ).to.be.deep.equal( {
          type: 'FeatureCollection',
          features: [featureGeoJSON]
        });

      });

    });

  });

}());
