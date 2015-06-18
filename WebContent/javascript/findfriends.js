function findfriends_open_panel(panel,close_others)
{
add_css_class_name(panel,'opened');
remove_css_class_name(panel,'closed');
if(close_others){
var other_panels=panel.parentNode.childNodes;
for(var ii=other_panels.length-1;ii>=0;ii--){
if(other_panels[ii]!=panel){
findfriends_close_panel(other_panels[ii]);
}
}
hide('error');
if(Vector2.getElementPosition(panel,'viewport').y<0){
Vector2.scrollTo(new Vector2(0,0,'document'));
}
}
}
function findfriends_close_panel(panel){
add_css_class_name(panel,'closed');
remove_css_class_name(panel,'opened');
}
function ff_toggle_webmail(){
toggle('address_book_login_widget');
toggle('upload_contact_link');
toggle('webmail_contact_link');
toggle('address_book_upload');
toggle('webmail_contact_reason');
}
if(window.Bootloader){
Bootloader.done(1);
}