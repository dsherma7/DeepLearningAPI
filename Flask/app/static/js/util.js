LayerTypes = ['Select','Input','Convolutional','Fully Connected','Max Pooling','Dropout','Batch Normalization','Output'];
activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"];
paddings = ["Valid","Same"];

/*********
* Layers *
*********/

function newLayer(type) {
	switch (type) {
		case 'Select':
			return null;
			break;

		case 'Input':
			return new InputLayer();
			break;
		case 'Convolutional':
			return new ConvLayer();
			break;

		case 'Fully Connected':
			return new DenseLayer();
			break;

		case 'Max Pooling':
			return new MaxPoolLayer();
			break;

		case 'Dropout':
			return new DropLayer();
			break;

		case 'Batch Normalization':
			return new BatchNormLayer();
			break;

		case 'Output':
			return new OutputLayer();
			break;
	}
}

function ConvLayer(name, filter, kernel, stride, padding, activation, usebias, reuse) {
	this.type = "Convolutional";
	this.name = name;
	this.filter = filter;
	this.kernel = kernel;
	this.stride = stride;
	this.padding = padding;
	this.activation = activation;
	this.usebias = usebias;
	this.reuse = reuse;

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

function MaxPoolLayer(name, poolsize, stride, padding) {
	this.type = "Max Pooling";
	this.name = name;
	this.poolsize = poolsize;
	this.stride = stride;
	this.padding = padding;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"MaxPool - ##"}]},
		{"Var":"poolsize", "Name":"Pool Size","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"stride", "Name":"Stride Length","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"padding", "Name":"Padding","Fields":[{"Field":"SelectField", "Choices":paddings}]}
	];
}

function DenseLayer(name, units, activation, usebias, reuse) {
	this.type = "Fully Connected";
	this.name = name;
	this.units = units;
	this.activation = activation;
	this.usebias = usebias;
	this.reuse = reuse;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Dense - ##"}]},
		{"Var":"units", "Name":"Units","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]},
		{"Var":"activation", "Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]},
		{"Var":"usebias", "Name":"Use Bias","Fields":[{"Field":"BooleanField"}]},
		{"Var":"reuse", "Name":"Reuse","Fields":[{"Field":"BooleanField"}]}
	];
}

function DropLayer(name, rate, training) {
	this.type = "Dropout";
	this.name = name;
	this.rate = rate;
	this.training = training;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"Drop - ##"}]},
		{"Var":"rate", "Name":"Rate","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"training", "Name":"Training","Fields":[{"Field":"BooleanField"}]}
	];
}

function BatchNormLayer(name, beta, gamma, epsilon) {
	this.type = "Batch Normalization"
	this.name = name;
	this.beta = beta;
	this.gamma = gamma;
	this.epsilon = epsilon;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField","Placeholder":"BatchNorm - ##"}]},
		{"Var":"beta", "Name":"Offset (beta)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"gamma", "Name":"Scale (gamma)","Fields":[{"Field":"NumberField","Placeholder":"(decimal)"}]},
		{"Var":"epsilon", "Name":"Epsilon","Fields":[{"Field":"NumberField","Placeholder":"(decimal)","Value":10e-7}]}
	]
}

function InputLayer(name, shape) {
	this.type = "Input";
	this.name = name;
	this.shape = shape;

	this.attr = [
		{"Var":"name", "Name":"Name","Fields":[{"Field":"StringField"}]},
		{"Var":"shape", "Name":"Shape","Fields":[{"Field":"NumberField","Placeholder":"(integer)"}]}
	];
}

function OutputLayer(name, units) {
	this.type = "Output"
	this.name = name;
	this.units = units;

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