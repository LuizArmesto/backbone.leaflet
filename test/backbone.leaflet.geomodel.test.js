/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true, window: true*/

(function () {
  "use strict";

  // Seting some helpful objects.
  var featureGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'point',
      coordinates: [102.0, 0.5]
    },
    properties: {
      foo: 'Bar',
      spam: 'Eggs'
    }
  };


  // GeoModel tests
  // -------------------
  describe( 'GeoModel', function () {

    beforeEach( function () {
      // Create new `GeoModel` instance before each test.
      this.geoModel = new Backbone.Leaflet.GeoModel( featureGeoJSON );
    });

    afterEach( function () {
      // Remove the `GeoModel` instance after each test.
      this.geoModel = null;
    });

    // Constructor tests
    // -----------------
    describe( 'Constructor', function () {

      it( 'should allow inheritance', function () {
        var GeoModel = Backbone.Leaflet.GeoModel;
        expect( GeoModel.extend ).to.be.equal( Backbone.Model.extend );
        // Should not override `initialize` function.
        expect( GeoModel.prototype.initialize ).to.be.equal( Backbone.Model.prototype.initialize, 'should not override `initialize` function' );
      });

      it( 'should be instance of `Backbone.Model`', function () {
        expect( this.geoModel ).to.be.instanceOf( Backbone.Model );
      });

      it( 'should allow null JSON object as `properties` value', function () {
        var featureGeoJSON_ = _.clone( featureGeoJSON );
        featureGeoJSON_.properties = null;
        var geoModel = new Backbone.Leaflet.GeoModel( featureGeoJSON_ );
      });

    });

    // Backbone functions tests
    // ------------------------
    describe( 'get', function () {

      it( 'should access GeoJSON `properties` directly', function () {
        expect( this.geoModel.get( 'foo' ) ).to.be.equal( featureGeoJSON.properties.foo );
        expect( this.geoModel.get( 'spam' ) ).to.be.equal( featureGeoJSON.properties.spam );
      });

      it( 'should access GeoJSON `geometry` directly', function () {
        expect( this.geoModel.get( 'geometry' ) ).to.be.deep.equal( featureGeoJSON.geometry );
      });

    });

    describe( 'toJSON', function () {

     it( 'should return GeoJSON', function () {
        expect( this.geoModel.toJSON() ).to.be.deep.equal( featureGeoJSON );
     });

     it( 'should return GeoJSON even if not constructed with GeoJSON', function () {
        var json = {
          foo: 'Bar',
          hey: 'You'
        };
        var geoModel = new Backbone.Leaflet.GeoModel( json );
        expect( geoModel.toJSON() ).to.be.deep.equal({
          type: 'Feature',
          geometry: null,
          properties: json
        });
     });

     it( 'should return GeoJSON including properties added with `set` function', function () {
        var geometry = {
          type: 'Point',
          coordinates: [-10.0, 42.5]
        };

        expect( this.geoModel.toJSON() ).to.be.deep.equal( featureGeoJSON );
        this.geoModel.set( 'hey', 'You' );
        this.geoModel.set({ yabba: 'Dabadoo' });
        this.geoModel.set( 'geometry', geometry );
        expect( this.geoModel.toJSON() ).to.be.deep.equal({
          type: 'Feature',
          geometry: geometry,
          properties: _.extend({ hey: 'You', yabba: 'Dabadoo' },
                               featureGeoJSON.properties )
        });
     });

    });

  });

}());
