dojo.provide("demos.orgchart.widget.PropertiesView");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("demos.orgchart.widget.PropertiesView", [dijit._Widget, dijit._Templated], {

  templatePath : dojo.moduleUrl("demos", "orgchart/widget/PropertiesView.html"),
  _model : null,

  propertiesDiv : null, 
  propertiesTable : null,
  nameCell : null,
  positionCell : null,
  businessUnitCell : null,
  statusCell : null,
  emailCell : null,
  phoneCell : null,
  faxCell : null,

  setSelection : function( selection ) {
    dojo.connect(selection, "onAddNode", this, "onNodeSelected" );
  },

  onNodeSelected : function( nodeId ) {
    var dataStore = this._model.getStore();
    var self = this;

    var fetchArgs = {
      query : {
        nodeId : nodeId
      },
      onComplete : function(items, request) {
        if( items.length == 1 ) {
          var item =  items[0];
          self._showProperties( item );
        }
      }
    };

    dataStore.fetch( fetchArgs );
  },

  setModel : function( model ) {
    this._model = model;
  },

  _showProperties : function( item ) {

    var dataStore = this._model.getStore();
    var attributes = dataStore.getAttributes( item );

    for( var i=0; i<attributes.length; i++ ) {

      var attribute = attributes[i];
      if( attribute != "children"
          && attribute != "parent"
          && attribute != "nodeId" ) {

        var td = this[ attribute + "Cell" ];
        if( td ) {
          var val = dataStore.getValue( item, attribute );
          this._removeDOMChildren(td);
          td.appendChild( dojo.doc.createTextNode( val ) );
        }
      }
    }
  },

   _removeDOMChildren : function(domNode) {
    while (domNode.hasChildNodes()) {
      this._removeDOMChildren(domNode.firstChild);
      dojo._destroyElement(domNode.firstChild);
    }
  }


});