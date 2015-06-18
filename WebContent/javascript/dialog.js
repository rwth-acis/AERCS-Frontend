function Dialog(className){
Dialog._setup();
this._className=className;
this._pd=new pop_dialog(className);
this._pd._dialog_object=this;
}
Dialog.OK={
name:'ok',label:tx('sh:ok-button')};
Dialog.CANCEL={
name:'cancel',label:tx('sh:cancel-button'),className:'inputaux'};Dialog.CLOSE={name:'close',label:tx('sh:close-button')};Dialog.SAVE={name:'save',label:tx('sh:save-button')};Dialog.OK_AND_CANCEL=[Dialog.OK,Dialog.CANCEL];Dialog._STANDARD_BUTTONS=[Dialog.OK,Dialog.CANCEL,Dialog.CLOSE,Dialog.SAVE];Dialog.getCurrent=function(){var stack=generic_dialog.dialog_stack;if(stack.length==0){return null;}
return stack[stack.length-1]._dialog_object||null;};Dialog._basicMutator=function(private_key){return function(value){this[private_key]=value;this._dirty();return this;};};copy_properties(Dialog.prototype,{show:function(){this._showing=true;this._dirty();return this;},hide:function(){this._showing=false;this._pd.fade_out(250);return this;},setTitle:Dialog._basicMutator('_title'),setBody:Dialog._basicMutator('_body'),setAutohide:function(autohide){if(autohide){setTimeout(bind(this,'hide'),autohide);}
return this;},setSummary:Dialog._basicMutator('_summary'),setButtons:function(buttons){if(!(buttons instanceof Array)){buttons=[buttons];}
for(var i=0;i<buttons.length;++i){if(typeof(buttons[i])=='string'){var button=Dialog._findButton(Dialog._STANDARD_BUTTONS,buttons[i]);if(!button){Util.error('Unknown button: '+buttons[i]);}
buttons[i]=button;}}
this._buttons=buttons;this._dirty();return this;},setButtonsMessage:Dialog._basicMutator('_buttons_message'),setStackable:Dialog._basicMutator('_is_stackable'),setHandler:function(handler){this._handler=handler;return this;},setPostURI:function(post_uri){this.setHandler(this._postForm.bind(this,post_uri));return this;},setModal:function(modal){if(modal===undefined){modal=true;}
if(this._showing&&this._modal&&!modal){Util.error("At the moment we don't support un-modal-ing a modal dialog");}
this._modal=modal;return this;},setContentWidth:function(width){this._content_width=width;this._dirty();return this;},setCloseHandler:function(close_handler){this._close_handler=call_or_eval.bind(null,null,close_handler);return this;},setAsync:function(async_request){var handler=function(response){if(this._async_request!=async_request){return;}
this._async_request=null;var payload=response.getPayload();if(typeof(payload)=='string'){this.setBody(payload);}else if(payload.body||payload.title){for(var propertyName in payload){var mutator=this['set'+propertyName.substr(0,1).toUpperCase()
+propertyName.substr(1)];if(!mutator){Util.error("Unknown Dialog property: "+propertyName);}
mutator.call(this,payload[propertyName]);}}else{this.hide();if(payload.closeHandler){call_or_eval(null,payload.closeHandler);}}}.bind(this);var hide=bind(this,'hide');async_request.setHandler(chain(async_request.getHandler(),handler)).setErrorHandler(chain(hide,async_request.getErrorHandler())).setTransportErrorHandler(chain(hide,async_request.getTransportErrorHandler())).send();this._async_request=async_request;return this;},_dirty:function(){if(!this._is_dirty){this._is_dirty=true;bind(this,'_update').defer();}},_update:function(){this._is_dirty=false;if(!this._showing){return;}
if(this._body){var html=[];if(this._title){html.push('<h2><span>'+this._title+'</span></h2>');}
html.push('<div class="dialog_content">');if(this._summary){html.push('<div class="dialog_summary">');html.push(this._summary);html.push('</div>');}
html.push('<div class="dialog_body">');html.push(this._body);html.push('</div>');if(this._buttons||this._buttons_message){html.push('<div class="dialog_buttons">');if(this._buttons_message){html.push('<div class="dialog_buttons_msg">');html.push(this._buttons_message);html.push('</div>');}
if(this._buttons){this._buttons.forEach(function(button){html.push('<input class="inputsubmit '+(button.className||'')+'"'
+' type="button"'
+(button.name?(' name="'+button.name+'"'):'')
+' value="'+htmlspecialchars(button.label)+'"'
+' onclick="Dialog.getCurrent().handleButton(this.name);" />');},this);}
html.push('</div>');}
html.push('</div>');this._pd.show_dialog(html.join(''));}else{var title=this._title||tx('sh:loading');this._pd.show_loading_title(title);}
if(this._modal){this._pd.make_modal();}
if(this._content_width){this._pd.popup.childNodes[0].style.width=(this._content_width+42)+'px';}
this._pd.is_stackable=this._is_stackable;this._pd.close_handler=this._close_handler;},handleButton:function(button){if(typeof(button)=='string'){button=Dialog._findButton(this._buttons,button);}
if(!button){Util.error('Huh?  How did this button get here?');return;}
if(call_or_eval(button,button.handler)===false){return;}
if(button!=Dialog.CANCEL){if(call_or_eval(this,this._handler,{button:button})===false){return;}}
this.hide();},_postForm:function(post_uri,button){var data=this._getFormData();data[button.name]=button.label;var async_request=new AsyncRequest().setURI(post_uri).setData(data);var followup_dialog=new Dialog(this._className).setModal(this._modal).setTitle(this._title).setAsync(async_request);bind(followup_dialog,'show').defer();},_getFormData:function(){var dialog_content_divs=DOM.scry(this._pd.content,'div.dialog_content');if(dialog_content_divs.length!=1){Util.error(dialog_content_divs.length
+" dialog_content divs in this dialog?  Weird.");}
return serialize_form(dialog_content_divs[0]);}});Dialog._findButton=function(buttons,name){for(var i=0;i<buttons.length;++i){if(buttons[i].name==name){return buttons[i];}}
return null;};Dialog._setup=function(){if(Dialog._is_set_up){return;}
Dialog._is_set_up=true;var filter=function(event,type){return KeyEventController.filterEventTypes(event,type)&&KeyEventController.filterEventModifiers(event,type);};KeyEventController.registerKey('ESCAPE',Dialog._handleEscapeKey,filter);};Dialog._handleEscapeKey=function(event,type){var dialog=Dialog.getCurrent();if(!dialog){return true;}
var buttons=dialog._buttons;if(!buttons){return true;}
var cancel_button=Dialog._findButton(buttons,'cancel');if(cancel_button){var button_to_simulate=cancel_button;}else if(buttons.length==1){var button_to_simulate=buttons[0];}else{return true;}
dialog.handleButton(button_to_simulate);return false;}
if(window.Bootloader){Bootloader.done(1);}