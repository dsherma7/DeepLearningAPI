from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField
from flask import render_template, flash, jsonify, Flask, request, Response
from sklearn.model_selection import train_test_split
from importlib.machinery import SourceFileLoader
from app import app, csrf
import pickle as pickle
from .forms import * 
import numpy as np
import json
# Tensorflow Server & Datastore Client
orch      = SourceFileLoader("model_orchestrator", "../Tensorflow/model_orchestrator.py").load_module()
datastore = SourceFileLoader("datastore", "../WebRequest/datastore.py").load_module()


activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"]
paddings = ["Valid","Same"]
divider = "\n------------------------------------------------------------\n"

# Useful for parsing layers
null = ""
true = True
false = False


# Makes the substiution form based on SubForm
@app.route('/', methods=['GET', 'POST'])
def build_network():   
	form = MainForm()
	print(divider + "here above" + divider)
	if form.validate_on_submit():
		flash("This message appears after clicking submit!")
		print(divider + "here" + divider)		
	return render_template('index.html',title='Sub Form',form=form)

# @csrf.exempt
@app.route('/_submit_layers', methods=['GET','POST'])
def submit_layers():
	
	# Get the params passed as Lists/Dicts
	exec("layers =" + str(request.args.get('layers', 0, type=str)),globals())	
	exec("optimizer =" + str(request.args.get('optimizer', 0, type=str)),globals())	
	# Get other parameters	
	name  = request.args.get('name', 0, type=str)
	date  = request.args.get('date', 0, type=str)
	size  = request.args.get('size', 0, type=str)
	loss  = request.args.get('loss', 0, type=str)
	user  = request.args.get('user', 0, type=str)
	shape = request.args.get('shape',0, type=str)
	
	train = {"user":user,"project":name,"date":date,
			 "size":size,"loss":loss,"shape":shape,
			 "status":"designed"}

	params = {'train':train,'layers':layers}
	
	job = datastore.get_next_jobid(user)
	
	print(divider)
	print("# Layers: "+str(len(layers)))
	print("Types " + str([x['type'] for x in layers]))
	print(str(train))
	print(divider)
	
	datastore.add_job(params);
	
	# return Response(json.dumps(layers),  mimetype='application/json')
	return jsonify(out = {'status':200,"msg":"OK",'job':job})

@app.route('/_get_jobs',methods=['GET'])
def _get_jobs():
	user = request.args.get('user', 0, type=str)
	jobs = datastore.get_job_stats(user)
	return Response(json.dumps(jobs),  mimetype='application/json')

@app.route('/_set_comment',methods=['GET','SET'])
def _set_comment():
	comment = request.args.get('comment',  0, type=str)
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	datastore.set_comment(user,job,comment)
	return jsonify(status="200")

@app.route('/status',methods=['GET','POST'])
def job_status():
	form = StatusForm()
	if form.validate_on_submit():
		flash('Success!')
		data  = form.Files.data
		lbls  = form.Labels.data
		dtype = form.DataType.data
		
		print(divider)
		print(data)
		print(lbls)
		print(dtype)
		print(divider)
		if false:
			if dtype == "all":
				X_train, X_test, y_train, y_test = train_test_split(data, lbls, test_size=0.33, random_state=42)	
				orch.publish_data(X_train, 'npjoodi', '001', 'train', 'x' )
				orch.publish_data(y_train, 'npjoodi', '001', 'train', 'y' )
				orch.publish_data(X_test, 'npjoodi', '001', 'test', 'x' )
				orch.publish_data(y_test, 'npjoodi', '001', 'test', 'y' )
			else:
				orch.publish_data(data, 'npjoodi', '001', dtype, 'x' )
				orch.publish_data(lbls, 'npjoodi', '001', dtype, 'y' )

	return render_template('status.html',title='Job Status',form=form)

@app.route('/login',methods=['GET','POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('login.html',title='Job Status',form=form)

@app.route('/_login',methods=['GET','POST'])
def _login():
	print(request.args)
	print('youve logged in!')
	flash('something')
	return True




# Gets the necessary list of params needed for a given layer
# @app.route('/_get_params', methods=['GET'])
# def function(): 
# 	layer_type = request.args.get('layer', 0, type=str)
# 	input_size = request.args.get('size', 0, type=str)

# 	if layer_type == 0:
# 		# Returned when Get request fails
# 		return ""

# 	if layer_type == "Convolutional":
# 		# Name field
# 		row1 = {"Name":"Name","Fields":[{"Field":"StringField"}]}
# 		# A List of activation functions to choose from (defined above)
# 		row2 = {"Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]}
# 		# A textbox for each filter dimension
# 		row3 = {"Name":"Filter","Fields":[{"Field":"FilterField","Size":int(input_size[0])}]}
# 		return jsonify(params=[row1,row2,row3])

# 	if layer_type == "Max Pooling":
# 		# Name field
# 		row1 = {"Name":"Name","Fields":[{"Field":"StringField"}]}
# 		# A textbox for each filter dimension
# 		row2 = {"Name":"Pool Size","Fields":[{"Field":"FilterField","Size":int(input_size[0])}]}
# 		return jsonify(params=[row1,row2])


# 	return ""
