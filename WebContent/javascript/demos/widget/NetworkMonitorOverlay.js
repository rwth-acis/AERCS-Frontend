dojo.provide("demos.widget.NetworkMonitorOverlay");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("dojox.gfx");


dojo.declare("demos.widget.NetworkMonitorOverlay", [dijit._Widget, dijit._Templated], {

  // summary:	draws graphic overlays on top of graph nodes to visualize load factor and status values.
  
  statics: {
    STATE_OK : 0,
    STATE_WARNING : 1,
    STATE_ERROR : 2
  },

  _canvas : null,
  
  canvasId : '',
  networkOverlays : null,
  _lastStatus : null,
  _nodeOverlays : null,
  _lastZoom : null,
  loadBarHeight : 12,
  loadBarPadding : 5,
  barBorderSize1 : 3,
  barBorderSize2 : 0,

  barColors : ["#2fbb00","#58be00","#95c201","#d9c701","#fcca01","#fba104","#fa6908","#f9460b","#f7120e","#FF0000"],
  stateColors : ["#00FF00","#FFCC33","#FF0000"],

  templatePath : dojo.moduleUrl("demos", "widget/NetworkMonitorOverlay.html"),

  postCreate : function () {
    this._nodeOverlays = {};
    var id = this.canvasId;
    this._canvas = dijit.byId( id );
    this._lastZoom = this._canvas.zoom;
    dojo.connect( this._canvas, "viewPortChanged", this, "onViewPortChanged" );
  },

  onViewPortChanged : function(/*Number*/ x, /*Number*/ y, /*Number*/ width, /*Number*/ height, /*Number*/ zoom) {

    // since the NetworkMonitorOverlay is added as ac hild of the GraphCanvas' movables element, the visualization
    // only has to be updated when the zoom level changes.
    if( this._lastZoom != zoom ) {
      this.updateStatus( this._lastStatus );
      this._lastZoom = zoom;
    }
  },

  clearStatus : function() {
    this._nodeOverlays = {};
    this._removeDOMChildren( this.networkOverlays );
  },

  updateStatus : function( status ) {

    this._lastStatus = status;

    for( var nodeId in status ) {
      var o = status[nodeId];
      var nodeStatus = o.state;
      var nodeLoad   = o.load;
      this.updateNodeState( nodeId, nodeLoad, nodeStatus );
    }
  },

  updateNodeState : function (nodeId, load, state ) {

    // summary:
    //   Update the load factor/status visualization for a single node
    
    var hitTest = this._canvas.getHitTest();
    var zoom = this._canvas.zoom;
    var bounds = hitTest.getBoundsForId(nodeId);
    if (bounds) {

      // are there overlays that can be reused?
      var nodeOverlays = this._nodeOverlays[ nodeId ];
      var loadDiv, stateDiv;
      if( null == nodeOverlays ) {

        // no existing overlays found: create new overlays
        loadDiv = dojo.doc.createElement('div');
        stateDiv = dojo.doc.createElement('div');
        this._nodeOverlays[ nodeId ] = [ loadDiv, stateDiv ];

        // make the overlays visible by appending them to the
        // networkOverlays element defined in the HTML template
        // of this widget.
        this.networkOverlays.appendChild( loadDiv );
        this.networkOverlays.appendChild( stateDiv );
      } else {

        // reuse existing overlays
        loadDiv = this._nodeOverlays[ nodeId ][0];
        stateDiv = this._nodeOverlays[ nodeId ][1];
      }

      // set the position and size of the overlays
      this._initLoadDiv(loadDiv,bounds,zoom);
      this._initStatusDiv(stateDiv,bounds,zoom);

      // draw the visualization
      this.drawLoad( loadDiv, bounds, load, zoom );
      this.drawState( stateDiv, bounds, state, zoom );
    }
  },

  _initStatusDiv : function(div,bounds,zoom) {
    // the status div is drawn on top of the node
    dojo.style(div, "left", (bounds.minX * zoom ) + 'px');
    dojo.style(div, "top", (bounds.minY * zoom ) + 'px');
    dojo.style(div, "width", (bounds.width() * zoom ) + 'px');
    dojo.style(div, "height", (bounds.height() * zoom ) + 'px');
    dojo.style(div, "display", "block");
    dojo.style(div, "position", "absolute");
  },

  _initLoadDiv : function(div,bounds,zoom) {
    // the load factor is drawn above the node bounds
    dojo.style(div, "left", (bounds.minX * zoom ) + 'px');
    dojo.style(div, "top", ((bounds.minY - this.loadBarHeight - this.loadBarPadding - this.barBorderSize2 - this.barBorderSize1 - 1) * zoom ) + 'px');
    dojo.style(div, "width", (bounds.width() * zoom ) + 'px');
    dojo.style(div, "height", (bounds.height() * zoom ) + 'px');
    dojo.style(div, "display", "block");
    dojo.style(div, "position", "absolute");
  },

  drawLoad : function( nodeDiv, bounds, load, zoom ) {

    // summary: draw the load factor visualization

    // destroy any exisiting children of the overlay element
    this._removeDOMChildren(nodeDiv);

    // create a new surface to draw on
    var surface = dojox.gfx.createSurface(nodeDiv, nodeDiv.width, nodeDiv.height);
    var xpadding = 8;
    var boxWidth = (bounds.width()-xpadding*2) * zoom;
    var r = 0.1 * (load+1); // the bar width is determined by the current load value
    var w = r * boxWidth;
    var h = this.loadBarHeight * zoom;
    var x = xpadding * zoom;
    var y = 1 + this.barBorderSize1 + this.barBorderSize2; 

    // draw the outer border
    var rect3 = surface.createRect({x: x-this.barBorderSize1, y: y-this.barBorderSize1,width: boxWidth+2*this.barBorderSize1, height: h+2*this.barBorderSize1});
    rect3.setStroke("black");
    rect3.setFill("#CCCCCC");

    // draw the inner border
    var rect2 = surface.createRect({x: x-this.barBorderSize2, y: y-this.barBorderSize2,width: boxWidth+2*this.barBorderSize2, height: h+2*this.barBorderSize2});
    rect2.setStroke("black");
    rect2.setFill("#EEEEEE");

    // draw the load factor bar
    var rect = surface.createRect({x: x, y: y,width: w, height: h});
    // use a different color for different load values
    rect.setFill( this.barColors[ load ]);
    rect.setStroke("black");

  },

  drawState : function( nodeDiv, bounds, state, zoom ) {

    // summary: draw the node state

     // destroy any exisiting children of the overlay element
    this._removeDOMChildren(nodeDiv);

    // create a new surface to draw on
    var surface = dojox.gfx.createSurface(nodeDiv, nodeDiv.width, nodeDiv.height);
    var statusHeight = 15;
    var statusWidth = 15;
    var paddingLeft = 5;
    var paddingTop = 5;
    var w = statusWidth * zoom;
    var h = statusHeight * zoom;
    var x = paddingLeft * zoom;
    var y = paddingTop * zoom;

    var centerX = x + 0.5 * w;
    var centerY = y + 0.5 * h;
    var radius = 0.5 * w;

    // use a different color for different states
    var fillColor = this.stateColors[ state ];

    // draw the border
    var circle0 = surface.createCircle({cx: centerX, cy: centerY,r : radius});
    circle0.setStroke("black");
    circle0.setFill("white");

    // draw the state circle
    var circle1 = surface.createCircle({cx: centerX, cy: centerY,r : radius-3});
    circle1.setStroke("black");
    circle1.setFill(fillColor);

  },

  _removeDOMChildren : function(domNode) {
    while (domNode.hasChildNodes()) {
      this._removeDOMChildren(domNode.firstChild);
      dojo._destroyElement(domNode.firstChild);
    }
  }

});