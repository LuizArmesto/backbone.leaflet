/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true*/

(function () {
  "use strict";

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

      it( 'should listen collection events', function ( done ) {
        var n = 0;
        var geoCollection = new Backbone.Leaflet.GeoCollection();
        var onEvent = function () {
          if ( ++n === 3 ) {
            done();
          }
        };
        // Extend `MapView` to override callbacks.
        var MyMapView = Backbone.Leaflet.MapView.extend({
          _onReset: onEvent,
          _onAdd: onEvent,
          _onRemove: onEvent
        });
        this.mapView = new MyMapView({
          collection: geoCollection
        });

        geoCollection.trigger( 'reset' );
        geoCollection.trigger( 'add' );
        geoCollection.trigger( 'remove' );

      });

    });

    // Leaflet integration tests
    // -------------------------
    describe( 'Leaflet integration', function () {

      it( 'should create a GeoJSON layer', function () {
        expect( this.mapView ).to.have.property( '_getLayer' );
        expect( this.mapView._getLayer() ).to.be.instanceOf( L.GeoJSON );
        expect( this.mapView ).to.have.property( 'layer' );
        expect( this.mapView.layer ).to.be.instanceOf( L.GeoJSON );
      });

      it( 'should has a empty layer if dont have collection', function () {
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( 0 );
      });

      it( 'should add collection models to map', function () {
        var geoCollection = new Backbone.Leaflet.GeoCollection( featureCollectionGeoJSON );
        this.mapView = new Backbone.Leaflet.MapView({
          collection: geoCollection
        });
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( featureCollectionGeoJSON.features.length );
      });

      it( 'should add/remove objects to map when add/remove models to collection', function () {
        var geoCollection = new Backbone.Leaflet.GeoCollection();
        var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
        this.mapView = new Backbone.Leaflet.MapView({
          collection: geoCollection
        });
        // Verifies the number of layers objects to know if our model was added/removed.
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( 0 );
        geoCollection.add( model );
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( 1 );
        geoCollection.remove( model );
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( 0 );
      });

      it( 'should associate the backbone model to the leaflet feature object', function () {
        var geoCollection = new Backbone.Leaflet.GeoCollection();
        var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
        this.mapView = new Backbone.Leaflet.MapView({
          collection: geoCollection
        });
        geoCollection.add( model );
        expect( _.keys( this.mapView.layer._layers ).length ).to.be.equal( 1 );
        expect( _.values( this.mapView.layer._layers )[0] ).to.have.property( 'cid' );
        expect( _.values( this.mapView.layer._layers )[0].cid ).to.be.equal( model.cid );
      });

      it( 'should not replace all map objects when add/remove new models to collection', function () {
        var geoCollection = new Backbone.Leaflet.GeoCollection( featureCollectionGeoJSON );
        var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
        this.mapView = new Backbone.Leaflet.MapView({
          collection: geoCollection
        });
        // Get the layers ids to future comparation.
        var layersIds = _.keys( this.mapView.layer._layers );
        // Add new model then verify if the other ids remains the same.
        geoCollection.add( model );
        expect( _.initial( _.keys( this.mapView.layer._layers ) ) ).to.be.deep.equal( layersIds);
        // Remove our new model then verify if the ids list.
        geoCollection.remove( model );
        expect( _.keys( this.mapView.layer._layers ) ).to.be.deep.equal( layersIds );
      });

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

      it( 'should delegate layers events', function ( done ) {
        var n = 0;
        var geoCollection = new Backbone.Leaflet.GeoCollection( featureCollectionGeoJSON );
        var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
        // Extend `MapView` to handle events.
        var MyMapView = Backbone.Leaflet.MapView.extend({
          events: {
            'click layer': 'onEvent',
            'mouseover layer': 'onEvent'
          },
          onEvent: function ( e ) {
            if ( ++n === 2 ) {
              done();
            }
          }
        });
        // Instanciate MyMapView
        var myMapView = new MyMapView({
          collection: geoCollection
        });
        // Add new model then verify if the other ids remains the same.
        geoCollection.add( model );
        // Fire map events
        _.values( myMapView.layer._layers )[0].fire( 'click' ).fire( 'mouseover' );
        // Clear `MyMapView` instance.
        myMapView.remove();
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
        var that = this;
        var modelFake = {};
        this.mapView = new Backbone.Leaflet.MapView({
          filter: function ( model ) {
            // Should receive the `modelFilter` arguments.
            expect( model ).to.be.equal( modelFake );
            // Should be binded.
            expect( this ).to.be.equal( that.mapView );
            return false;
          }
        });
        // Should returns the return from `filter`function defined above.
        expect( this.mapView.modelFilter( modelFake ) ).to.be.equal( false );
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
