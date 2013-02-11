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

  // TODO:
  // * Test `modelFilter`
  // * Test `modelStyle`

});
