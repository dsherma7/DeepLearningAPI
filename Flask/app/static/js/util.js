LayerTypes = ['Select','Input','Convolutional','Fully Connected','Max Pooling','Dropout','Batch Normalization','Output'];
activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"];
paddings = ["Valid","Same"];

/*********
* Layers *
*********/

function validate(layer) {
	// Add some validation
	return true;
}

function newLayer(type,layer=null) {
	switch (type) {
		case 'Select':
			return null;
			break;

		case 'Input':
			return new InputLayer(layer);
			break;
		case 'Convolutional':
			return new ConvLayer(layer);
			break;

		case 'Fully Connected':
			return new DenseLayer(layer);
			break;

		case 'Max Pooling':
			return new MaxPoolLayer(layer);
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

function ConvLayer(layer=null) {
	this.type = "Convolutional";
	this.name = (layer != null ? layer.name : null);
	this.filter = (layer != null ? layer.filter : null);
	this.kernel = (layer != null ? layer.kernel : null);
	this.stride = (layer != null ? layer.stride : null);
	this.padding = (layer != null ? layer.padding : null);
	this.activation = (layer != null ? layer.activation : null);
	this.usebias = (layer != null ? layer.usebias : null);
	this.reuse = (layer != null ? layer.reuse : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Conv - ##"}]},
		{"Var":"filter", "Name":"Filter","Fields":[{"Field":"NumberField"}]},
		{"Var":"kernel", "Name":"Kernel Size","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"stride", "Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"padding", "Name":"Padding","Fields":[{"Field":"SelectField", "Choices":paddings}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField"}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField"}]}
	];
}

function MaxPoolLayer(layer=null) {
	this.type = "Max Pooling";
	this.name = (layer != null ? layer.name : null);
	this.poolsize = (layer != null ? layer.poolsize : null);
	this.stride = (layer != null ? layer.stride : null);
	this.padding = (layer != null ? layer.padding : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##"}]},
		{"Var":"poolsize", "Name":"Pool Size","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"stride", "Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"padding", "Name":"Padding","Fields":[{"Field":"SelectField", "Choices":paddings}]}
	];
}

function DenseLayer(layer=null) {
	this.type = "Fully Connected";
	this.name = (layer != null ? layer.name : null);
	this.units = (layer != null ? layer.units : null);
	this.activation = (layer != null ? layer.activation : null);
	this.usebias = (layer != null ? layer.usebias : null);
	this.reuse = (layer != null ? layer.reuse : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Dense - ##"}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField"}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField"}]}
	];
}

function DropLayer(layer=null) {
	this.type = "Dropout";
	this.name = (layer != null ? layer.name : null);
	this.rate = (layer != null ? layer.rate : null);
	this.training = (layer != null ? layer.training : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##"}]},
		{"Var":"rate", "Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"training", "Name":"Training","Fields":[{"Field":"BooleanField"}]}
	];
}

function BatchNormLayer(layer=null) {
	this.type = "Batch Normalization"
	this.name = (layer != null ? layer.name : null);
	this.beta = (layer != null ? layer.beta : null);
	this.gamma = (layer != null ? layer.gamma : null);
	this.epsilon = (layer != null ? layer.epsilon : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"BatchNorm - ##"}]},
		{"Var":"beta", "Name":"Offset (beta)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"gamma", "Name":"Scale (gamma)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":10e-7}]}
	]
}

function InputLayer(layer=null) {
	this.type  = "Input";
	this.name  = (layer != null ? layer.name : null);
	this.shape = (layer != null ? layer.shape : null);	

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField"}]},
		{"Var":"shape", "Name":"Shape","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]}
	];
}

function OutputLayer(layer=null) {
	this.type = "Output"
	this.name = (layer != null ? layer.name : null);
	this.units = (layer != null ? layer.units : null);

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField"}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]}
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

function GradOpt(name, rate, locking) {
	this.type = "grad";
	this.name = name;
	this.rate = rate;
	this.locking = locking;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"GradientDescent"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdadeltaOpt(name, rate, rho, epsilon, locking) {
	this.type = "adadelta";
	this.name = name;
	this.rate = rate;
	this.rho = rho;
	this.epsilon = epsilon;
	this.locking = locking;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adadelta"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"rho", "Name":"Rho","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdagradOpt(name, rate, initAccVal, locking) {
	this.type = "adagrad";
	this.name = name;
	this.rate = rate;
	this.initAccVal = initAccVal;
	this.locking = locking;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adagrad"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"initAccVal", "Name":"Initial Acculumator Value","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdagradDAOpt(name, rate, initAccVal, l1RegStr, l2RegStr, locking) {
	this.type = "adagradda";
	this.name = name;
	this.rate = rate;
	this.initAccVal = initAccVal;
	this.l1RegStr = l1RegStr;
	this.l2RegStr = l2RegStr;
	this.locking = locking;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"AdagradDA"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"initAccVal", "Name":"Initial Gradient Squared Acculumator Value","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"l1RegStr", "Name":"L1 Regularization Strength","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"l2RegStr", "Name":"L2 Regularization Strength","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function AdamOpt(name, rate, beta1, beta2, epsilon, locking) {
	this.type = "adam";
	this.name = name;
	this.rate = rate;
	this.beta1 = beta1;
	this.beta2 = beta2;
	this.epsilon = epsilon;
	this.locking = locking;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Adam"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"beta1", "Name":"Beta 1","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"beta2", "Name":"Beta 2","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]}
	];
}

function MomentumOpt(name, rate, locking, nesterov) {
	this.type = "momentum";
	this.name = name;
	this.rate = rate;
	this.locking = locking;
	this.nesterov = nesterov;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Value":"Momentum"}]},
		{"Var":"rate", "Name":"Learning Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"locking", "Name":"Use Locking","Fields":[{"Field":"BooleanField"}]},
		{"Var":"nesterov", "Name":"Use Nesterov","Fields":[{"Field":"BooleanField"}]}
	];
}