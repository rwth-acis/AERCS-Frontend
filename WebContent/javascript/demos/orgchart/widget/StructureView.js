dojo.provide("demos.orgchart.widget.StructureView");

dojo.require("dijit.tree.ForestStoreModel");
dojo.require("dijit.tree.TreeStoreModel");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("demos.orgchart.widget.StructureView", [dijit._Widget, dijit._Templated], {

  canvasId : '',

  model : null,
  tree : null,
  treeModel : null,
  canvas : null,

  _selection : null,
  _lateInitHandle : null,
  _inputMode : null,

  templatePath : dojo.moduleUrl("demos", "orgchart/widget/StructureView.html"),
  _keyPressedNodeId : null,

  postCreate : function() {

    var id = this.canvasId;
  
    if (!this.canvas) {
      this.canvas = dijit.byId(this.canvasId);
    }
    if (this.canvas == null) {
      // canvas is not yet created
      this._lateInitHandle = this.connect(dijit.registry, "add", "lateInitialization");
    } else {
      this.initCanvas();
    }

  },

  lateInitialization : function(widget) {
    if (widget.id == this.canvasId) {
      this.canvas = widget;
      this.disconnect(this._lateInitHandle);
      this.initCanvas();
    }
  },

  initCanvas : function() {
    dojo.connect(this.canvas, "onClickNode", this, "onCanvasNodeClicked" );
  },

  setSelection : function ( selection ) {
    this._selection = selection;
  },

  setInputMode : function( inputMode ) {
    this._inputMode = inputMode;
  },

  onCanvasNodeClicked : function ( nodeId ) {

    // node already focused?
    var lastFocused = this.tree.lastFocused;
    if( lastFocused ) {
      var item = lastFocused.item;
      var focusId = this.model.getStore().getValue( item, "nodeId" );
      if( focusId == nodeId || this._keyPressedNodeId == nodeId ) {
        return;
      }
    }

    var self = this;

    var fetchArgs = {
      query : {
        nodeId : nodeId
      },
      onComplete : function(items, request) {
        if( items.length == 1 ) {
          var item =  items[0];
          var path = [ self.model.getStore().getValue(item, "nodeId") ];
          self._focusItem( item, path );
        }
      }
    };

    this.model.getStore().fetch( fetchArgs );
  },

  _focusItem : function( item, path ) {

    var parentId = this.model.getStore().getValue(item, "parent" );
    if( parentId ) {
        var self = this;
        var fetchArgs = {
          query : {
            nodeId : parentId
          },
          onComplete : function(items, request) {
            if( items.length == 1 ) {
              var item =  items[0];
              path.push( self.model.getStore().getValue(item, "nodeId") );
              self._focusItem( item, path );
            }
          }
        };

        this.model.getStore().fetch( fetchArgs );
      } else {

        // bug in dojo? if path only contains the root node,
        // the path attribute doesn't work.

        if( path.length > 1 ) {
          path.reverse();
          this.tree.attr( "path", path );
        } else {
          this.tree.focusNode( this.tree.rootNode );
        }
      

      }
  },

  setModel : function( model ) {

    this.model = model;
    this.treeModel = new dijit.tree.TreeStoreModel({store: model.getStore(), query : { nodeId : model.getRootItem().nodeId }});
    this.tree = new dijit.Tree({
                  persist: false,
                  model: this.treeModel,
                  onClick : dojo.hitch( this, "_onTreeNodeClicked" )
              },
              "treeDiv");
    dojo.connect( this.tree, "_onEnterKey", this, "_onTreeEnterKey");
  },

  _onTreeNodeClicked : function( item ) {

    var nodeId = this.model.getStore().getValue(item, "nodeId");
    if( null != this._selection ) {
      this._selection.clear();
      this._selection.add( nodeId );
    }
    this.centerNode( nodeId );
  },
  
  _onTreeEnterKey: function(/*Object*/ message, /*Event*/ evt){

    var item = message.item;
    var nodeId = this.model.getStore().getValue(item, "nodeId");

    if( null != this._selection ) {
      this._selection.clear();
      this._selection.add( nodeId );
    }
    this._inputMode.zoomOnNode( nodeId );
  },

  // move the viewport such that the
  // given node is displayed in the center of the canvas
  centerNode: function( nodeId ) {
    
    var zoom = this.canvas.zoom;
    var hitTest = this.canvas.getHitTest();
    var bounds = hitTest.getBoundsForId(nodeId);
    if( null != bounds ) {
      var w = ( bounds.maxX - bounds.minX );
      var h = ( bounds.maxY - bounds.minY );
      var worldX = bounds.minX + 0.5 * w;
      var worldY = bounds.minY + 0.5 * h;
      var vx = worldX * zoom;
      var vy = worldY * zoom;

      this.canvas.center( vx, vy );
      this.canvas.recalculateTiles();
    }
  }

});