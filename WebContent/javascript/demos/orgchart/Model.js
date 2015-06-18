dojo.provide("demos.orgchart.Model");

dojo.declare("demos.orgchart.Model", null, {

  _data : null,
  _store : null,
  _rootItem : null,
  _employeeIds : null,

  setData : function( data ) {

   // create a data store model from the json model:
   // each employee object is cloned, replacing the "subordinates" attribute
   // with a "children" attribute in order to adhere to the dojo data store interface

   var treeData = {
          identifier: "nodeId",
          label: "name",
          items : []
        };

    var q = [];
    q.push( data );

    var parents = {};
    var root = null;

    this._employeeIds = [];

    while( q.length > 0 ) {

      var employee = q.pop();

      var treeDataItem = {};
      for( var att in employee ) {
        if( att != "subordinates" ) {
          treeDataItem[ att ] = employee[ att ];
        }
      }
      if( employee.subordinates.length > 0 ) {
        treeDataItem.children = [];
      }

      var parent = parents[ treeDataItem.nodeId ];
      if( null != parent ) {
        parent.children.push( { _reference : treeDataItem.nodeId }  );
        treeDataItem[ "parent" ] = parent.nodeId;
      } else {
        this._rootItem = treeDataItem;
      }

      for( var i=0; i<employee.subordinates.length; i++ ) {
        var subordinate = employee.subordinates[i];
        q.push( subordinate );
        parents[ subordinate.nodeId ] = treeDataItem;
      }

      treeData.items.push( treeDataItem );
      this._employeeIds.push( employee.nodeId );
    }

    this._data = treeData;
    this._store = new dojo.data.ItemFileWriteStore({data: this._data});
  },

  getStore : function() {
    return this._store;
  },

  getRootItem : function() {
    return this._rootItem;
  },

  isEmployee : function( nodeId ) {
    for( var i=0; i<this._employeeIds.length; i++ ) {
      if( this._employeeIds[i] == nodeId ) {
        return true;
      }
    }
    return false;
  }

});