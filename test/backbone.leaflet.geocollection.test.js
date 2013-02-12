/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true, window: true*/

describe( 'Backbone.Leaflet.GeoCollection', function () {

  beforeEach( function () {
    // Create new `GeoCollection` instance before each test.
    this.geoCollection = new Backbone.Leaflet.GeoCollection({});
  });

  afterEach( function () {
    // Remove the `GeoCollection` instance after each test.
    this.geoCollection = null;
  });

  it( 'should allow inheritance', function () {
    var GeoCollection = Backbone.Leaflet.GeoCollection;
    expect( GeoCollection.extend ).to.be.equal( Backbone.Collection.extend );
    // Should not override `initialize` function.
    expect( GeoCollection.prototype.initialize ).to.be.equal( Backbone.Collection.prototype.initialize );
  });

  it( 'should have `layer` attribute', function () {
    expect( this.geoCollection ).to.have.property( 'layer' );
    expect( this.geoCollection.layer ).to.be.instanceOf( L.GeoJSON );
  });

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

  it( 'should have `toJSON` returning GeoJSON', function () {
    var featureGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [102.0, 0.5]
      },
      properties: {}
    };
    var model = new Backbone.Leaflet.GeoModel( featureGeoJSON );
    var geoCollection = new Backbone.Leaflet.GeoCollection( [model] );
    expect( geoCollection.toJSON() ).to.be.deep.equal( {
      type: 'FeatureCollection',
      features: [featureGeoJSON]
    });

  });

});
