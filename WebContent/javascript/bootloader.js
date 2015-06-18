if(!window.Bootloader){window.copy_properties=function(u,v){for(var k in v){u[k]=v[k];}
if(v.hasOwnProperty&&v.hasOwnProperty('toString')&&(v.toString!==undefined)&&(u.toString!==v.toString)){u.toString=v.toString;}
return u;}
window.Bootloader={loadResource:function(rsrc){var b=window.Bootloader;if(rsrc.name){if(b._loaded[rsrc.name]){return;}
b._loaded[rsrc.name]=true;}
var tgt=b.getHardpoint();switch(rsrc.type){case'js':++b._pending;var script=document.createElement('script');script.src=rsrc.src;script.type='text/javascript';tgt.appendChild(script);break;case'css':var link=document.createElement('link');link.rel="stylesheet";link.type="text/css";link.media="all"
link.href=rsrc.src;tgt.appendChild(link);break;}},wait:function(wait_fn){var b=window.Bootloader;if(b._pending){b._wait.push(wait_fn);}else{wait_fn();}},done:function(num){var b=window.Bootloader;if(!b._ready){return;}
var b=window.Bootloader;b._pending-=num;if(!b._pending){var wait=b._wait;b._wait=[];for(var ii=0;ii<wait.length;ii++){wait[ii]();}}},getHardpoint:function(){var b=window.Bootloader;if(!b._hardpoint){var n,heads=document.getElementsByTagName('head');if(heads.length){n=heads[0];}else{n=document.body;}
b._hardpoint=n;}
return b._hardpoint;},_loaded:{},_pending:0,_hardpoint:null,_wait:[],_ready:false};}
if(window.Bootloader){Bootloader.done(1);}