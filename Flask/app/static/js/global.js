// Response Statuses
var STATUS_OK = 200;
var BAD_REQUEST = 400;
var Unauthorized = 401;
var FORBIDDEN = 403;
var NOT_FOUND = 404;
var INTERNAL_SERVER_ERROR = 500;
var BAD_GATEWAY = 502;
var SERVICE_UNAVAILABLE = 503;
var GATEWAY_TIMEOUT = 504;

// HTTP Client
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == STATUS_OK)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    };
    this.set = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == STATUS_OK)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "SET", aUrl, true );            
        anHttpRequest.send( null );
    };
    this.post = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == STATUS_OK)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "POST", aUrl, true );            
        anHttpRequest.send( null );
    };
}

