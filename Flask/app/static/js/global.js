// Response Statuses
var STATUS_OK = 200;
var BAD_REQUEST = 400;
var UNAUTHORIZED = 401;
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

		default:
			localStorage.removeItem('all_layers');
			localStorage.removeItem('optimizer');

	}
	window.location.href = '/build';
}


