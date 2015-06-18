dojo.provide("demos.widget.NetworkMonitorList");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("demos.widget.NetworkMonitorList", [dijit._Widget, dijit._Templated], {

  // summary:	a table view of the node labels, load factors and states.

  networkListTableBody : null,

  stateStrings : ["OK","Warning","Error"],

  templatePath : dojo.moduleUrl("demos", "widget/NetworkMonitorList.html"),

  labels : null,


  updateStatus : function( status )  {

    // summary: update the table view

    // clear the table
    this._removeDOMChildren( this.networkListTableBody );

    var i = 0;

    for( var nodeId in status ) {
      var o = status[nodeId];

      // the node labels have been set when the graph was initially loaded.
      var nodeLabel = null != this.labels ? this.labels[ nodeId ] : "";
      var nodeLoad = o.load;
      var nodeState = o.state;

      // create the table row/table data elements dynamically
      var tableRow = dojo.doc.createElement('tr');

      // store the node id associated with the table row
      tableRow.id = nodeId;

      var tableDataLabel = dojo.doc.createElement('td');
      var labelElement = dojo.doc.createTextNode(nodeLabel);
      tableDataLabel.appendChild( labelElement );
      tableRow.appendChild( tableDataLabel );

      var tableDataLoad = dojo.doc.createElement('td');
      var loadElement = dojo.doc.createTextNode(nodeLoad);
      tableDataLoad.appendChild( loadElement );
      tableRow.appendChild( tableDataLoad );

      var tableDataState = dojo.doc.createElement('td');
      var stateElement = dojo.doc.createTextNode( this.stateStrings[ nodeState ] );
      tableDataState.appendChild( stateElement );
      tableRow.appendChild( tableDataState );

      var styleClass = i%2 == 0 ? "d0" : "d1";
      tableRow.className = styleClass;

      this.networkListTableBody.appendChild( tableRow );
      i++;
    }
  },

  // set the node labels once
  setLabels : function(labels) {
    this.labels = labels;
  },


  onTableClicked : function(e) {

    // summary: when a table cell is clicked,
    //    the corresponding node id is fetched from the parent
    //    table row, and the corresponding callback is called
    //    with the node id.

    var tableCell = e.target;
    var tableRow = tableCell.parentNode;
    if( null != tableRow ) {
      var id = tableRow.id;
      if( null != id ) {
        this.nodeRowClicked( id );
      }
    }
  },

  nodeRowClicked : function( nodeId ) {
    // summary: hook that allows to be notified when a
    // table row is clicked, passing the node id that corresponds to the row.
  },
  
  _removeDOMChildren : function(domNode) {
    while (domNode.hasChildNodes()) {
      this._removeDOMChildren(domNode.firstChild);
      dojo._destroyElement(domNode.firstChild);
    }
  }


});