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

dojo.provide("demos.GraphClient");

dojo.require("yfiles.client.tiles.HierarchyManager");
dojo.require("yfiles.client.tiles.widget.GraphCanvas");
dojo.require("yfiles.client.tiles.widget.ViewPortMarker");
dojo.require("yfiles.client.tiles.widget.Rubberband");

dojo.declare("demos.GraphClient", null, {
  zoomFactor : 2.0,

  _canvas : null,
  _overview : null,
  _graphInfo : null,
  _rubberBand : null,
  _hierarchy : null,

  _graphName : null,

  _hideZoomAreaHandle : null,
  _applyZoomAreaHandle : null,

  constructor : function(canvas, overview, graphInfo, rubberBand, zoomFactor, hierarchy) {
    this._canvas = canvas;

    this._overview = overview;
    this._graphInfo = graphInfo;
    this._rubberBand = rubberBand;

    this._hierarchy = hierarchy;

    if (zoomFactor) {
      this.zoomFactor = zoomFactor;
    }

    dojo.connect(this._canvas, 'pathSet', this, 'hideZoomArea');
    dojo.connect(this._canvas, 'pathSet', this, '_setGraphName');
    if (this._overview)
    {
      dojo.connect(this._canvas, 'pathSet', this._overview, 'setPath');
      if (this._hierarchy) {
        dojo.connect(this._hierarchy, 'onCloseGroup', this, '_refreshOverview');
        dojo.connect(this._hierarchy, 'onOpenGroup', this, '_refreshOverview');
        dojo.connect(this._hierarchy, 'onSwitchToSubgraph', this, '_refreshOverviewOnGroupSwitch');
        dojo.connect(this._hierarchy, 'onSwitchToParent', this, '_refreshOverviewOnGroupSwitch');
      }
    }
    if (this._graphInfo)
    {
      dojo.connect(this._canvas, 'areaUpdated', this._graphInfo, 'refresh');
      if (this._hierarchy) {
        dojo.connect(this._hierarchy, 'onCloseGroup', this._graphInfo, 'refresh');
        dojo.connect(this._hierarchy, 'onOpenGroup', this._graphInfo, 'refresh');
        dojo.connect(this._hierarchy, 'onSwitchToSubgraph', this._graphInfo, 'refresh');
        dojo.connect(this._hierarchy, 'onSwitchToParent', this._graphInfo, 'refresh');
      }
    }
  },

  _setGraphName : function(graphName) {
    this._graphName = graphName;
    if (this._graphInfo) {
      this._graphInfo.setHeading(graphName);
      this._graphInfo.showInfo(graphName, 'graphs');
    }
  },

  _refreshOverview : function() {
    this._overview.refresh();
    this._overview.fitContent();
  },

  _refreshOverviewOnGroupSwitch : function(id, bounds) {
    this._overview.refresh(bounds);
    this._overview.fitContent();
  },

  // ------------------------------------------------------------------------------- //
  // actions for buttons and menu entries
  // ------------------------------------------------------------------------------- //
  zoomIn : function () {
    this._canvas.setZoom(this._canvas.zoom * this.zoomFactor);
  },

  zoomOut : function () {
    this._canvas.setZoom(this._canvas.zoom / this.zoomFactor);
  },

  fitContent : function () {
    this._canvas.fitContent();
  },

  // ------------------------------------------------------------------------------- //
  // zoom area handling
  // ------------------------------------------------------------------------------- //
  showZoomArea : function () {
    if (this._rubberBand) {
      window.status = 'Click and drag to mark the zoom area.';
      this._rubberBand.activate(this._canvas);
      this._hideZoomAreaHandle = dojo.connect(this._rubberBand, 'onDeactivated', this, 'hideZoomArea');
      this._applyZoomAreaHandle = dojo.connect(this._rubberBand, 'onAreaDone', this, 'applyZoomArea');
    }
  },

  hideZoomArea : function () {
    if (this._rubberBand) {
      dojo.disconnect(this._hideZoomAreaHandle);
      dojo.disconnect(this._applyZoomAreaHandle);
      this._rubberBand.deactivate();
      window.status = '';
    }
  },

  applyZoomArea : function (x, y, w, h) {
    // summary: applies the zoom area to the canvas, if it is at least
    //   10 pixels wide and high.
    var canvas = this._canvas;
    if (w > 9 && h > 9) {
      var cx = x + w / 2;
      var cy = y + h / 2;
      var oldZoom = canvas.zoom;
      var newZoom = oldZoom * Math.min(canvas.width / w, canvas.height / h);
      canvas.center(cx, cy);
      canvas.setZoom(newZoom);
    }
  }
});