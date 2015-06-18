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

dojo.provide("demos.TooltipGraphListener");

dojo.require("yfiles.client.tiles.widget.GraphCanvas");
dojo.require("demos.widget.GraphInfo");

dojo.declare("demos.TooltipGraphListener", null, {
  tooltipDelay : 500,
  tooltipDuration : 5000,

  _canvas : null,
  _graphInfo : null,
  _graphName : null,
  _toolTips : null,

  _baseURL : null,

  constructor : function(/*yfiles.client.tiles.widget.GraphCanvas*/ canvas,
                         /*yfiles.client.tiles.widget.GraphInfo?*/ graphInfo) {
    this._canvas = canvas;
    this._baseURL = canvas.getGraph().getBaseURL();
    this._graphInfo = graphInfo;
    this._toolTips = [];


    dojo.connect(this._canvas, 'pathSet', this, '_setGraphName');

    dojo.connect(this._canvas, 'onClickNode', this, 'onClickNode');
    dojo.connect(this._canvas, 'onClickEdge', this, 'onClickEdge');
    dojo.connect(this._canvas, 'onMouseOverNode', this, 'onMouseOverNode');
    dojo.connect(this._canvas, 'onMouseOutNode', this, 'onMouseOutNode');
  },

// ------------------------------------------------------------------------------- //
// graph event handling
// ------------------------------------------------------------------------------- //
  onClickNode : function (/*String*/ nodeId, info, evt) {
    if (nodeId == null || this._graphName == null) {
      return;
    }
    if (this._graphInfo && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
      this._graphInfo.showInfo(this._graphName + '/nodes/' + nodeId, 'graphs');
    } else if( this._graphInfo && evt.shiftKey ) {
      this._graphInfo.gotoNodeURL(  'graphs/' + this._graphName + "/nodes/" + nodeId );
    }
  },

  onClickEdge : function (/*String*/ edgeId, info, evt) {
    if (edgeId == null || this._graphName == null) {
      return;
    }
    if (this._graphInfo && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
      this._graphInfo.showInfo(this._graphName + '/edges/' + edgeId, 'graphs');
    }
  },

  onMouseOverNode : function (/*String*/ id) {
    this._showTooltip(id);
  },

  onMouseOutNode : function (/*String*/ id) {
    this._hideTooltip(id);
  },

// ------------------------------------------------------------------------------- //
// internal functions
// ------------------------------------------------------------------------------- //
  _showTooltip : function (/*String*/ nid) {
    var id = '' + nid;
    var tooltip = dojo.byId(id);
    if (!tooltip) {
      tooltip = this._createTooltip(id);
    }
    tooltip.setAttribute('hide', 'false');
    var self = this;
    setTimeout(
        function() {
          var hide = tooltip.getAttribute('hide');
          if (hide != 'true') {
            tooltip.style.left = "-1000px";
            tooltip.style.top = "-1000px";
            tooltip.style.display = "block";

            if (tooltip.style.width == "") {
              self._setInitialDimensions(tooltip);
            }

            self._setPosition(tooltip);

            setTimeout(function() {
              if (tooltip) {
                tooltip.style.display = "none";
              }
            }, self.tooltipDuration);
          }
        }, self.tooltipDelay);
  },

  _setInitialDimensions : function(tooltip) {
    if (dojo.isIE) {
      var maxWidth = 0;
      for (var i = 0; i < tooltip.childNodes.length; i++) {
        var child = tooltip.childNodes[i];
        if (child.scrollWidth > maxWidth) {
          maxWidth = child.scrollWidth;
        }
      }
      tooltip.style.width = maxWidth + "px";
      tooltip.style.height = tooltip.scrollHeight + "px";
    } else if (dojo.isFF) {
      var cbox = dojo.contentBox(tooltip);
      //tooltip.style.width = cbox.w + "px";
      //tooltip.style.height = cbox.h + "px";
    }
  },

  _setPosition : function (tooltip) {
    var mouse = this._canvas.getMousePosition();
    var x = (mouse.x + 20);
    var y = mouse.y;
    var box = dojo.marginBox(tooltip);
    if (x + box.w > this._canvas.width)
    {
      x -= (box.w + 40);
    }
    if (y + box.h > this._canvas.height)
    {
      y -= (box.h + 40);
    }
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
  },


  _hideTooltip : function (/*String*/ nid) {
    var id = '' + nid;
    var tooltip = dojo.byId(id);
    if (tooltip) {
      tooltip.setAttribute('hide', 'true');
      tooltip.style.display = "none";
    }
  },

  _createTooltip : function(/*String*/ nid) {

    

    return this._createGraphInfoTooltip(nid);

  },

  _createGraphInfoTooltip : function( /*String*/ nid ) {
    var w = new demos.widget.GraphInfo({
      baseURL : this._baseURL, basePath : 'graphs/' + this._graphName, path : 'nodes/' + nid, tooltip: true });
    var domNode = w.domNode;
    dojo.removeClass(domNode, 'graphInfo');
    domNode.setAttribute("id", nid);
    this._canvas.containerNode.appendChild(domNode);
    dojo.addClass(domNode, 'tooltip');
    dojo.style(domNode,  "opacity", 0.8);
    this._toolTips.push(w);
    return w.domNode;
  },

  _setGraphName : function(/*String*/ newName) {
    this._graphName = newName;
    for (var idx = 0; idx < this._toolTips.length; idx++) {
      this._toolTips[idx].destroy();
    }
    this._toolTips = [];
  }
});