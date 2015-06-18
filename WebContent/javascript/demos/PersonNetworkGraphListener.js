dojo.provide("demos.PersonNetworkGraphListener");

dojo.require("yfiles.client.tiles.GraphBounds");
dojo.require("yfiles.client.tiles.HitTest");
dojo.require("yfiles.client.tiles.InputMode");
dojo.require("yfiles.client.tiles.widget.GraphCanvas");
dojo.require("demos.widget.GraphInfo");

dojo.declare("demos.PersonNetworkGraphListener", yfiles.client.tiles.InputMode, {
  _layouter :  'circular',
  _overview : null,
  _graphInfo : null,
  _personId : null,
  _graphTimestamp : null,

/*
  _clickNodeHandle : null,
  _overNodeHandle : null,
  _outNodeHandle : null,
*/

  constructor : function(/*yfiles.client.tiles.widget.GraphCanvas*/ canvas,
                         /*yfiles.client.tiles.widget.GraphCanvas*/ overview,
                         /*demos.GraphInfo?*/ graphInfo,
                         /*int*/ personId,
                         /*String*/ graphTimestamp) {
    this._overview = overview;
    this._graphInfo = graphInfo;
    this._personId = personId;
    this._graphTimestamp = graphTimestamp;

    this._initializeGraph();
  },

  setLayouter : function(/*String*/ layouter) {
    this._layouter = layouter;
    this._layoutGraph();
  },
  
  search : function(/*String*/ searchString, output) {
    output.innerHTML='Searching..';
    
    // trim
    _name = searchString.replace(/^\s+|\s+$/g,"");
    if (_name.length == 0)
        return;

    var self = this;
    
    dojo.xhrPost({
      url : this._canvas.baseURL + '/PersonNetworkVisualization/search',
      content : { graphtimestamp: this._graphTimestamp, name : _name },
      load: function(result) {
        if (result != null) {
          output.innerHTML='';
          zoom = self._canvas.zoom;
          self._canvas.center(result.x * zoom, result.y * zoom);
          self._canvas.setZoom(1.0);
        } else {
          output.innerHTML='No result.';
        }
      },
      handleAs: "json"
    })
  },


// ------------------------------------------------------------------------------- //
// graph event handling
// ------------------------------------------------------------------------------- //
/*
  onClickNodeLabel : function (nodeLabelId) {
    var info = this._canvas.getHitTest().getLabelInfo(nodeLabelId);
    if (info && info.labelIndex == 1) {
      // avoid possible flicker due to shifting the tiles
      this._canvas.pushTiles();
      this._overview.pushTiles();
      this._toggleNode(info.mainElementId);
    }
  },

  onMouseOverNodeLabel : function (nodeLabelId) {
    var info = this._canvas.getHitTest().getLabelInfo(nodeLabelId);
    if (info && info.labelIndex == 1) {
      this._canvas.tilesFrame.style.cursor = 'pointer';
    }
  },

  onMouseOutNodeLabel : function (nodeLabelId) {
    this._canvas.tilesFrame.style.cursor = 'default';
  },
*/
// ------------------------------------------------------------------------------- //
// internal functions
// ------------------------------------------------------------------------------- //
/*
  _attachEventListeners : function() {
    this._clickNodeHandle = dojo.connect(this._canvas, 'onClickNodeLabel', this, 'onClickNodeLabel');
    this._overNodeHandle = dojo.connect(this._canvas, 'onMouseOverNodeLabel', this, 'onMouseOverNodeLabel');
    this._outNodeHandle = dojo.connect(this._canvas, 'onMouseOutNodeLabel', this, 'onMouseOutNodeLabel');
  },

  _detachEventListeners : function() {
    dojo.event.disconnect(this._clickNodeHandle);
    dojo.event.disconnect(this._overNodeHandle);
    dojo.event.disconnect(this._outNodeHandle);
  },

  _toggleNode : function (nodeId) {
    var self = this;
    dojo.xhrPost({
      url: this._canvas.baseURL + '/PersonNetworkVisualization/toggleNode',
      content : { path : 'PersonNetwork', id : nodeId, layout : this._layouter },
      load: function(result, ioargs) {
        self._refresh(result.bounds, result.shift);
        self._graphInfo.refresh();
      },
      handleAs: "json"
    });
  },

  _refresh : function (bounds, shift) {
    // avoid possible flicker due to shifting the tiles
    this._canvas.refresh(bounds, shift, true);
    this._overview.refresh(bounds, shift, true);
    this._overview.fitContent();
  },
*/
  _initializeGraph : function () {
    var self = this;
    dojo.xhrPost({
      url : this._canvas.baseURL + '/PersonNetworkVisualization/initialize',
      content : { graphtimestamp: this._graphTimestamp, id: this._personId, layout : this._layouter },
      load: function() {
        self._canvas.setPath('PersonNetwork' + self._graphTimestamp);
        //self._graphInfo.showInfo('PersonNetwork', 'graphs');
      },
      handleAs: "json"
    })
  },

  _layoutGraph : function () {
    var self = this;
    dojo.xhrPost({
      url : this._canvas.baseURL + '/PersonNetworkVisualization/layout',
      content : { graphtimestamp: this._graphTimestamp, layout : this._layouter },
      load: function() {
        self._canvas.setPath('PersonNetwork' + self._graphTimestamp);
        //self._graphInfo.showInfo('PersonNetwork', 'graphs');
      },
      handleAs: "json"
    })
  }
});