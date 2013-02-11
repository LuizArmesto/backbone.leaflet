/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true*/

describe( 'Backbone.Leaflet.MapView', function () {

  beforeEach( function () {
    // Create new `MapView` instance before each test.
    this.mapView = new Backbone.Leaflet.MapView();
  });

  afterEach( function () {
    // Remove the `MapView` instance after each test.
    this.mapView.remove();
    this.mapView = null;
  });

  it( 'should have `map` attribute', function () {
    expect( this.mapView ).to.have.property( 'map' );
  });

  it( 'should append `Leaflet` DOM elements', function () {
    expect( this.mapView.$el.hasClass( 'leaflet-container' ) ).to.be.equal(true);
    expect( this.mapView.$el.html() ).to.have.string( 'leaflet-map-pane' );
  });

  it( 'should provide a `L.TileLayer` instance', function () {
    // Should have a method to create a `L.TileLayer` instance.
    expect( this.mapView.getTileLayer() ).to.be.instanceOf( L.TileLayer );
    // Should initialize the `tileLayer` property.
    expect( this.mapView ).to.have.property( 'tileLayer' );
    expect( this.mapView.tileLayer ).to.be.instanceOf( L.TileLayer );
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

});
