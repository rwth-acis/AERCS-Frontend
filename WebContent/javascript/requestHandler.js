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

function selectEvents(callback, errorCallback, id, item){
	var url = "events?id=" + id + "&item=" + item;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function getChartUrls(callback, errorCallback, id){
	var url = "seriesCharts?id=" + id;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function selectEvent(callback, errorCallback, id){
	var url = "event?id=" + id;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function selectPerson(callback, errorCallback, id, key){
	var url = "person?id=" + id + "&key=" + key;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function getRanking(callback, errorCallback, conf, journal, domain, currentPage, col, order){
	var url = "ranking?conf=" + conf + "&journal=" + journal + "&domain=" + domain + "&page=" + currentPage + "&col=" + col + "&order=" + order;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function selectSeriesComparison(callback, errorCallback, selectedSeries, searchKeyword, typeOfSeriesSearchIn, startChar){
	var url = "seriesComparison?selectedSeries=" + selectedSeries + "&searchKeyword=" + searchKeyword + "&typeOfSeriesSearchIn=" + typeOfSeriesSearchIn + "&startChar=" + startChar;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function searchResults(callback, errorCallback, searchdata, searchfield, page){
	var url = "search?searchdata=" + searchdata + "&searchfield=" + searchfield + "&page=" + page;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function getSeriesComparison(callback, errorCallback, selectedSeriesData, chartType){
	var url = "drawSeriesComparison?selectedSeriesData=" + selectedSeriesData + "&chartType=" + chartType;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}

function getEventNetworkVisualization(callback, errorCallback, id, layout, search, width, height, content){
	var url = "eventNetworkVisualization?id=" + id + "&layout=" + layout + "&search=" + search + "&width=" + width + "&height=" + height;
	sendRequest("POST", url, content, callback, errorCallback);
}

function getPersonNetworkVisualization(callback, errorCallback, id, layout, search, width, height, content){
	var url = "personNetworkVisualization?id=" + id + "&layout=" + layout + "&search=" + search + "&width=" + width + "&height=" + height;
	sendRequest("GET", url, content, callback, errorCallback);
}

function getNetworkVisualization(callback, errorCallback, graphml, layout, width, height){
	var url = "networkVisualization?graphml=" + graphml + "&layout=" + layout + "&width=" + width + "&height=" + height;
	var content = "";
	sendRequest("GET", url, content, callback, errorCallback);
}
