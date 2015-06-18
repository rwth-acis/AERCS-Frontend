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

dojo.provide("demos.widget.GraphDescription");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare('demos.widget.GraphDescription', [dijit._Widget, dijit._Templated],
{
// widget settings
  templateString: '<div class="graphDescription" dojoAttachPoint="mainNode"></div>',

  canvasId : "",

// domNodes
  mainNode : null,

  _canvas : null,
  _descriptions : null,

  postCreate : function() {
    var id = this.canvasId;
    this._canvas = dijit.byId(id);
    var graph = this._canvas.getGraph();

    var self = this;
    dojo.xhrGet({
      url: graph.getBaseURL() + '/resources/graphs/graph-descriptions.json',
      load: function(descriptions, ioargs) {
        self._descriptions = descriptions;
      },
      handleAs : 'json'
    });

    dojo.connect(graph, "onLoad", this, "onGraphLoaded");
  },

  onGraphLoaded : function(name, customData) {
    var description = this._descriptions[name];
    if (description && description != "") {
      this.mainNode.innerHTML = description;
    } else {
      this.mainNode.innerHTML = "";
    }
  }
});