/*
 * Extends the Service API to facilitate service communication.
 * 
 * requires b64.js
 * requires moduleHelper.js
 * requires serviceAPI.js
 * requires jquery.session.js
 * requires contentHandler.js
 */

/* Base URL of the AERCS Service */
var baseUrl = "http://127.0.0.1:8080/aercs";
/* API */
var api = i5.las2peer.jsAPI;
var userName = "User";
var userPw = "user";

/*
 * Sends a request using the service api.
 * If an error xml is returned, the error is displayed.
 */
function sendRequest(method, url, content, callback, errorcallback, mimeType) {
    /* Login */
    var login = new api.Login(api.LoginTypes.HTTP_BASIC);
    login.setUserAndPassword(userName, userPw);
    /* Request sender */
    var requestSender = new api.RequestSender(baseUrl, login);
    /* Request */
    var request = new api.Request(method, url, content, callback, errorcallback, mimeType);
    requestSender.sendRequestObj(request);
};

/*
 * Sends requests asynchronously using the service api.
 */
function sendRequestsAsync(requestObjArray, callback) {
    /* Login */
    var login = new api.Login(api.LoginTypes.HTTP_BASIC);
    login.setUserAndPassword($.session.get('userName'), $.session.get('userPw'));
    /* Request sender */
    var requestSender = new api.RequestSender(baseUrl, login);
    /* Asynchronous request */
    requestSender.sendRequestsAsync(requestObjArray, callback);
}

function selectConferences(callback, errorCallback, startChar){
    var url = "conferences?startChar=" + startChar;
    var content = "";
    sendRequest("GET", url, content, callback, errorCallback);
}

function selectJournals(callback, errorCallback, startChar){
    var url = "journals?startChar=" + startChar;
    var content = "";
    sendRequest("GET", url, content, callback, errorCallback);
}