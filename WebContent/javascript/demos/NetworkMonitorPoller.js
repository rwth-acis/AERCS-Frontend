
dojo.provide("demos.NetworkMonitorPoller");

dojo.declare("demos.NetworkMonitorPoller", null, {

  // summary: encapsulates generic polling functionality
  // description:
  //  The delay attribute determines the interval between subsequent polling requests.
  //  A polling request is issued only after the previous request has been answered. Therefore,
  //  the polling interval can be changed even after startPolling() has been called.
  //  When an error occurs during a polling request, a default delay of 10 seconds will be used until the
  //  next request is started.
  _delay : null,
  // errorDelay: the delay before the next polling request is
  //      started when an error occured during the previous request (default: 10000).
  errorDelay : null,
  _pollURL : null,
  _pollTime : null,
  _polling : null,
  _hash: null,

  constructor : function( baseURL, pollURL, delay, errorDelay ) {
    this._delay = typeof(delay) != 'undefined' ? delay : 2000;
    this._errorDelay = typeof(errorDelay) != 'undefined' ? errorDelay : 10000;
    this._pollURL =  baseURL + pollURL;
  },

  poll : function() {
    var args = {
       url : this._pollURL,
       mimetype : "text/xml",
       error : dojo.hitch( this, 'handleError' ),
       load : dojo.hitch( this, 'handleLoad' )
     };
     dojo.xhrPost( args );
     this._pollTime = new Date();
  },

  handleLoad : function (response, ioArgs) {
    this.onGetStatus( response );
    if( this._polling ) {
      setTimeout(dojo.hitch( this, "poll" ), this._delay);
    }
  },

  handleError : function (response, ioArgs) {
    dojo.debug("NetworkMonitorPoller Error: "+response);
    if( this._polling ) {
      setTimeout(dojo.hitch( this, "poll" ), this._errorDelay);
    }
  },

  setInterval : function( interval ) {
    this._delay = interval;
  },

  startPolling : function() {
    this._polling = true;
    this.poll();
  },

  stopPolling : function() {
    this._polling = false;
  },

  isPolling : function() {
    return this._polling;
  },

  // for dojo.connect(..)
  onGetStatus : function(evt) {
    
  }


});