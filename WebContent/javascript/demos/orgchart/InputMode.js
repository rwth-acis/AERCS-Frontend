dojo.provide("demos.orgchart.InputMode");

dojo.require("yfiles.client.tiles.InputMode");

dojo.declare("demos.orgchart.InputMode", yfiles.client.tiles.InputMode, {

  useDblClick : false,
  _viewOptions : null,
  _selection : null,
  _model : null,

  constructor : function(/*yfiles.client.tiles.widget.GraphCanvas*/ canvas,
                         /*demos.orgchart.widget.ViewOptions*/ viewOptions,
                          /*yfiles.client.tiles.GraphSelection*/ selection,
                         /*demos.orgchart.Model*/ model ) {

    this._selection = selection
    this._viewOptions = viewOptions;
    this._model = model;

    if( this.useDblClick ) {
      dojo.connect(canvas, "onDblClickNode", this, "focusNode");  
    } else {
      dojo.connect(canvas, "onClickNode", this, "onClickNode");
    }
  },

  activate : function() {
    this.inherited(arguments);
  },

  deactivate : function() {
    this.inherited(arguments);
  },

  onClickNode : function( /*String*/ nodeId, /*Object*/ info, /*Object*/ evt ) {

    if( (! this.useDblClick) && evt.shiftKey ) {

      if( this._model.isEmployee( nodeId ) ) {
        this.onClickEmployee( nodeId );
      } else {
        this.onClickBusinessUnit( nodeId )
      }
    }
  },

  onClickBusinessUnit : function( nodeId ) {
    this._viewOptions.toggleBusinessUnit( nodeId );
  },

  onClickEmployee : function( nodeId ) {

    if( this._viewOptions.isGlobalView() ) {

      this.zoomOnNode( nodeId );

    } else {

     var selectedNodes = this._selection.getNodes();
      if( selectedNodes.length != 1
          || (selectedNodes[0] != nodeId)) {
        this._selection.clear();
        this._selection.add( nodeId );
      }

      this._viewOptions.layout( false, nodeId );
    }
  },

  zoomOnNode : function( nodeId ) {
    var hitTest = this._canvas.getHitTest();
      var bounds = hitTest.getBoundsForId(nodeId);
      if( null != bounds ) {

        var viewWidth = this._canvas.width;
        var viewHeight = this._canvas.height;
        var zoom = 1;
        if( viewWidth / bounds.width() < viewHeight / bounds.height() ) {
          zoom = viewWidth / bounds.width();
        } else {
          zoom = viewHeight / bounds.height();
        }
        zoom *= 0.5;

        var w = ( bounds.maxX - bounds.minX );
        var h = ( bounds.maxY - bounds.minY );
        var worldX = bounds.minX + 0.5 * w;
        var worldY = bounds.minY + 0.5 * h;
        var vx = worldX * zoom;
        var vy = worldY * zoom;

        this._canvas.setZoom( zoom );
        this._canvas.center( vx, vy );
        this._canvas.recalculateTiles();
      }
  }
});