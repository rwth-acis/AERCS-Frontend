function findX(obj)
{var curleft=0;if(obj.offsetParent){while(obj.offsetParent){curleft+=obj.offsetLeft
obj=obj.offsetParent;}}
else if(obj.x)
curleft+=obj.x;return curleft;}
function findY(obj)
{var curtop=0;if(obj.offsetParent){while(obj.offsetParent){curtop+=obj.offsetTop
obj=obj.offsetParent;}}
else if(obj.y)
curtop+=obj.y;return curtop;}
function mousePosX(e)
{var posx=0;if(!e)var e=window.event;if(e.pageX)
posx=e.pageX;else if(e.clientX&&document.body.scrollLeft)
posx=e.clientX+document.body.scrollLeft;else if(e.clientX&&document.documentElement.scrollLeft)
posx=e.clientX+document.documentElement.scrollLeft;else if(e.clientX)
posx=e.clientX;return posx;}
function mousePosY(e)
{var posy=0;if(!e)var e=window.event;if(e.pageY)
posy=e.pageY;else if(e.clientY&&document.body.scrollTop)
posy=e.clientY+document.body.scrollTop;else if(e.clientY&&document.documentElement.scrollTop)
posy=e.clientY+document.documentElement.scrollTop;else if(e.clientY)
posy=e.clientY;return posy;}
function dp(object)
{var descString;for(var value in object)
descString+=(value+" => "+object[value]+"\n");if(descString!="")
aiert(descString);else
aiert(object);}
function dpd(debugOutput)
{if(ge('debugout')){$('debugout').style.overflow="auto";$('debugout').innerHTML=debugOutput+"<br>"+ge('debugout').innerHTML;}}
function bigprint(object)
{var descString;for(var value in object)
descString+=(value+" => "+object[value]+"\n");if(descString!="")
dpd(descString);else
dpd("bigprint failed "+object);}
var debugStartTime;function dtime(marker)
{endTime=new Date();dpd(marker+" "+(debugStartTime.getTime()-endTime.getTime()));debugStartTime=endTime;}
function dtimestart()
{debugStartTime=new Date();}
if(window.Bootloader){Bootloader.done(1);}