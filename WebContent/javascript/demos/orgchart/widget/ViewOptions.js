dojo.provide("demos.orgchart.widget.ViewOptions");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.Form");

dojo.declare("demos.orgchart.widget.ViewOptions", [dijit._Widget, dijit._Templated],  {

  localViewAction : null,
  globalViewAction : null,

  showLocalViewBtn : null,
  showGlobalViewBtn : null,
  showColleaguesCB : null,
  showBusinessUnitsCB : null,

  _globalViewAction : null,

  canvasId : '',
  overviewId : '',

  _canvas : null,
  _overview : null,
  _lateInitHandle : null,
  _selection : null,

  _toggleUnit : null,

  templatePath : dojo.moduleUrl("demos", "orgchart/widget/ViewOptions.html"),
  widgetsInTemplate : true,

  postCreate : function() {

    if (!this._canvas) {
      this._canvas = dijit.byId(this.canvasId);
    }
    if (this._canvas == null) {
      // canvas is not yet created
      this._lateInitHandle = this.connect(dijit.registry, "add", "lateInitialization");
    }

    if (!this._overview ) {
      this._overview = dijit.byId(this.overviewId);
    }
    if (this._overview == null && ! this._lateInitHandle ) {
      // overview is not yet created
      this._lateInitHandle = this.connect(dijit.registry, "add", "lateInitialization");
    }

    if( this._overview && this._canvas ) {
      this.init();
    }
  },

  setSelection : function( selection ) {
    this._selection = selection;
  },

  init : function() {

    this.showColleaguesCB.checked = false;
    this.showBusinessUnitsCB.checked = false;

    var self = this;

    this._globalViewAction = new yfiles.client.tiles.ServerAction({
      url :       '../yFilesAction',
      id :        'yworks.demos.actions.orgChartGlobalViewAction',
      graphName : 'OrgChart',
      canvas :    self._canvas,
      preRun :    function() {
        self._canvas.clear(false);
        self._overview.clear(false);
        var showBusinessUnits = self.showBusinessUnitsCB.checked;
        this.setCustomParameter("" + showBusinessUnits + "," + self._toggleUnit);
        return true;
      },
      postRun : function() {
        if(dojo.isIE) {
          self._canvas.refresh();
          self._overview.refresh();
        }
        self._canvas.fitContent();
        self._overview.fitContent();
        self._toggleUnit = null;
      }
    });

    this.connect( this.showGlobalViewBtn, "onClick", "showGlobalView");
    this.connect( this.showLocalViewBtn, "onClick", function() {
      self.showLocalView( true );
    });

    this.connect( this.showColleaguesCB, "onClick", "layout");
    this.connect( this.showBusinessUnitsCB, "onClick", "layout");
  },

  _createLocalViewAction : function( doFitContent, fixedNodeId ) {

    var self = this;

    var localViewAction = new yfiles.client.tiles.ServerAction({
      url :       '../yFilesAction',
      id :        'yworks.demos.actions.orgChartLocalViewAction',
      graphName : 'OrgChart',
      canvas :    self._canvas,
      selection : self._selection,
      preRun :    function() {
        if (!fixedNodeId) {
          self._canvas.clear(false);
          self._overview.clear(false);
        } else {
          self._canvas.pushTiles();
          self._overview.pushTiles();
        }
        var showColleagues = self.showColleaguesCB.checked;
        var showBusinessUnits = self.showBusinessUnitsCB.checked;
        this.setCustomParameter("" + showColleagues + "," + showBusinessUnits + "," + self._toggleUnit + "," + fixedNodeId );
        return true;
      },
      postRun :   function() {
        if(doFitContent) {
          if(dojo.isIE) {
            self._canvas.refresh();
          }
          self._canvas.fitContent();
        }
        if(fixedNodeId) {
          var shift = dojo.fromJson(this.getCustomResponse());
          self._canvas.refresh(null, shift, true);
          self._overview.refresh(null, shift, true);
        }
        if(dojo.isIE) {
          self._overview.refresh();
        }
        self._overview.fitContent();
        self._toggleUnit = null;
      }
    });

    return localViewAction;
  },

  isGlobalView : function() {
    return this.showGlobalViewBtn.checked;
  },

  isLocalView : function() {
    return this.showLocalViewBtn.checked;
  },

  layout : function( doFitContent, fixedNodeId ) {

    if (this.isGlobalView() ) {
      this.showGlobalView();
    } else {
      this._createLocalViewAction( doFitContent, fixedNodeId ).run();
    }
  },

  showLocalView : function( doFitContent ) {
   
    this.showColleaguesCB.attr("disabled",false);
    this._createLocalViewAction( doFitContent ).run();
  },

  showGlobalView : function() {
    this.showColleaguesCB.attr("disabled",true);
    this._globalViewAction.run();
  },

  toggleBusinessUnit : function( toggleUnit ) {
    this._toggleUnit = toggleUnit;
    this.layout();
  },

  lateInitialization : function(widget) {
    if (widget.id == this.canvasId) {
      this._canvas = widget;
    } else if( widget.id == this.overviewId ) {
      this._overview = widget;
    }

    if( this._overview && this._canvas ) {
      this.disconnect(this._lateInitHandle);
      this.init();
    }
  }

});