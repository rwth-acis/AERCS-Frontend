/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.data.demos.stores.LazyLoadJSIStore"]){dojo._hasResource["dojox.data.demos.stores.LazyLoadJSIStore"]=true;dojo.provide("dojox.data.demos.stores.LazyLoadJSIStore");dojo.require("dojo.data.ItemFileReadStore");dojo.declare("dojox.data.demos.stores.LazyLoadJSIStore",dojo.data.ItemFileReadStore,{constructor:function(_1){},isItemLoaded:function(_2){if(this.getValue(_2,"type")==="stub"){return false;}return true;},loadItem:function(_3){var _4=_3.item;this._assertIsItem(_4);var _5=this.getValue(_4,"name");var _6=this.getValue(_4,"parent");var _7="";if(_6){_7+=(_6+"/");}_7+=_5+"/data.json";var _8=this;var _9=function(_a){delete _4.type;delete _4.parent;for(var i in _a){if(dojo.isArray(_a[i])){_4[i]=_a[i];}else{_4[i]=[_a[i]];}}_8._arrayOfAllItems[_4[_8._itemNumPropName]]=_4;var _b=_8.getAttributes(_4);for(i in _b){var _c=_8.getValues(_4,_b[i]);for(var j=0;j<_c.length;j++){var _d=_c[j];if(typeof _d==="object"){if(_d["stub"]){var _e={type:["stub"],name:[_d["stub"]],parent:[_5]};if(_6){_e.parent[0]=_6+"/"+_e.parent[0];}_8._arrayOfAllItems.push(_e);_e[_8._storeRefPropName]=_8;_e[_8._itemNumPropName]=(_8._arrayOfAllItems.length-1);_c[j]=_e;}}}}if(_3.onItem){var _f=_3.scope?_3.scope:dojo.global;_3.onItem.call(_f,_4);}};var _10=function(_11){if(_3.onError){var _12=_3.scope?_3.scope:dojo.global;_3.onError.call(_12,_11);}};var _13={url:_7,handleAs:"json-comment-optional"};var d=dojo.xhrGet(_13);d.addCallback(_9);d.addErrback(_10);}});}