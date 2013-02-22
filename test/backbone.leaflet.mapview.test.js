/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true*/

(function () {
  "use strict";

  // MapView tests
  // -------------
  describe( 'MapView', function () {

    beforeEach( function () {
      // Create new `MapView` instance before each test.
      this.mapView = new Backbone.Leaflet.MapView();
    });

    afterEach( function () {
      // Remove the `MapView` instance after each test.
      this.mapView.remove();
      this.mapView = null;
    });

    // Constructor tests
    // -----------------
    describe( 'Constructor', function () {

      it( 'should allow inheritance', function () {
        var MapView = Backbone.Leaflet.MapView;
        expect( MapView.extend ).to.be.equal( Backbone.View.extend );
        // Should not override `initialize` function.
        expect( MapView.prototype.initialize ).to.be.equal( Backbone.View.prototype.initialize );
      });

      it( 'should initialize a `map` property', function () {
        expect( this.mapView ).to.have.property( 'map' );
        expect( this.mapView.map ).to.be.instanceOf( L.Map );
      });

      it( 'should append `Leaflet` DOM elements', function () {
        expect( this.mapView.$el.hasClass( 'leaflet-container' ) ).to.be.equal(true);
        expect( this.mapView.$el.html() ).to.have.string( 'leaflet-map-pane' );
      });

      it( 'should initialize a `L.TileLayer` instance', function () {
        // Should have a method to create a `L.TileLayer` instance.
        expect( this.mapView.getTileLayer() ).to.be.instanceOf( L.TileLayer );
        // Should initialize the `tileLayer` property.
        expect( this.mapView ).to.have.property( 'tileLayer' );
        expect( this.mapView.tileLayer ).to.be.instanceOf( L.TileLayer );
      });

    });

    // Events tests
    // ------------
    describe( 'Events', function () {

      it( 'should delegate map events', function ( done ) {
        var n = 0;
        // Extend `MapView` to handle events.
        var MyMapView = Backbone.Leaflet.MapView.extend({
          events: {
            'click map': 'onEvent',
            'move map': 'onEvent'
          },
          onEvent: function ( e ) {
            expect( e ).to.have.property( 'type' );
            expect( e ).to.have.property( 'target' );
            expect( e.target ).to.be.equal( this.map );
            if ( ++n === 2 ) {
              done();
            }
          }
        });
        // Instanciate MyMapView
        var myMapView = new MyMapView();
        // Fire map events
        myMapView.map.fire( 'click' );
        myMapView.map.fire( 'move' );
        // Clear `MyMapView` instance.
        myMapView.remove();
      });

    });

    // Leaflet integration tests
    // -------------------------
    describe( 'Leaflet integration', function () {

      it( 'should create a GeoJSON layer', function () {
        expect( this.mapView ).to.have.property( 'getLayer' );
        expect( this.mapView.getLayer() ).to.be.instanceOf( L.GeoJSON );
      });

    });

    // Map elements filter tests
    // -------------------------
    describe( 'modelFilter', function () {

      it( 'should not filter models by default', function () {
        var modelFake = {};
        expect( this.mapView.modelFilter( modelFake ) ).to.be.equal( true );
      });

      it( 'should accept `filter` option', function () {
        var modelFake = {};
        var mapView = new Backbone.Leaflet.MapView({
          filter: function ( model ) {
            // Should receive the `modelFilter` arguments.
            expect( model ).to.be.equal( modelFake );
            // Should be binded.
            expect( this ).to.be.equal( mapView );
            return false;
          }
        });
        // Should returns the return from `filter`function defined above.
        expect( mapView.modelFilter( modelFake ) ).to.be.equal( false );
      });

    });

    // Map elements style tests
    // ------------------------
    describe( 'modelStyle', function () {

      it( 'should use `defaultStyle` as fallback to `modelStyle` function', function () {
        var modelFake = {};
        expect( this.mapView.modelStyle( modelFake ) ).to.be.equal( this.mapView.defaultStyle );
      });

      it( 'should get style from  models `getStyle` function if exists', function () {
        var myStyle = { color: '#fff' };
        var modelFake = {
          getStyle: function () {
            return myStyle;
          }
        };
        expect( this.mapView.modelStyle( modelFake ) ).to.be.equal( myStyle );
      });

    });

  });

}());
