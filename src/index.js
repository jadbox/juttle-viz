var api = {
    // core src/views
    Text: require('./views/text'),
    Table: require('./views/table'),
    Timechart: require('./views/timechart'),
    Barchart: require('./views/barchart'),
    Piechart: require('./views/piechart'),
    Scatterchart: require('./views/scatterchart'),
    Less: require('./views/logexplorer'),
    Tile: require('./views/tile'),
    File: require('./views/file'),
    Events: require('./views/events'),
    // prototypes
    TimechartVisjs: require('./prototype-views/timechart-visjs')
};

(function () {
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this; 

    // Create a reference to this
    var _ = api;

    var isNode = false;

    // Export the Underscore object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) {
            module.exports = _;
            root._ = _;
            isNode = true;
    } else {
            root._ = _;
    }
})();
