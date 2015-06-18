var CSS={hasClass:function(element,className){if(element&&className&&element.className){return new RegExp('\\b'+trim(className)+'\\b').test(element.className);}
return false;},addClass:function(element,className){if(element&&className){if(!CSS.hasClass(element,className)){if(element.className){element.className+=' '+trim(className);}else{element.className=trim(className);}}}
return this;},removeClass:function(element,className){if(element&&className&&element.className){className=trim(className);var regexp=new RegExp('\\b'+className+'\\b','g');element.className=element.className.replace(regexp,'');}
return this;},setClass:function(element,className){element.className=className;return this;},toggleClass:function(element,className){if(CSS.hasClass(element,className)){return CSS.removeClass(element,className);}else{return CSS.addClass(element,className);}},getStyle:function(element,property){element=$(element);function hyphenate(property){return property.replace(/[A-Z]/g,function(match){return'-'+match.toLowerCase();});}
if(window.getComputedStyle){return window.getComputedStyle(element,null).getPropertyValue(hyphenate(property));}
if(document.defaultView&&document.defaultView.getComputedStyle){var computedStyle=document.defaultView.getComputedStyle(element,null);if(computedStyle)
return computedStyle.getPropertyValue(hyphenate(property));if(property=="display")
return"none";Util.error("Can't retrieve requested style %q due to a bug in Safari",property);}
if(element.currentStyle){return element.currentStyle[property];}
return element.style[property];},setOpacity:function(element,opacity){var opaque=(opacity==1);try{element.style.opacity=(opaque?'':''+opacity);}catch(ignored){}
try{element.style.filter=(opaque?'':'alpha(opacity='+(opacity*100)+')');}catch(ignored){}},getOpacity:function(element){var opacity=get_style(element,'filter');var val=null;if(opacity&&(val=/(\d+(?:\.\d+)?)/.exec(opacity))){return parseFloat(val.pop())/100;}else if(opacity=get_style(element,'opacity')){return parseFloat(opacity);}else{return 1.0;}},Cursor:{kGrabbable:'grabbable',kGrabbing:'grabbing',kEditable:'editable',set:function(element,name){element=element||document.body;switch(name){case CSS.Cursor.kEditable:name='text';break;case CSS.Cursor.kGrabbable:if(ua.firefox()){name='-moz-grab';}else{name='move';}
break;case CSS.Cursor.kGrabbing:if(ua.firefox()){name='-moz-grabbing';}else{name='move';}
break;}
element.style.cursor=name;}}};var has_css_class_name=CSS.hasClass;var add_css_class_name=CSS.addClass;var remove_css_class_name=CSS.removeClass;var toggle_css_class_name=CSS.toggleClass;var get_style=CSS.getStyle;var set_opacity=CSS.setOpacity;var get_opacity=CSS.getOpacity;
if(window.Bootloader){Bootloader.done(1);}