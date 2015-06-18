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

dojo.provide("demos.widget.GraphEditor");

dojo.require("dojo.dnd.Source");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.Slider");

dojo.require("dojox.layout.FloatingPane");
dojo.require("dojox.widget.Toaster");

dojo.require("yfiles.client.tiles.widget.GraphCanvas");
dojo.require("yfiles.client.tiles.widget.ViewPortMarker");
dojo.require("yfiles.client.tiles.EditMode");
dojo.require("yfiles.client.tiles.SquelchClickMode");
dojo.require("yfiles.client.tiles.HitTest");
dojo.require("yfiles.client.tiles.HierarchyManager");
dojo.require("yfiles.client.tiles.ZoomAreaMode");

dojo.declare('demos.widget.GraphEditor', [dijit._Widget, dijit._Templated], {
// summary: This class implements a graph editor as a single dojo widget.
// description: It uses a GraphCanvas for displaying a graph and a second one in a toggable floating
//  window for the overview. It uses an EditMode for handling mouse gestures on the canvas.
//  There is a menu, a toolbar and a context menu. They duplicate some actions like zooming, which is also
//  possible with the mouse wheel and introduce some new actions like editing a label (context menu) or
//  doing a layout (menu). Details on using the GraphEditor can be found in the online help page.

  baseURL : ".",
  path : "",
  zoomFactor : 2.0,

// DOM nodes

// subwidgets
  contextMenu : null,
  canvas : null,
  overview : null,
  toolbar : null,
  canvasPane : null,

  _layoutContainer : null,
  _overviewPane : null,
  _optionsPane : null,
  _optionsContents : null,
  _nodeChoice : null,

// internal fields
  _hierarchyManager : null,

  _editMode : null,
  _zoomAreaMode : null,
  _squelchClickMode : null,

  _newButton : null,
  _newMenu : null,
  _downloadButton : null,
  _downloadMenu : null,

  _editButton : null,
  _deleteButton : null,

  _zoomInButton : null,
  _zoomOutButton : null,
  _zoomAreaButton : null,
  _fitContentButton : null,

  _zoomInMenu : null,
  _zoomOutMenu : null,
  _fitContentMenu : null,

  _viewParentMenu : null,
  _viewGroupMenu : null,
  _groupMenu : null,
  _ungroupMenu : null,
  _openGroupMenu : null,
  _closeGroupMenu : null,

  _layoutMenu : null,
  _hierarchicalMenu : null,
  _organicMenu : null,
  _orthogonalMenu : null,

  _overviewMenu : null,
  _paletteMenu : null,
  _helpMenu : null,
  _optionsMenu : null,

  _zoomFactorSpinner : null,
  _sensitivitySlider : null,
  _sensitivityValue : null,
  _formatSelect : null,

  _contextMenu : null,
  _zoomInContextMenu : null,
  _zoomOutContextMenu : null,
  _fitContentContextMenu : null,
  _deleteContextMenu : null,
  _editLabelContextMenu : null,
  _openURLContextMenu : null,

  _lastId : null,
  _lastHref : null,

  _editModeActiveOnMenuOpen : false,

// settings
  templatePath : dojo.moduleUrl("demos", "widget/GraphEditor.html"),
  widgetsInTemplate : true,

  postCreate : function() {
    this.setBaseURL(this.baseURL);

    // create a hierarchy manager to enable grouping and folding of nodes
    this._hierarchyManager = new yfiles.client.tiles.HierarchyManager(this.canvas.getGraph());

    // initialize floating panes
    this.overview.setNoInteractionMode();
    var marker = new yfiles.client.tiles.widget.ViewPortMarker({ canvas : this.canvas, overview : this.overview });
    this.overview.domNode.appendChild(marker.domNode);

    var overviewPane = this._overviewPane;
    overviewPane.resize({w:200, h:150});
    overviewPane.close = function() { overviewPane.hide(); };
    //overviewPane.hide();

    var optionsPane = this._optionsPane;
    optionsPane.close = function() { optionsPane.hide(); };
    optionsPane.hide();

    this._createNodePalette();

    // initialize controllers (input modes)
    this._zoomAreaMode = new yfiles.client.tiles.ZoomAreaMode(this.canvas);
    this._editMode = new yfiles.client.tiles.EditMode(this.canvas, true, true, false, this._hierarchyManager);
    this._squelchClickMode = new yfiles.client.tiles.SquelchClickMode(this.canvas);
    this._editMode.setEdgeTestSensitivity(5);
    this._editMode.getMoveSelectionMode().setRouteEdges(false);

    // load the graph specified in the HTML markup
    this.setPath(this.path);

    // wire the events to the appropriate actions
    this._initActions();
  },

  setBaseURL : function(/*String*/ baseURL) {
    // summary: sets the base path for server requests (possibly relative to the current page)
    this.baseURL = baseURL;
    this.canvas.setBaseURL(baseURL);
    this.overview.setBaseURL(baseURL);
  },

  setPath : function(/*String*/ path, /*Boolean?*/ doNotReload) {
    // summary:
    //   initializes the editor for a graph given by a symbolic name,
    //   if it is set to a non-empty string. Any prior changes to the
    //   graph are discarded.
    this.path = path;
    dojo.doc.title = 'Graph Editor [' + path + ']';
    this.canvas.setPath(path, !doNotReload);
  },

  _initActions : function () {
    this._connectMenu();
    this._connectToolbar();
    this._connectContextMenu();
    this._connectGraphEvents();
    this._connectHierarchyEvents();
    this._connectCanvasEvents();
    this._connectInputModes();

    this.connect(this._zoomFactorSpinner, 'onChange', '_changeZoomFactor');
    this.connect(this._sensitivitySlider, 'onChange', '_changeSensitivity');

    this._initFormatSelection();
    this._setEditMode();
  },

  _connectMenu : function() {
    this.connect(this._newMenu, 'onClick', '_newGraph');
    this.connect(this._downloadMenu, 'onClick', '_downloadGraph');

    this.connect(this._zoomInMenu, 'onClick', '_zoomIn');
    this.connect(this._zoomOutMenu, 'onClick', '_zoomOut');
    this.connect(this._fitContentMenu, 'onClick', '_fitContent');

    this.connect(this._viewParentMenu, 'onClick', '_viewParent');
    this.connect(this._viewGroupMenu, 'onClick', '_viewGroup');
    this.connect(this._groupMenu, 'onClick', '_group');
    this.connect(this._ungroupMenu, 'onClick', '_ungroup');
    this.connect(this._openGroupMenu, 'onClick', '_openGroup');
    this.connect(this._closeGroupMenu, 'onClick', '_closeGroup');

    var layoutHierarchically = dojo.hitch(this, this._doLayout, "hierarchic");
    this.connect(this._hierarchicalMenu, 'onClick', layoutHierarchically);
    var layoutOrganically = dojo.hitch(this, this._doLayout, "organic");
    this.connect(this._organicMenu, 'onClick', layoutOrganically);
    var layoutOrthogonally = dojo.hitch(this, this._doLayout, "orthogonal");
    this.connect(this._orthogonalMenu, 'onClick', layoutOrthogonally);

    var showOverview = dojo.hitch(this, this._showFloatingPane, this._overviewPane);
    this.connect(this._overviewMenu, 'onClick', showOverview);
    var showNodeChoice = dojo.hitch(this, this._showFloatingPane, this._nodeChoice);
    this.connect(this._paletteMenu, 'onClick', showNodeChoice);
    var showOptions = dojo.hitch(this, this._showFloatingPane, this._optionsPane);
    this.connect(this._optionsMenu, 'onClick', showOptions);

    this.connect(this._helpMenu, 'onClick', '_openHelp');

  },

  _connectToolbar : function() {
    this._deleteButton.setDisabled(true);

    this.connect(this._newButton, 'onClick', '_newGraph');
    this.connect(this._downloadButton, 'onClick', '_downloadGraph');

    this.connect(this._editButton, 'onChange', '_toggleEditMode');
    this.connect(this._deleteButton, 'onClick', '_deleteSelection');

    this.connect(this._zoomInButton, 'onClick', '_zoomIn');
    this.connect(this._zoomOutButton, 'onClick', '_zoomOut');
    this.connect(this._zoomAreaButton, 'onChange', '_toggleZoomMode');
    this.connect(this._fitContentButton, 'onClick', '_fitContent');
  },

  _connectInputModes : function() {
    var self = this;
    var deselectZoomAreaButton = function() { self._zoomAreaButton.attr("checked", false); };
    this.connect(this._zoomAreaMode, 'deactivate', deselectZoomAreaButton);

    var selectEditButton = dojo.hitch(this, this._selectButton, this._editButton);
    this.connect(this._editMode, 'onReactivate', selectEditButton);
    this.connect(this._editMode, 'deactivate', '_onDeactivateEditMode');
    this.connect(this._editMode, 'activate', '_onActivateEditMode');
  },

  _connectGraphEvents : function() {
    var graph = this.canvas.getGraph();
    this.connect(graph, 'onNodeCreated', '_refreshOverview');
    this.connect(graph, 'onEdgeCreated', '_refreshOverview');
    this.connect(graph, 'onLabelSet', '_refreshOverview');
    this.connect(graph, 'onNodesMoved', '_refreshOverview');
    this.connect(graph, 'onRemove', '_refreshOverview');
  },

  _connectHierarchyEvents : function() {
    var hierarchy = this._hierarchyManager;
    this.connect(hierarchy, 'onCreateGroup', '_refreshCanvas');
    this.connect(hierarchy, 'onCloseGroup', '_refreshCanvas');
    this.connect(hierarchy, 'onOpenGroup', '_refreshCanvas');
    this.connect(hierarchy, 'onMoveToSubgraph', '_refreshCanvasOnGroupMove');
    this.connect(hierarchy, 'onMoveToParent', '_refreshCanvasOnGroupMove');
    this.connect(hierarchy, 'onSwitchToSubgraph', '_refreshCanvasOnGroupSwitch');
    this.connect(hierarchy, 'onSwitchToParent', '_refreshCanvasOnGroupSwitch');
  },

  _connectContextMenu : function() {
    this.connect(this._contextMenu, 'onOpen', '_contextMenuOpened');
    this.connect(this._zoomInContextMenu, 'onClick', '_zoomIn');
    this.connect(this._zoomOutContextMenu, 'onClick', '_zoomOut');
    this.connect(this._fitContentContextMenu, 'onClick', '_fitContent');
    this.connect(this._deleteContextMenu, 'onClick', '_deleteHover');
    this.connect(this._editLabelContextMenu, 'onClick', '_editLabelHover');
    this.connect(this._openURLContextMenu, 'onClick', '_openURL');
  },

  _connectCanvasEvents : function() {
    this.connect(this.canvas, 'onClickNode', '_onClickNodeOrEdge');
    this.connect(this.canvas, 'onClickEdge', '_onClickNodeOrEdge');
    this.connect(this.canvas, 'onMouseOverNode', '_onMouseOverNodeOrEdge');
    this.connect(this.canvas, 'onMouseOverEdge', '_onMouseOverNodeOrEdge');
    this.connect(this.canvas, 'onMouseOutNode', '_unIndicateURL');
    this.connect(this.canvas, 'onMouseOutEdge', '_unIndicateURL');

    dojo.connect(this.canvas, 'pathSet', this.overview, 'setPath');
  },

  _refreshCanvas : function(id, bounds) {
    this.canvas.refresh(bounds);
    this._refreshOverview();
  },

  _refreshCanvasOnGroupMove : function(id, bounds) {
    this._editMode.getSelection().clear();
    this._refreshCanvas(id, bounds);
  },

  _refreshCanvasOnGroupSwitch : function(id, bounds) {
    this._refreshCanvasOnGroupMove(id, bounds);
    this.canvas.fitContent();
  },

  _viewParent : function() {
    this._hierarchyManager.switchToParent();
  },

  _viewGroup : function() {
    var selectedNodes = this._editMode.getSelection().getNodes();
    if (selectedNodes.length == 1) {
      this._hierarchyManager.switchToSubgraph(selectedNodes[0]);
    }
  },

  _group : function() {
    var selectedNodes = this._editMode.getSelection().getNodes();
    if (selectedNodes.length > 0) {
      var hierarchy = this._hierarchyManager;
      hierarchy.createGroup({ subNodeIds : selectedNodes });
    }
  },

  _ungroup : function() {
    var selectedNodes = this._editMode.getSelection().getNodes();
    if (selectedNodes.length > 0) {
      var hierarchy = this._hierarchyManager;
      for (var i = 0; i < selectedNodes.length; i++) {
        var node = selectedNodes[i];
        var parent = hierarchy.getParent(node);
        if (parent && hierarchy.isGroupNode(parent)) {
          hierarchy.moveToParent([node]);
        }
      }
    }
  },

  _openGroup : function() {
    var selectedNodes = this._editMode.getSelection().getNodes();
    if (selectedNodes.length > 0) {
      var hierarchy = this._hierarchyManager;
      for (var i = 0; i < selectedNodes.length; i++) {
        var node = selectedNodes[i];
        if(hierarchy.isFolderNode(node)) {
          hierarchy.openGroup(node);
        }
      }
    }
  },

  _closeGroup : function() {
    var selectedNodes = this._editMode.getSelection().getNodes();
    if (selectedNodes.length > 0) {
      var hierarchy = this._hierarchyManager;
      for (var i = 0; i < selectedNodes.length; i++) {
        var node = selectedNodes[i];
        if(hierarchy.isGroupNode(node)) {
          hierarchy.closeGroup(node);
        }
      }
    }
  },

  _onDeactivateEditMode : function() {
    this._deselectButton(this._editButton);
    this._deleteButton.setDisabled(true);
    this._paletteMenu.setDisabled(true);
    this._layoutMenu.setDisabled(true);
  },

  _onActivateEditMode : function() {
    this._selectButton(this._editButton);
    this._zoomAreaMode.deactivate();
    this._paletteMenu.setDisabled(false);
    this._layoutMenu.setDisabled(false);
    this._deleteButton.setDisabled(false);
  },

  _initFormatSelection : function () {
    var self = this;
    dojo.xhrGet({
      url: this.baseURL + '/downloadableFormats',
      load: function(list, ioargs) {
        var selection = self._formatSelect;
        for (var idx in list) {
          var entry = list[idx];
          var desc = entry[0];
          var format = entry[1];
          if (format != 'ygf' && format != 'gml' && format != 'tgf') {
            // Do not offer legacy graph formats.
            var option = dojo.doc.createElement('OPTION');
            option.setAttribute('value', format);
            option.appendChild(dojo.doc.createTextNode(desc + " (*." + format + ")"));
            selection.appendChild(option);
          }
        }
      },
      handleAs: "json"
    });
  },

  _downloadGraph : function () {
    this._editMode.deactivate();
    var format = this._formatSelect.value;
    var baseName = this.path;
    var dotIndex = this.path.lastIndexOf('.');
    if (dotIndex > 0) {
      baseName = baseName.substring(0, dotIndex);
    }
    var fileName = baseName + '.' + format;
    var pf = '?path=' + this.path + '&format=' + format;
    var vp;
    with(this.canvas) {
      vp = '&x=' + (-x) + '&y=' + (-y) + '&w=' + width + '&h=' + height + '&z=' + zoom;
    }
    window.location.href = this.baseURL + '/downloadGraph/' + fileName + pf + vp;
  },

  _newGraph : function () {
    var name = '<New Graph>';
    var self = this;
    dojo.xhrPost({
      url: this.baseURL + '/newGraph',
      content : { name : name },
      load: function(res, ioargs) {
        self.setPath(name, true);
      }
    });
  },

  _toggleZoomMode : function() {
    if(this._zoomAreaButton.checked) {
      this._activateZoomArea();
    } else if(this._zoomAreaMode.isActive()) {
      this._zoomAreaMode.deactivate();
    }
  },

  _activateZoomArea : function () {
    if (this._editMode.isActive()) {
      this._deselectButton(this._editButton);
      this._editMode.setChild(this._zoomAreaMode);
    } else {
      this._zoomAreaMode.activate();
    }
  },

  _selectButton : function(button) {
    // summary: set the checked state of the button without firing an event.
    // description: Unfortunately this functionality is no longer present since Dojo 1.0.
    button.checked = true;
    dojo.attr(button.focusNode || button.domNode, "checked", true);
    dijit.setWaiState(button.focusNode || button.domNode, "pressed", true);
		button._setStateClass();
  },

  _deselectButton : function(button) {
    // summary: unset the checked state of the button without firing an event.
    // description: Unfortunately this functionality is no longer present since Dojo 1.0.
    button.checked = false;
    dojo.attr(button.focusNode || button.domNode, "checked", false);
    dijit.setWaiState(button.focusNode || button.domNode, "pressed", false);
		button._setStateClass();
  },

  _zoomIn : function() {
    this.canvas.setZoom(this.canvas.zoom * this.zoomFactor);
    if (this._squelchClickMode.isActive()) {
      this._squelchClickMode.deactivate();
    }
  },

  _zoomOut : function() {
    this.canvas.setZoom(this.canvas.zoom / this.zoomFactor);
    if (this._squelchClickMode.isActive()) {
      this._squelchClickMode.deactivate();
    }
  },

  _fitContent : function() {
    this.canvas.fitContent();
    if (this._squelchClickMode.isActive()) {
      this._squelchClickMode.deactivate();
    }
  },

  _showFloatingPane : function(pane) {
    if(pane.domNode.style.visibility == "hidden") {
      pane.show(function(){ pane.bringToTop(); });
    }
  },

  _toggleEditMode : function() {
    if(!this._editMode.isActive()) {
      this._setEditMode();
    } else {
      this._editMode.deactivate();
    }
  },

  _setEditMode : function() {
    this._zoomAreaMode.deactivate();
    this._editMode.activate();
  },

  _doLayout : function (layoutType) {
    dojo.xhrPost({
      url: this.baseURL + '/layout',
      content : { 'name' : this.path, 'type' : layoutType },
      load : dojo.hitch(this, this._refresh),
      handleAs : 'json'
    });
  },

  _refresh : function(newBounds, ioargs) {
    this._hierarchyManager.refresh();
    this.canvas.refresh(newBounds);
    this.canvas.fitContent();
    this._refreshOverview();
  },

  _changeZoomFactor : function (value) {
    if (!isNaN(value)) {
      this.zoomFactor = value;
    }
  },

  _changeSensitivity : function (newValue) {
    this._sensitivityValue.innerHTML = newValue.toString();
    this._editMode.setEdgeTestSensitivity(newValue);
  },

  _resizeOverview : function() {
    var oBox = dojo.contentBox(this._overviewPane.domNode);
    var oTitleBox = dojo.marginBox(this._overviewPane.focusNode);
    oBox.h -= oTitleBox.h;
    this.overview.resize(oBox);
  },

  _refreshOverview : function() {
    this.overview.refresh();
    this.overview.fitContent();
  },

  _initNodeButtons : function (nodeRealizers) {
    var base = this.baseURL;
    var parent = this._nodeChoice.containerNode;
    for (var idx in nodeRealizers) {
      var type = nodeRealizers[idx];
      
      var img = dojo.doc.createElement('img');
      img.setAttribute('src', base + '/getRealizerImage?type=' + type);
      img.setAttribute('alt', type);
      img.setAttribute('title', type);
      parent.appendChild(img);

      dojo.addClass(img, 'graphEditorNodeType');
      img.setAttribute('dndType', type);
      dojo.addClass(img, 'dojoDndItem');

      dojo.connect(img, 'onclick', this, '_selectNodeType')
    }
    new dojo.dnd.Source(parent, { singular : true });
    new yfiles.client.tiles.widget.GraphEditorNodeDropTarget(
        this.canvas.domNode, { accept : nodeRealizers, copyOnly : true }, this.canvas);
    var nodeChoice = this._nodeChoice;
    nodeChoice.resize({w:200,h:160});
    nodeChoice.close = function() { nodeChoice.hide(); };
    //nodeChoice.hide();
  },

  _createNodePalette : function () {
    var self = this;
    dojo.xhrGet({
      url : this.baseURL + '/getRealizers',
      load : function(data, ioargs) {
        self._initNodeButtons(data.nodeRealizers);
      },
      handleAs : 'json'
    });
  },

  _selectNodeType : function(evt) {
    var container = this._nodeChoice.containerNode;
    for (var idx in container.childNodes) {
      dojo.removeClass(container.childNodes[idx], 'selected');
    }
    var img = evt.target;
    dojo.addClass(img, 'selected');
    this._editMode.nodeType = img.getAttribute('title');
  },

  _openHelp : function () {
    var width = 300;
    var top = 0;
    var height = screen.availHeight;
    var left = screen.availWidth - width;
    window.open(this.baseURL + '/resources/help/GraphEditor', null,
        'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height +
        ',location=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes');
  },

  _contextMenuOpened : function () {
    this._editModeActiveOnMenuOpen = this._editMode.isActive();
    this._editMode.setChild(this._squelchClickMode);
    var info = this.canvas.getLastHitInfo();
    this._lastId = yfiles.client.tiles.HitTest.getHitId(info);
    if (this._lastId && this._editModeActiveOnMenuOpen) {
      this._deleteContextMenu.setDisabled(false);
      var hitType = yfiles.client.tiles.HitTest.getElementType(this._lastId);
      if (hitType == 'Node' || hitType == 'NodeLabel') {
        this._editLabelContextMenu.setDisabled(false);
      } else {
        this._editLabelContextMenu.setDisabled(true);
      }
    } else {
      this._deleteContextMenu.setDisabled(true);
      this._editLabelContextMenu.setDisabled(true);
    }
    this._lastHref = yfiles.client.tiles.HitTest.getUrl(info);
    if(this._lastHref) {
      this._openURLContextMenu.setDisabled(false);
    } else {
      this._openURLContextMenu.setDisabled(true);
    }
  },

  _deleteSelection : function () {
    var selection = this._editMode.getSelection();
    this.canvas.getGraph().remove(selection.get());
  },

  _deleteHover : function () {
    var id = this._lastId;
    if (id) {
      this.canvas.getGraph().remove([id]);
    }
    this._lastId = null;
    if (this._squelchClickMode.isActive()) {
      this._squelchClickMode.deactivate();
    }
  },

  _editLabelHover : function () {
    if (this._squelchClickMode.isActive()) {
      this._squelchClickMode.deactivate();
    }
    var id = this._lastId;
    if (id) {
      this._editMode.editLabel(id);
    }
  },

  _onClickNodeOrEdge : function(id, info, evt) {
    if (!this._editMode.isActive()) {
      this._openURL(info);
    }
  },

  _onMouseOverNodeOrEdge : function(id, info, evt) {
    this._lastHref = yfiles.client.tiles.HitTest.getUrl(info);
    if (this._lastHref) {
      this._indicateURL(info);
    }
  },

  _indicateURL : function(hitInfo) {
    if (!this._editMode.isActive()) {
      this._editMode.setCursor('pointer', 'default');
    }
    var desc = yfiles.client.tiles.HitTest.getDescription(hitInfo);
    var linkDesc = (desc ? desc + ': ' : '') + this._lastHref;
    dojo.publish("yGraphEditorTopic", [ linkDesc ]);
    window.status = linkDesc;
  },

  _unIndicateURL : function() {
    if (!this._editMode.isActive()) {
      this._editMode.restoreCursor();
    }
    window.status = '';
  },

  _openURL : function() {
    if (this._lastHref) {
      window.open(this._lastHref);
    }
  }
});

dojo.declare('yfiles.client.tiles.widget.GraphEditorNodeDropTarget', dojo.dnd.Target, {
  // summary: a special DnD target for dropping graph nodes.
  // description:
  //   dojo.dnd.Target always creates new DOM nodes in the target. This target creates
  //   new graph nodes instead, which do not have a DOM representation. They only appear
  //   on one of the graph images displayed in the GraphCanvas.
  _canvas : null,

  constructor : function(node, params, canvas) {
    this._canvas = canvas;
  },

  insertNodes: function(data, before, anchor){
    if (dojo.isArray(before) && before.length > 0) {
      var coords = this._canvas.getWorldCoordinates();
      this._canvas.getGraph().createNode(coords.x, coords.y, before[0].getAttribute("dndType"));
    }
  }
});