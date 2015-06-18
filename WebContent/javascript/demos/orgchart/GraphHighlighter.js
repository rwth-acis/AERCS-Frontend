dojo.provide("demos.orgchart.GraphHighlighter");

dojo.require("yfiles.client.tiles.GraphHighlighter");
dojo.require("dojox.gfx");

dojo.declare("demos.orgchart.GraphHighlighter", null, {

  _defaultHighlighter : null,

  constructor : function() {
    this._defaultHighlighter = new yfiles.client.tiles.GraphHighlighter();
  },

  drawNodeHighlight : function( canvas, highlightDiv, nodeBounds ) {

    var x = Math.round(nodeBounds.minX * canvas.zoom);
    var y = Math.round(nodeBounds.minY * canvas.zoom);
    var w = Math.round(nodeBounds.width() * canvas.zoom);
    var h = Math.round(nodeBounds.height() * canvas.zoom);

    var border = 3;
    var padding = 3;

    var left = (x - border - padding);
    var top = (y - border - padding);
    var width = w + padding*2;
    var height = h + padding*2;

    dojo.style(highlightDiv, {
      "left" : left + "px",
      "top" : top + "px",
      "width" : width + "px",
      "height" : height + "px",
      "display" : "block",
      "position" : "absolute"
    });

    if( dojo.isIE == 6 ) {
      // using a css border doesn't work in IE6
      // - use dojo.gfx to draw the selection border.
      dojo.style( highlightDiv, "margin", border + "px" );
      var surface = dojox.gfx.createSurface(highlightDiv, w+border*2, h+border*2);
      var rect3 = surface.createRect({x: border, y: border,width: width-border*2, height: height-border*2});
      rect3.setStroke( { color: "#ff6600", width: border } );
    } else {
      dojo.style( highlightDiv, "border", border + "px solid orange" );
    }

    var bgDiv = dojo.doc.createElement('div');
    dojo.style(bgDiv, {
      "opacity" : 0.3,
      "display" : "block",
      "position" : "absolute",
      "left" :padding + "px",
      "top" : padding + "px",
      "width" : w + "px",
      "height" : h  + "px",
      "backgroundColor" : "white"
    });
    highlightDiv.appendChild( bgDiv );

  },

  drawEdgeHighlight : function( canvas, parentDiv, controlPointIndex, controlPoints ) {
    this._defaultHighlighter.drawEdgeHighlight( parentDiv, controlPointIndex, controlPoints );
  }

});