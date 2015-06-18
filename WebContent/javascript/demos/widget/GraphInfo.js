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

dojo.provide("demos.widget.GraphInfo");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare('demos.widget.GraphInfo', [dijit._Widget, dijit._Templated],
{
// widget settings
  templateString: '<div class="graphInfo" dojoAttachPoint="mainNode"><div class="customHeading" dojoAttachPoint="containerNode"></div><div class="infoHeading" dojoAttachPoint="infoHeading"></div><div class="infoBody" dojoAttachPoint="infoBody"></div></div>',

// domNodes
  infoHeading : null,
  infoBody : null,

// widget attributes
  path : '',
  basePath : '',
  baseURL : '.',
  tooltip : false,

// internal fields
  showPrefix : null,
  currentPath : null,

  postCreate : function() {
    this.showPrefix = "dijit.byId('" + this.id + "').showInfo('";
    if (this.path != '' || this.basePath != '') {
      this.showInfo(this.path);
    }
  },

  setHeading : function(title) {
    this.containerNode.innerHTML = title;
  },

  showInfo : function (path, basePath) {
    var newPath = path;
    if (path && path.charAt(path.length - 1) == "/") {
      newPath = path.slice(0, path.length - 1);
    }
    this.path = newPath;
    var newBasePath = basePath;
    if (basePath) {
      if (basePath.charAt(basePath.length - 1) == "/") {
        newBasePath = basePath.slice(0, basePath.length - 1);
      }
      this.basePath = newBasePath;
    }
    if (this.path != '') {
      this.currentPath = this.basePath + '/' + this.path;
    } else {
      this.currentPath = this.basePath;
    }
    this._createInfoHeading(this.path);
    this.beforeRequest();
    var self = this;
    var method = dojo.isIE ? dojo.xhrPost : dojo.xhrGet;
    method({
      url: this.baseURL + '/' + this.currentPath,
      load: dojo.hitch(this, this._createInfoBody),
      error: function(response, ioargs) {
        self.requestDone(false);
      },
      handleAs: "json"});
  },

  gotoNodeURL : function( path ) {

     this.beforeRequest();
      dojo.xhrPost({
        url: this.baseURL + '/' + path,
        load: dojo.hitch(this, this._gotoNodeURL),
        error: function(response, ioargs) {
          self.requestDone(false);
        },
        handleAs: "json"});
  },

  _gotoNodeURL : function( info, ioargs ) {
    this.requestDone(true);
    if( null != info["URL"] ) {
      window.open( info["URL"] );
    }
  },

  refresh : function() {
    this.beforeRequest();
    if (this.currentPath) {
      dojo.xhrPost({
        url: this.baseURL + '/' + this.currentPath,
        load: dojo.hitch(this, this._createInfoBody),
        error: function(response, ioargs) {
          self.requestDone(false);
        },
        handleAs: "json"});
    }
  },

  beforeRequest : function() {
    // summary: hook for listeners called before a server request
  },

  requestDone : function(/*Boolean*/ success) {
    // summary: hook for listeners called before a server request
    //
    // success: whether the request succeeded
  },

  _createInfoHeading : function(path) {

    if( ! this.tooltip ) {
      var pathParts = path.split("/");
      var cumulated = '';
      this._removeChildren(this.infoHeading);
      for (var partId in pathParts) {
        var part = pathParts[partId];
        cumulated += part + '/';
        var printKey = part.replace(/_/g, " ");
        var script = this.showPrefix + cumulated + "');";
        var link = dojo.doc.createElement('A');
        link.setAttribute('href', 'javascript:' + script);
        link.appendChild(dojo.doc.createTextNode(part));
        this.infoHeading.appendChild(link);
        this.infoHeading.appendChild(dojo.doc.createTextNode('/'));
      }
    }
  },

  _createInfoBody : function(info, ioargs) {
    this.requestDone(true);

    if(this.tooltip && info["Description"] != null) {

      var description = info["Description"];
      this.infoBody.appendChild(dojo.doc.createTextNode(description));

    } else {

      this._removeChildren(this.infoBody);
      var tab = dojo.doc.createElement('TABLE');
      dojo.addClass(tab, 'infoTable');
      var tbody = dojo.doc.createElement('TBODY');
      tab.appendChild(tbody);
      dojo.addClass(tbody, 'infoBody');
      var classes = [ 'even', 'odd' ];
      var count = 0;
      for (var key in info) {
        var val = info[key];
        var printKey = key.replace(/_/g, " ");
        var row = dojo.doc.createElement('TR');
        dojo.addClass(row, 'infoBodyRow');
        dojo.addClass(row, classes[count++ % 2]);
        tbody.appendChild(row);
        var leftCell = dojo.doc.createElement('TD');
        var rightCell = dojo.doc.createElement('TD');
        row.appendChild(leftCell);
        dojo.addClass(leftCell, 'infoKey');
        row.appendChild(rightCell);
        dojo.addClass(rightCell, 'infoValue');
        if (val == 'folder') {
          leftCell.appendChild(dojo.doc.createTextNode(printKey));
          var newPath = (this.path == '') ? key : this.path + '/' + key;
          var script = this.showPrefix + newPath + "');";
          var link = dojo.doc.createElement('A');
          link.setAttribute('href', 'javascript:' + script);
          link.appendChild(dojo.doc.createTextNode(newPath));
          rightCell.appendChild(link);
        } else if (dojo.isString(val) && val.slice(0,7) == 'link://') {
          leftCell.appendChild(dojo.doc.createTextNode(printKey));
          var newPath = val.substring(7);
          var script;
          if (newPath.length > this.basePath.length && newPath.slice(0, this.basePath.length) == this.basePath) {
            newPath = newPath.substring(this.basePath.length + 1);
            script = this.showPrefix + newPath + "');";
          } else {
            script = this.showPrefix + newPath + "','');"
          }
          var link = dojo.doc.createElement('A');
          link.setAttribute('href', 'javascript:' + script);
          link.appendChild(dojo.doc.createTextNode(newPath));
          rightCell.appendChild(link);
        } else if( dojo.isString(val) && val.slice(0,7) == 'http://' ){
          leftCell.appendChild(dojo.doc.createTextNode(printKey));
          var link = dojo.doc.createElement('A');
          link.setAttribute('href', val);
          link.setAttribute('target', '_blank');
          link.appendChild(dojo.doc.createTextNode(val));
          rightCell.appendChild(link);
        } else {
          leftCell.appendChild(dojo.doc.createTextNode(printKey));
          rightCell.appendChild(dojo.doc.createTextNode(val));
        }
        this.infoBody.appendChild(tab);
      }
    }
  },

  _removeChildren : function(domNode) {
    while(domNode.hasChildNodes()) {
      domNode.removeChild(domNode.firstChild);
    }
  }
});