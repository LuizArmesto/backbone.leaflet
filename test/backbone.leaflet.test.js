/*globals Backbone: true, _: true, jQuery: true, $: true, L: true,
  describe: true, expect: true, sinon: true, it: true,
  beforeEach: true, afterEach: true*/

describe( 'Backbone.Leaflet Initialization', function () {

  it( 'should attach `Leaflet` to `Backbone` namespace', function () {
    expect( Backbone ).to.have.property( 'Leaflet' );
  });

  it( 'should have `VERSION` attribute', function () {
    expect( Backbone.Leaflet ).to.have.property( 'VERSION' );
  });

  it( 'should have `noConflict` mode', function () {
    var _leafletOrig,
        _leaflet;
    expect( Backbone.Leaflet ).to.have.property( 'noConflict' );
    expect( Backbone.Leaflet.noConflict ).to.be.a( 'function' );
    // Save reference to original `Backbone.Leaflet` to compare with
    // `noConflict` return and to restore the original value later.
    _leafletOrig = Backbone.Leaflet;
    _leaflet = Backbone.Leaflet.noConflict();
    expect( _leaflet ).to.be.equal( _leafletOrig );
    expect( Backbone.Leaflet ).to.be.an( 'undefined' );
    // Restore the `Backbone.Leaflet`.
    Backbone.Leaflet = _leafletOrig;
  });

});
