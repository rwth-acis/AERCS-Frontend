/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function getUrlVars()
{
    var vars = [], hash;
    var url = urldecode(window.location.href);
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/*
 * Returns a url variable of a given name.
 */
function getUrlVar(name) {
    return getUrlVars()[name];
}

function handleError(errorData){
	alert("Error: " + errorData);
   	$(".loader").fadeOut("slow");
}

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}
