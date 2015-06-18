function multifriend_selector(friend_info,form_id,max_selections,num_rows,num_cols,selected_ids){this.num_rows=num_rows;this.friend_info=friend_info;this.form=ge(form_id);this.max=max_selections;this.paginate=ua.ie();this.page=0;this.total_items=0;this.num_per_page=this.num_rows*num_cols;this.cur_view='all';this.num_selected=0;this.selected_ids={};this.last_clicked=null;this.cur_network=0;this.cur_network_name='';this.cur_list=0;this.cur_list_name='';this.cur_list_members={};this.notice_id='fb_multi_friend_selector_notice';this.set_view(this.cur_view);this.update_counters(0);if(selected_ids){for(var i=0;i<selected_ids.length;++i){this.select(selected_ids[i]);}}
this.force_reset();}
multifriend_selector.prototype.set_typeahead=function(fsth){this.fsth=fsth;}
multifriend_selector.prototype.force_reset=function(){this.dirty=true;setTimeout(this.reset.bind(this),0);}
multifriend_selector.prototype.force_reset_now=function(){this.dirty=true;this.reset();}
multifriend_selector.prototype.reset=function(){if(!this.dirty){return;}
this.filters=[];if(this.cur_view=='unselected'){this.filters.push(function(id,info){return!this.selected_ids[id];}.bind(this));}else if(this.cur_view=='selected'){this.filters.push(function(id,info){return this.selected_ids[id];}.bind(this));}
if(this.cur_network){this.filters.push(function(id,info){return info.networks[this.cur_network];}.bind(this));}
if(this.cur_list){this.filters.push(function(id,info){return this.cur_list_members[id];}.bind(this));}
if(this.search_filter){this.filters.push(this.search_filter);}
this.page=0;this.update_boxes();this.dirty=false;}
multifriend_selector.prototype.set_search_filter=function(filter){this.search_filter=filter;this.force_reset();}
multifriend_selector.prototype.get_matching_friends=function(){var friends=[];for(var id in this.friend_info){for(var i=0;i<this.filters.length;i++){if(!this.filters[i](id,this.friend_info[id])){break;}}
if(i==this.filters.length){friends.push(id);}}
this.total_items=friends.length;return friends;}
multifriend_selector.prototype.update_boxes=function(){var friends=this.get_matching_friends();var lis=[];for(var i=0;i<friends.length;i++){if(!this.paginate||(i>=this.num_per_page*this.page&&i<this.num_per_page*(this.page+1))){lis.push(this.render_friend_box(friends[i]));}}
$('friends').innerHTML=lis.join('');if(this.paginate){$('pag_nav_links').innerHTML=this.render_paginator();}
if(this.total_items==0&&this.cur_view!='all'){if(this.cur_view=='unselected'){this.notice_show(tx('mfs02'),true);}else if(this.cur_view=='selected'){this.notice_show(tx('mfs04'),true);}}}
multifriend_selector.prototype.render_friend_box=function(id){var friend=this.friend_info[id];if(this.fsth&&this.fsth.cur_str){var name=typeahead_source.highlight_found(friend.sname,this.fsth.cur_str);}else{var name=friend.sname;}
var result=['<li userid="',id,(this.selected_ids[id]?'" class="selected':''),'">','<a href="#" onclick="fs.click(this.parentNode); return false;">','<span class="square" style="background-image: url(',friend.pic,');"><span></span></span>','<strong>',name,'</strong>'];if(name.split(' ').length<4){result.push('<span class="network">',friend.pr_net,'</span>');}
result.push('</a></li>');return result.join('');}
multifriend_selector.prototype.render_paginator=function(){var result=[];var num_pages=parseInt(this.total_items/this.num_per_page+.999);if(this.page>0){result.push('<li><a href="#" onclick="return fs.prev_page();">Prev</a></li>');}
for(var i=Math.max(0,this.page-2);i<=Math.min(num_pages-1,this.page+2);i++){result.push('<li',(i==this.page?' class="current"':''),'><a href="#" onclick="return fs.goto_page(',i,');">',i+1,'</a></li>');}
if(this.page<num_pages-1){result.push('<li><a href="#" onclick="return fs.next_page();">Next</a></li>');}
return result.join('');}
multifriend_selector.prototype.goto_page=function(page){this.page=page;if(this.page<0){this.page=0;}else if(this.page*this.num_per_page>=this.total_items){this.page=parseInt(this.total_items/this.num_per_page+.999);}
this.update_boxes();return false;}
multifriend_selector.prototype.prev_page=function(){return this.goto_page(this.page-1);}
multifriend_selector.prototype.next_page=function(){return this.goto_page(this.page+1);}
multifriend_selector.prototype.set_view=function(v){this.network_reset();$('view_selected').className='';$('view_unselected').className='';$('view_all').className='';if(ge('view_'+v)){$('view_'+v).className='view_on';}
this.cur_view=v;if(this.fsth){this.fsth.reset_search(true);}
this.force_reset();}
multifriend_selector.prototype.click=function(li){var uid=li.getAttribute('userid');if(this.cur_view.indexOf('selected')>=0&&uid==this.last_clicked){set_opacity(li,1);window.clearTimeout(fx.timer_id);}
if(!this.selected_ids[uid]){if(this.max<0||this.num_selected<this.max){li.className='selected';this.select(uid);if(this.cur_view=='unselected'){fx.doFadeOut(li,true);}}else if(this.max>=0){if(this.max==1){this.notice_show(tx('mfs16',{'maximum':this.max}),true);}else{this.notice_show(tx('mfs03',{'maximum':this.max}),true);}}}else{li.className='';this.unselect(uid);if(this.cur_view=='selected'){fx.doFadeOut(li,true);}}
if(this.cur_view=='selected'&&this.num_selected<=0){this.notice_show(tx('mfs04'),false);}
this.display_limit();this.last_clicked=uid;}
multifriend_selector.prototype.select=function(id){var elem=document.createElement('input');elem.setAttribute('fb_protected','true');elem.type='hidden';elem.name='ids[]';elem.value=id;this.form.appendChild(elem);this.selected_ids[id]=elem;this.update_counters(1);}
multifriend_selector.prototype.unselect=function(id){this.form.removeChild(this.selected_ids[id]);delete this.selected_ids[id];this.update_counters(-1);}
multifriend_selector.prototype.update_counters=function(n){this.num_selected+=n;this.num_unselected-=n;$('view_selected_count').innerHTML=this.num_selected;}
multifriend_selector.prototype.display_limit=function(){var remainder=this.max-this.num_selected;show('max_limit_notice');if(remainder>0&&remainder<=3){$('max_limit_notice').style.color='#f60';$('max_limit_notice').innerHTML=tx('mfs05',{'remaining-friends':remainder});}else if(this.max>=0&&remainder<=0){$('max_limit_notice').style.color='#C90000';$('max_limit_notice').innerHTML=tx('mfs06',{'limit':this.max});}else{$('max_limit_notice').innerHTML='';}}
multifriend_selector.prototype.view=function(type){this.set_view(type);this.notice_hide();if(this.cur_network>0){this.network_filter(this.cur_network,this.cur_network_name);return;}
this.force_reset();}
multifriend_selector.prototype.network_filter=function(nid,nname){this.set_view('all');this.network_reset();this.cur_network=nid;this.cur_network_name=nname;if(this.fsth){this.fsth.reset_search(true);}
this.force_reset_now();var filter_text=[];if(this.max<0||this.total_items+this.num_selected<=this.max){filter_text.push('<a href="#" onClick="fs.select_all();return false;" class="select">Select All</a>');}
filter_text.push('<a href="#" class="hide" onClick="fs.network_clear(); return false;"></a> ');if(this.total_items==1){filter_text.push(tx('mfs07',{'network':nname}));}else{filter_text.push(tx('mfs08',{'count':this.total_items,'network':nname}));}
this.display_filter(filter_text.join(''));}
multifriend_selector.prototype.display_filter=function(text){show('fs_current_filter');$('fs_current_filter').innerHTML=text;}
multifriend_selector.prototype.network_reset=function(){hide('fs_current_filter');$('fs_current_filter').innerHTML='';this.cur_network=0;this.cur_network_name='';this.cur_list=0;this.cur_list_name='';this.cur_list_members={};this.force_reset();}
multifriend_selector.prototype.network_clear=function(){this.network_reset();this.view('all');}
multifriend_selector.prototype.list_filter=function(flid,name,members){this.set_view('all');this.network_reset();this.cur_list=flid;this.cur_list_name=name;var len=members.length;for(var i=0;i<len;++i){this.cur_list_members[members[i]]=1;}
if(this.fsth){this.fsth.reset_search(true);}
this.force_reset_now();var filter_text=[];if(this.max<0||this.total_items+this.num_selected<=this.max){filter_text.push('<a href="#" onClick="fs.select_all();return false;" class="select">Select All</a>');}
filter_text.push('<a href="#" class="hide" onClick="fs.network_clear(); return false;"></a> ');if(this.total_items==1){filter_text.push(tx('mfs13',{'list':name}));}else{filter_text.push(tx('mfs14',{'count':this.total_items,'list':name}));}
this.display_filter(filter_text.join(''));}
multifriend_selector.prototype.select_all=function(){var friends=this.get_matching_friends();if(friends.length<=this.max){for(var i=0;i<friends.length;i++){var uid=friends[i];if(!this.selected_ids[uid]){this.select(uid);}}}
this.update_boxes();}
multifriend_selector.prototype.unselect_all=function(){var friends=this.get_matching_friends();if(friends.length<=this.max){for(var i=0;i<friends.length;i++){var uid=friends[i];if(this.selected_ids[uid]){this.unselect(uid);}}}
this.update_boxes();}
multifriend_selector.prototype.notice_show=function(text,fade){$(this.notice_id).innerHTML=text;show(this.notice_id);set_opacity(ge(this.notice_id),1);if(fade==true){var t=setTimeout('fx.doFadeOut(\'fb_multi_friend_selector_notice\', false);',2500);}}
multifriend_selector.prototype.notice_hide=function(){hide(this.notice_id);}
multifriend_selector.prototype.skip=function(){document.location=get_form_attr(this.form,'action');}
multifriend_selector.prototype.show_force_invite_dialog=function(app_id,uninstalled){this.dialog=new pop_dialog();this.dialog.is_stackable=true;this.dialog.show_dialog('<div class="dialog_loading">'+tx('sh:loading')+' </div>');var exit_text;if(uninstalled){exit_text=tx('mfs15');}else{exit_text=tx('mfs11');}
this.onResponse=function(asyncResponse){var payload=asyncResponse.getPayload();if(payload['status']){this.dialog.show_choice(payload['dialog_title'],payload['dialog_contents'],exit_text,function(){this.onResponsePost=function(asyncResponsePost){var payloadPost=asyncResponsePost.getPayload();generic_dialog.get_dialog(this).show_message(payloadPost['dialog_title'],payloadPost['dialog_contents']);if(payloadPost['status']){window.location.href='/home.php';}};new AsyncRequest().setURI('/fbml/ajax/force_invite.php').setData({'app_id':app_id,'remove':1}).setHandler(bind(this,'onResponsePost')).setErrorHandler(function(response){}).send();},exit_text=tx('mfs12'),function(){new AsyncRequest().setURI('/fbml/ajax/force_invite.php').setData({'app_id':app_id,'continue':1}).setHandler(function(response){}).setErrorHandler(function(response){}).send();generic_dialog.get_dialog(this).fade_out(100);});}else{this.dialog.show_message(payload['dialog_title'],payload['dialog_contents']);}};new AsyncRequest().setURI('/fbml/ajax/force_invite.php').setData({'app_id':app_id}).setHandler(bind(this,'onResponse')).setErrorHandler(bind(this,'onError')).send();return false;}
multifriend_selector.prototype.filter_menu_open=function(){setTimeout(function(){$('friends').style.overflow='hidden';}.bind(this),1);}
multifriend_selector.prototype.filter_menu_close=function(){$('friends').style.overflow='auto';}
function multifriend_selector_typeahead(obj,items,fs){this.cur_str='';this.clear_div=null;this.focused=false;this.obj=obj;this.obj.typeahead=this;this.items=items;this.fs=fs;this.fs.set_typeahead(this);addEventBase(this.obj,'focus',this._onfocus.bind(this));addEventBase(this.obj,'blur',this._onblur.bind(this));addEventBase(this.obj,'keyup',function(event){var e=event?event:window.event;var keycode=e?e.keyCode:-1;setTimeout(function(){return this._onkeyup(keycode);}.bind(this),0);}.bind(this));this.capture_submit();this.first_letter_index={};for(var id in items){var name=typeahead_source.tokenize(items[id].name);for(var token=0;token<name.length;token++){if(!this.first_letter_index[name[token][0]]){this.first_letter_index[name[token][0]]={};}
this.first_letter_index[name[token][0]][id]=true;}}}
multifriend_selector_typeahead.prototype={_onfocus:function(e)
{this.focused=true;this.capture_submit();if(this.fs&&this.fs.cur_view!='all'){this.fs.view('all');}},_onblur:function(e)
{this.focused=false;if(this.cur_str==''){this.hide_clear();}},_onkeyup:function(keycode)
{switch(keycode){case 27:return false;break;case undefined:case 37:case 38:case 39:case 40:return false;break;case 13:this.select();break;case 8:case 0:default:if(this.search()){this.reset_search(false,false);}else if(this.obj.value&&this.fs){this.fs.network_reset();}
break;}},capture_submit:function()
{if((!this.captured_form||this.captured_substitute!=this.captured_form.onsubmit)&&this.obj.form){this.captured_form=this.obj.form;this.captured_event=this.obj.form.onsubmit;this.captured_substitute=this.obj.form.onsubmit=function(){return false;}.bind(this.obj.form);}},reset_search:function(clear,pause)
{if(!this.obj){return false;}
var textInputController=this.obj.getControl();var value=textInputController.getValue();if(!value||clear){this.cur_str='';if(value){textInputController.clear();this._onblur();textInputController.setFocused(false);}}
if(pause==true){var delay=fx.timer_delay*10;window.setTimeout("fsth.show_all()",delay);}else{this.show_all();}},show_all:function(){this.fs.set_search_filter(null);},search:function()
{var str=typeahead_source.flatten_string(this.obj.value);if(str==this.cur_str){return false;}
this.cur_str=str;var tokenized_str=typeahead_source.tokenize(str).sort(typeahead_source._sort);if(!tokenized_str[0]){return true;}
var quick_index=this.first_letter_index[tokenized_str[0][0]];this.show_clear();this.fs.set_search_filter(function(id,info){return quick_index[id]&&typeahead_source.check_match(tokenized_str,info.name);});return false;},show_clear:function()
{if(this.clear_div==null){this.clear_div=document.createElement('div');this.clear_div.setAttribute('id','clear_finder');this.clear_div.innerHTML='<a href="#" onClick="fsth.reset_search(true);return false;" class="hide"></a>';$('finder').appendChild(this.clear_div);}},hide_clear:function()
{if(ge('clear_finder')){this.clear_div=null;$('finder').removeChild(ge('clear_finder'));}},select:function()
{if(this.fs.total_items==1){this.fs.click($('friends').firstChild);this.obj.value='';this.reset_search(true,this.fs.cur_view!='all');}}};function condensed_multifriend_selector(friend_info,form_id,max_selections,unselected_rows,selected_rows){this.parent.construct(this,friend_info,form_id,max_selections,0,[]);this.paginate=false;this.unselected_rows=unselected_rows;this.selected_rows=selected_rows;}
condensed_multifriend_selector.extend(multifriend_selector);condensed_multifriend_selector.prototype.set_typeahead=function(typeahead){this.parent.set_typeahead(typeahead);this.unselected_list=typeahead.obj.parentNode.nextSibling;if(this.selected_rows==0){this.onebox=true;}else{this.selected_list=this.unselected_list.nextSibling;this.onebox=false;}
this.total_items=0;for(var i=0;i<this.unselected_list.childNodes.length;i++){var friendNode=this.unselected_list.childNodes[i];friendNode.cb=friendNode.firstChild;friendNode.cb.checked=false;friendNode.name_span=friendNode.lastChild;friendNode.onclick=function(){this.parentNode.parentNode.cmfs.toggle(this.cb.value);};this.friend_info[friendNode.cb.value].unselected=friendNode;this.total_items++;}
if(!this.onebox){for(var i=0;i<this.selected_list.childNodes.length;i++){var friendNode=this.selected_list.childNodes[i];friendNode.cb=friendNode.firstChild;friendNode.cb.checked=false;friendNode.name_span=friendNode.lastChild;friendNode.onclick=function(){this.parentNode.parentNode.cmfs.toggle(this.cb.value);};this.friend_info[friendNode.cb.value].selected=friendNode;this.total_items++;}
this.nobody=document.createElement('div');this.nobody.className='nobody_selected';this.nobody.innerHTML=tx('mfs09');this.selected_list.appendChild(this.nobody);}
this.container=typeahead.obj.parentNode.parentNode;this.container.cmfs=this;this.toomany=document.createElement('div');this.toomany.className='toomany_selected';if(this.max==1){this.toomany.innerHTML=tx('mfs17',{'maximum':this.max});}else{this.toomany.innerHTML=tx('mfs10',{'maximum':this.max});}
this.container.appendChild(this.toomany);hide(this.toomany);this.check_sizes();window.setInterval(this.check_sizes.bind(this),100);this.container.style.visibility='visible';this.force_reset();}
condensed_multifriend_selector.prototype.check_sizes=function(){if(this.container.offsetWidth==this.container_width){return;}
this.container_width=this.container.offsetWidth;var cb_elem=this.unselected_list.firstChild;var cb_height=cb_elem&&cb_elem.offsetHeight?cb_elem.offsetHeight:19;this.unselected_list.style.height=cb_height*this.unselected_rows+'px';if(!this.onebox){var x_height=15;this.selected_list.style.height=x_height*this.selected_rows+'px';}
if(ua.safari()<500){var input_padding=0;}else{var input_padding=6;}
this.fsth.obj.style.width=(this.container.offsetWidth-input_padding-2)+'px';show(this.toomany);this.toomany.style.top=parseInt(this.unselected_list.offsetTop+
(this.unselected_list.offsetHeight-this.toomany.offsetHeight)/2)+'px';hide(this.toomany);}
condensed_multifriend_selector.prototype.check_match=function(id,friend){for(var i=0;i<this.filters.length;i++){if(!this.filters[i](id,friend)){return false;}}
return true;}
condensed_multifriend_selector.prototype.update_match=function(friend){this.total_items++;if(this.fsth&&this.fsth.cur_str){var name=typeahead_source.highlight_found(friend.name,this.fsth.cur_str);}else{var name=friend.name;}
friend.unselected.name_span.innerHTML=name;this.show(friend.unselected);}
condensed_multifriend_selector.prototype.update_boxes=function(){if(typeof this.onebox=='undefined'){return;}
this.total_items=0;this.last_showing=null;for(var id in this.friend_info){var friend=this.friend_info[id];if(friend.checked&&!this.onebox){continue;}
if(this.check_match(id,friend)){this.update_match(friend);}else{this.hide(friend.unselected);}}}
condensed_multifriend_selector.prototype.show=function(elem){show(elem);this.last_showing=elem;}
condensed_multifriend_selector.prototype.hide=hide;condensed_multifriend_selector.prototype.toggle=function(id){var friend=this.friend_info[id];if(this.onebox){if(!friend.checked&&!friend.unselected.cb.checked||friend.checked&&friend.unselected.cb.checked){return;}}else{if(!friend.checked&&!friend.unselected.cb.checked){return;}
if(ua.firefox()&&friend.checked&&friend.selected.cb.checked){return;}}
friend.checked=!friend.checked;if(friend.checked){if(this.num_selected==this.max){show(this.toomany);set_opacity(this.toomany,1);setTimeout(function(){fx.doFadeOut(this.toomany,false);}.bind(this),2500);friend.checked=false;friend.unselected.cb.checked=false;return false;}
this.num_selected++;}else{this.num_selected--;}
if(this.onebox){toggle_css_class_name(friend.unselected,'selected');}else if(friend.checked){this.total_items--;hide(this.nobody);hide(friend.unselected);friend.unselected.cb.checked=false;friend.selected.cb.checked=true;show(friend.selected);}else{if(!this.num_selected){show(this.nobody);}
this.hide(friend.selected);if(!ua.opera()&&!(ua.safari()>=500)){friend.selected.cb.checked=false;}
if(this.check_match(id,friend)){this.update_match(friend);}}}
condensed_multifriend_selector.prototype.network_reset=function(){}
condensed_multifriend_selector.prototype.set_view=function(){}
condensed_multifriend_selector.prototype.update_counters=function(){}
function condensed_mfs_typeahead(obj,items,fs){this.parent.construct(this,obj,items,fs);this.clear_div=document.createElement('div');this.clear_div.className='hide';this.clear_div.onclick=function(){this.reset_search(true,false);return false;}.bind(this);hide(this.clear_div);this.obj.parentNode.insertBefore(this.clear_div,this.obj);}
condensed_mfs_typeahead.extend(multifriend_selector_typeahead);condensed_mfs_typeahead.prototype.show_clear=function(){show(this.clear_div);}
condensed_mfs_typeahead.prototype.hide_clear=function(){hide(this.clear_div);}
condensed_mfs_typeahead.prototype.select=function(){if(this.fs.total_items==1){this.fs.last_showing.cb.click();this.obj.value='';this.reset_search(true,false);}}
var fx={timer_id:'',timer_delay:25,timer_clearout:false,delta:0.10,doFadeIn:function(id)
{if(ua.ie()==true){this.timer_delay=0;this.delta=0.50;}
if(this.timer_clearout&&this.timer_id){window.clearTimeout(this.timer_id);}
set_opacity(ge(id),0);$(id).style.visibility="visible";this.fadeIn(id,0);},fadeIn:function(id,opacity)
{obj=ge(id);if(opacity<=1){set_opacity(obj,opacity);opacity+=this.delta;this.timer_id=setTimeout(function(){fx.fadeIn(id,opacity)},this.timer_delay);}},doFadeOut:function(id,remove_elem)
{if(ua.ie()==true){this.timer_delay=0;this.delta=0.50;}
if(this.timer_clearout&&this.timer_id){window.clearTimeout(this.timer_id);}
set_opacity(ge(id),1);$(id).style.visibility="visible";this.fadeOut(id,1,remove_elem);},fadeOut:function(id,opacity,remove_elem)
{obj=ge(id);if(opacity>=0){set_opacity(obj,opacity);opacity-=this.delta;this.timer_id=setTimeout(function(){fx.fadeOut(id,opacity,remove_elem)},this.timer_delay);}else{if(window.fs&&fs.paginate&&id!=fs.notice_id){fs.update_boxes();}else if(remove_elem){obj.parentNode.removeChild(obj);}else{obj.style.display='none';}}}};
if(window.Bootloader){Bootloader.done(1);}