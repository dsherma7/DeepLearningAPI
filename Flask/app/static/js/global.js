// Response Statuses
var STATUS_OK = 200;
var BAD_REQUEST = 400;
var UNAUTHORIZED = 401;
var FORBIDDEN = 403;
var NOT_FOUND = 404;
var METHOD_NOT_ALLOWED = 405;
var INTERNAL_SERVER_ERROR = 500;
var BAD_GATEWAY = 502;
var SERVICE_UNAVAILABLE = 503;
var GATEWAY_TIMEOUT = 504;


/* HTTP Client
1) GET:- Used when the client is requesting a resource on the Web server.
2) HEAD:- Used when the client is requesting some information about a resource but not requesting the resource itself.
3) POST:- Used when the client is sending information or data to the server—for example, filling out an online form (i.e. Sends a large amount of complex data to the Web Server).
4) PUT:- Used when the client is sending a replacement document or uploading a new document to the Web server under the request URL.
5) DELETE:- Used when the client is trying to delete a document from the Web server, identified by the request URL.
6) TRACE:- Used when the client is asking the available proxies or intermediate servers changing the request to announce themselves.
7) OPTIONS:- Used when the client wants to determine other available methods to retrieve or process a document on the Web server.
8) CONNECT:- Used when the client wants to establish a transparent connection to a remote host, usually to facilitate SSL-encrypted communication (HTTPS) through an HTTP proxy.
*/
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
    this.put = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == STATUS_OK)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "PUT", aUrl, true );            
        anHttpRequest.send( null );
    };
}

// Save CSV File from string
SaveCSV = function(csvContent,filename)  {
	csvData = new Blob([csvContent], { type: 'text/csv' }); 
	var csvUrl = URL.createObjectURL(csvData);
	var link = document.createElement("a");
	link.href =  csvUrl;
	link.setAttribute('download',filename);
	link.click(); 
}

// Loading bar
AddLoadingBar = function(){
	d3.select("#message-row").append("div").classed("loader",true);
	d3.select("#message-row").append("i").classed("loader",true).text("Loading ......");
	d3.select(".loader").transition().duration(60000).style("opacity",0).on("end",function(){ 
	    $.alert("Failed"); d3.selectAll(".loader").remove();
	});                    
}
Kill_Loading = function(){
    d3.selectAll(".loader").transition();
    d3.selectAll(".loader").remove();
}

// Saved Models
Template = function(model){
	switch(model) {

		case 'MNIST':
			localStorage.all_layers = '[{"type":"Input","name":"Input","comments":"28x28 Input","shape":[28,28],"channels":1,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Value":"Input"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"shape","Name":"Shape","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[28,28]}]},{"Var":"channels","Name":"# Channels","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1}]}],"layer":1},{"type":"Convolutional","name":"conv1","comments":"32 5x5 Filters","filters":32,"kernel_size":[5,5],"strides":5,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"conv1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":32}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[5,5]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":5}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":2},{"type":"Max Pooling","name":"maxpool1","comments":"5x5 Pooling","pool_size":[5,5],"strides":5,"padding":"same","attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":"maxpool1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"pool_size","Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[5,5]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":5}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]}],"layer":3},{"type":"Convolutional","name":"conv2","comments":"64 5x5 Filters","filters":64,"kernel_size":[5,5],"strides":5,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"conv2"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":64}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[5,5]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":5}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":4},{"type":"Max Pooling","name":"maxpool2","comments":"5x5 Pooling","pool_size":[5,5],"strides":5,"padding":"same","attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":"maxpool2"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"pool_size","Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[5,5]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":5}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]}],"layer":5},{"type":"Dropout","name":"drop","comments":"Rate 0.0 Dropout","rate":0,"training":1,"units":1024,"activation":"ReLU","usebias":true,"reuse":false,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##","Value":"drop"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"rate","Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":0}]},{"Var":"training","Name":"Training","Fields":[{"Field":"BooleanField","Value":1}]},{"Var":"units","Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1024}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":false}]}],"layer":6},{"type":"Fully Connected","name":"Output","comments":"10 Classes","units":10,"activation":"ReLU","usebias":true,"reuse":false,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Dense - ##","Value":"Output"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"10 Classes"}]},{"Var":"units","Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":10}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":false}]}],"layer":7}]';
			localStorage.optimizer  = '{"type":"grad","rate":0.001,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Value":"GradientDescent"}]},{"Var":"rate","Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},{"Var":"locking","Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}]}';
			localStorage.project    = 'My MNIST';
			localStorage.input_sz	= '2D';
			localStorage.loss		= 'softmax';
			localStorage.batchsz	= '100';
			localStorage.steps		= '1';
			localStorage.shuffle	= 'true';			
			break;

        case 'AlexNet':
            localStorage.all_layers = '[{"type":"Input","name":"Input Layer","comments":"RGB 227 x 227","shape":[227,227],"channels":3,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Value":"Input Layer"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"RGB 227 x 227"}]},{"Var":"shape","Name":"Shape","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[227,227]}]},{"Var":"channels","Name":"# Channels","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":3}]}],"layer":1},{"type":"Convolutional","name":"Conv1","comments":"96 11 x 11 Filters","filters":96,"kernel_size":[5,5],"strides":4,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"Conv1 + ReLU"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"96 11 x 11 Filters"}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":96}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[11,11]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":4}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":2},{"type":"Max Pooling","name":"Pool1","comments":"Max 3 x 3","pool_size":[3,3],"strides":2,"padding":"same","attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":"Pool1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Max 3 x 3"}]},{"Var":"pool_size","Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":2}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]}],"layer":3},{"type":"Batch Normalization","name":"Norm1","comments":"Normalize","beta":0,"gamma":1,"epsilon":0.000001,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"BatchNorm - ##","Value":"Norm1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":null}]},{"Var":"beta","Name":"Offset (beta)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":0}]},{"Var":"gamma","Name":"Scale (gamma)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":1}]},{"Var":"epsilon","Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":0.000001}]}],"layer":4},{"type":"Convolutional","name":"Conv2","comments":"256 5 x 5 Filters","filters":96,"kernel_size":[5,5],"strides":1,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"Conv1-Copy1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"96 11 x 11 Filters"}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":96}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[5,5]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":4}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":5},{"type":"Max Pooling","name":"Pool2","comments":"Max 3x3","pool_size":[3,3],"strides":2,"padding":"same","attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":"Pool2"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Max 3x3"}]},{"Var":"pool_size","Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":2}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]}],"layer":6},{"type":"Convolutional","name":"Conv3","comments":"384 3x3 Filters","filters":384,"kernel_size":[3,3],"strides":1,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"Conv3"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"384 3x3 Filters"}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":384}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":7},{"type":"Convolutional","name":"Conv4","comments":"384 3x3 Filters","filters":384,"kernel_size":[3,3],"strides":1,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"Conv3-Copy1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"384 3x3 Filters"}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":384}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":8},{"type":"Convolutional","name":"Conv5","comments":"256 3x3 Filters","filters":256,"kernel_size":[3,3],"strides":1,"padding":"same","activation":"ReLU","usebias":true,"reuse":null,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":"Conv3-Copy2"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"384 3x3 Filters"}]},{"Var":"filters","Name":"# Filters","Fields":[{"Field":"NumberField","Value":384}]},{"Var":"kernel_size","Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":null}]}],"layer":9},{"type":"Max Pooling","name":"Pool3","comments":"Max 3x3","pool_size":[3,3],"strides":2,"padding":"same","attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":"Pool3"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Max 3x3"}]},{"Var":"pool_size","Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":[3,3]}]},{"Var":"strides","Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":2}]},{"Var":"padding","Name":"Padding","Fields":[{"Field":"SelectField","Choices":["same","valid"],"Value":"same"}]}],"layer":10},{"type":"Dropout","name":"Drop1","comments":"Rate 0.5 FCL 4096","rate":0.5,"training":0,"units":4096,"activation":"ReLU","usebias":false,"reuse":false,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##","Value":"Drop1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Rate 0.5 FCL 4096"}]},{"Var":"rate","Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":0.5}]},{"Var":"training","Name":"Training","Fields":[{"Field":"BooleanField","Value":0}]},{"Var":"units","Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":4096}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":false}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":false}]}],"layer":11},{"type":"Dropout","name":"Drop2","comments":"Rate 0.5 FCL 4096","rate":0.5,"training":0,"units":4096,"activation":"ReLU","usebias":false,"reuse":false,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##","Value":"Drop1-Copy1"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Rate 0.5 FCL 4096"}]},{"Var":"rate","Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":0.5}]},{"Var":"training","Name":"Training","Fields":[{"Field":"BooleanField","Value":0}]},{"Var":"units","Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":4096}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":false}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":false}]}],"layer":12},{"type":"Fully Connected","name":"FCL","comments":"Output","units":1000,"activation":"ReLU","usebias":true,"reuse":false,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Dense - ##","Value":"FCL"}]},{"Var":"comments","Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":"Output"}]},{"Var":"units","Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":1000}]},{"Var":"activation","Name":"Activation","Fields":[{"Field":"SelectField","Choices":["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"],"Value":"ReLU"}]},{"Var":"usebias","Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":true}]},{"Var":"reuse","Name":"Reuse","Fields":[{"Field":"BooleanField","Value":false}]}],"layer":13}]';
            localStorage.optimizer  =  '{"type":"momentum","name":"momentum","learning_rate":0.001,"locking":1,"attr":[{"Var":"name","Name":"Name","Fields":[{"Field":"StringField","Value":"Momentum"}]},{"Var":"rate","Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},{"Var":"locking","Name":"Use Locking","Fields":[{"Field":"BooleanField"}]},{"Var":"nesterov","Name":"Use Nesterov","Fields":[{"Field":"BooleanField"}]}],"rate":0.01}';
            localStorage.project    =  'My AlexNet';
            localStorage.input_sz   =  '2D';
            localStorage.loss       =  'softmax';
            localStorage.batchsz    =  '500';
            localStorage.steps      =  '1';
            localStorage.shuffle    =  'true';
            break;

		default:
			localStorage.removeItem('all_layers');
			localStorage.removeItem('optimizer');

	}
	window.location.href = '/build';
}


// Hard Copy of an Array
Array.prototype.hard_copy = function() {
    return JSON.parse(JSON.stringify(this));
};