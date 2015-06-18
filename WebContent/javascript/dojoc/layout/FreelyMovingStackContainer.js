// all packages need to dojo.provide() _something_, and only one thing
dojo.provide("dojoc.layout.FreelyMovingStackContainer");

dojo.require("dijit.layout.StackContainer");

// our declared class
dojo.declare(
	"dojoc.layout.FreelyMovingStackContainer",
        dijit.layout.StackContainer,
        {
	first: function(){
		tmp = this.getChildren();
		this.selectChild(tmp[0]);
	},
	last: function(){
		tmp = this.getChildren();
		this.selectChild(tmp[tmp.length - 1]);
	},
	goto: function(page){
		tmp = this.getChildren();
		this.selectChild(tmp[page-1]);
	},
});