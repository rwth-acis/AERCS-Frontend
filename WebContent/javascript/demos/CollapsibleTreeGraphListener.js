/****************************************************************************
 **
 ** This file is part of yFiles AJAX.
 **
 ** yWorks proprietary/confidential. Use is subject to license terms.
 **
 ** Unauthorized redistribution of this file is strictly forbidden.
 **
 ** Copyright (c) 2006-2010 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ***************************************************************************/

dojo.provide("demos.CollapsibleTreeGraphListener");

dojo.require("yfiles.client.tiles.GraphBounds");
dojo.require("yfiles.client.tiles.HitTest");
dojo.require("yfiles.client.tiles.InputMode");
dojo.require("yfiles.client.tiles.widget.GraphCanvas");
dojo.require("demos.widget.GraphInfo");

dojo.declare("demos.CollapsibleTreeGraphListener", yfiles.client.tiles.InputMode, {
  _layouter :  'tree',
  _overview : null,
  _graphInfo : null,

  _clickNodeHandle : null,
  _overNodeHandle : null,
  _outNodeHandle : null,

  constructor : function(/*yfiles.client.tiles.widget.GraphCanvas*/ canvas,
                         /*yfiles.client.tiles.widget.GraphCanvas*/ overview,
                         /*demos.GraphInfo?*/ graphInfo) {
    this._overview = overview;
    this._graphInfo = graphInfo;

    this._initializeGraph();
  },

  setLayouter : function(/*String*/ layouter) {
    this._layouter = layouter;
    this._layoutGraph();
  },

// ------------------------------------------------------------------------------- //
// graph event handling
// ------------------------------------------------------------------------------- //
  onClickNodeLabel : function (/*String*/ nodeLabelId) {
    var info = this._canvas.getHitTest().getLabelInfo(nodeLabelId);
    if (info && info.labelIndex == 1) {
      // avoid possible flicker due to shifting the tiles
      this._canvas.pushTiles();
      this._overview.pushTiles();
      this._toggleNode(info.mainElementId);
    }
  },

  onMouseOverNodeLabel : function (/*String*/ nodeLabelId) {
    var info = this._canvas.getHitTest().getLabelInfo(nodeLabelId);
    if (info && info.labelIndex == 1) {
      this._canvas.tilesFrame.style.cursor = 'pointer';
    }
  },

  onMouseOutNodeLabel : function (/*String*/ nodeLabelId) {
    this._canvas.tilesFrame.style.cursor = 'default';
  },

// ------------------------------------------------------------------------------- //
// internal functions
// ------------------------------------------------------------------------------- //

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
      url: this._canvas.baseURL + '/TreeCollapser/toggleNode',
      content : { path : 'CollapsibleTree', id : nodeId, layout : this._layouter },
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

  _initializeGraph : function () {
    var self = this;
    dojo.xhrPost({
      url : this._canvas.baseURL + '/TreeCollapser/initialize',
      content : { layout : this._layouter },
      load: function(type, result, evt) {
        self._canvas.setPath('CollapsibleTree');
        self._graphInfo.showInfo('CollapsibleTree', 'graphs');
      },
      handleAs: "json"
    })
  },

  _layoutGraph : function () {
    var self = this;
    dojo.xhrPost({
      url : this._canvas.baseURL + '/TreeCollapser/layout',
      content : { layout : this._layouter },
      load: function(type, result, evt) {
        self._canvas.setPath('CollapsibleTree');
        self._graphInfo.showInfo('CollapsibleTree', 'graphs');
      },
      handleAs: "json"
    })
  }
});