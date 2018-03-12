LayerTypes = ['Select','Input','Convolutional','Fully Connected','Max Pooling','Dropout','Batch Normalization','Output'];
LayerMap = {"Select":"Select","Convolutional":"conv","Fully Connected":"fcl",'Input':"input","Max Pooling":"maxpool","Dropout":"drop_out","Batch Normalization":"batch_norm","Output":"out"};
LayerUnmap = {"Select":"Select","conv":"Convolutional","fcl":"Fully Connected","input":"Input","maxpool":"Max Pooling","drop_out":"Dropout","batch_norm":"Batch Normalization","out":"Output"};
activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"];
paddings = ["same","valid"];

/*********
* Layers *
*********/

function newLayer(type,sz,layer=null) {
	switch (type) {
		case 'Select':
			return null;
			break;

		case 'Input':
			return new InputLayer(sz,layer);
			break;
		case 'Convolutional':
			return new ConvLayer(sz,layer);
			break;

		case 'Fully Connected':
			return new DenseLayer(layer);
			break;

		case 'Max Pooling':
			return new MaxPoolLayer(sz,layer);
			break;

		case 'Dropout':
			return new DropLayer(layer);
			break;

		case 'Batch Normalization':
			return new BatchNormLayer(layer);
			break;

		case 'Output':
			return new OutputLayer(layer);
			break;
	}
}

function ConvLayer(sz,layer=null) {
	this.type = "Convolutional";
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.filters = (layer != null ? layer.filters : null);
	this.kernel_size = (layer != null ? layer.kernel_size : Array(sz).fill(null));
	this.strides = (layer != null ? layer.strides : null);
	this.padding = (layer != null ? layer.padding : 'same');
	this.activation = (layer != null ? layer.activation : 'ReLU');
	this.usebias = (layer != null ? layer.usebias : true);
	this.reuse = (layer != null ? layer.reuse : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"filters", "Name":"# Filters","Fields":[{"Field":"NumberField","Value":this.filters}]},
		{"Var":"kernel_size", "Name":"Kernel Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":this.kernel_size}]},
		{"Var":"strides", "Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.strides}]},
		{"Var":"padding", "Name":"Padding","Fields":[{"Field":"SelectField", "Choices":paddings,"Value":this.padding}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations,"Value":this.activation}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":this.usebias}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField","Value":this.reuse}]}
	];
}

function MaxPoolLayer(sz,layer=null) {
	this.type = "Max Pooling";
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.pool_size = (layer != null ? layer.pool_size : Array(sz).fill(null));
	this.strides = (layer != null ? layer.strides : null);
	this.padding = (layer != null ? layer.padding : 'same');

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"pool_size", "Name":"Pool Size","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":this.pool_size}]},
		{"Var":"strides", "Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.strides}]},
		{"Var":"padding", "Name":"Padding","Fields":[{"Field":"SelectField", "Choices":paddings,"Value":this.padding}]}
	];
}

function DenseLayer(layer=null) {
	this.type = "Fully Connected";
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.units = (layer != null ? layer.units : null);
	this.activation = (layer != null ? layer.activation : 'ReLU');
	this.usebias = (layer != null ? layer.usebias==1 : null);
	this.reuse = (layer != null ? layer.reuse==1 : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Dense - ##","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.units}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations,"Value":this.activation}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":this.usebias}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField","Value":this.reuse}]}
	];
}

function DropLayer(layer=null) {
	this.type = "Dropout";
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.rate = (layer != null ? layer.rate : null);
	this.training = (layer != null ? layer.training : null);
	this.units = (layer != null ? layer.units : null);
	this.activation = (layer != null ? layer.activation : 'ReLU');
	this.usebias = (layer != null ? layer.usebias==1 : null);
	this.reuse = (layer != null ? layer.reuse==1 : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"rate", "Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":this.rate}]},
		{"Var":"training", "Name":"Training","Fields":[{"Field":"BooleanField","Value":this.training}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.units}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations,"Value":this.activation}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField","Value":this.usebias}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField","Value":this.reuse}]}
	];
}

function BatchNormLayer(layer=null) {
	this.type = "Batch Normalization"
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.beta = (layer != null ? layer.beta : null);
	this.gamma = (layer != null ? layer.gamma : null);
	this.epsilon = (layer != null ? layer.epsilon : 10e-7);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"BatchNorm - ##","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"beta", "Name":"Offset (beta)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":this.beta}]},
		{"Var":"gamma", "Name":"Scale (gamma)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":this.gamma}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":this.epsilon}]}
	]
}

function InputLayer(sz,layer=null) {	
	this.type  = "Input";
	this.name  = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.shape = (layer != null ? layer.shape : Array(sz).fill(null));	
	this.channels = (layer != null ? layer.channels : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"shape", "Name":"Shape","Fields":[{"Field":"FilterField","Placeholder":"(integer)","Value":this.shape}]},
		{"Var":"channels", "Name":"# Channels","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.channels}]}
	];
}

function OutputLayer(layer=null) {
	this.type = "Output"
	this.name = (layer != null ? layer.name : null);
	this.comments = (layer != null ? layer.comments : null);
	this.units = (layer != null ? layer.units : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":this.name}]},
		{"Var":"comments", "Name":"Comments","Fields":[{"Field":"StringField","Placeholder":"(optional)","Value":this.comments}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)","Value":this.units}]}
	]
}

/*************
* OPTIMIZERS *
*************/

function newOptimizer(type) {
	switch(type){ 
		case 'Select':
			return null;
			break;

		case 'grad':
			return new GradOpt();
			break;

		case 'adadelta':
			return new AdadeltaOpt();
			break;

		case 'adagrad':
			return new AdagradOpt();
			break;

		case 'adagradda':
			return new AdagradDAOpt();
			break;

		case 'adam':
			return new AdamOpt();
			break;

		case 'momentum':
			return new MomentumOpt();
			break;
	}
}

function GradOpt(name, learning_rate, locking) {
	this.type = "grad";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.locking = (locking != null ? locking : false);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"GradientDescent"}]},
		{"Var":"learning_rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdadeltaOpt(name, learning_rate, rho, epsilon, locking) {
	this.type = "adadelta";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.rho = tho;
	this.epsilon = epsilon;
	this.locking = (locking != null ? locking : false);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adadelta"}]},
		{"Var":"learning_rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"rho", "Name":"Rho","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdagradOpt(name, learning_rate, initAccVal, locking) {
	this.type = "adagrad";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.initAccVal = initAccVal;
	this.locking = (locking != null ? locking : false);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adagrad"}]},
		{"Var":"learning_rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"initAccVal", "Name":"Initial Acculumator Value","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdagradDAOpt(name, learning_rate, initAccVal, l1RegStr, l2RegStr, locking) {
	this.type = "adagradda";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.initAccVal = initAccVal;
	this.l1RegStr = l1RegStr;
	this.l2RegStr = l2RegStr;
	this.locking = (locking != null ? locking : false);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"AdagradDA"}]},
		{"Var":"learning_rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"initAccVal", "Name":"Initial Gradient Squared Acculumator Value","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"l1RegStr", "Name":"L1 Regularization Strength","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"l2RegStr", "Name":"L2 Regularization Strength","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdamOpt(name, learning_rate, beta1, beta2, epsilon, locking) {
	this.type = "adam";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.beta1 = beta1;
	this.beta2 = beta2;
	this.epsilon = epsilon;
	this.locking = (locking != null ? locking : false);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adam"}]},
		{"Var":"learning_rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"beta1", "Name":"Beta 1","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"beta2", "Name":"Beta 2","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function MomentumOpt(name, learning_rate, locking, nesterov) {
	this.type = "momentum";
	this.name = (name != null ? name : this.type);
	this.learning_rate = ( learning_rate != null ? learning_rate : 0.001);
	this.locking = (locking != null ? locking : false);
	this.nesterov = nesterov;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Momentum"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]},
		{"Var":"nesterov", "Name":"Use Nesterov","Fields":[{"Field":"BooleanField"}]}
	];
}