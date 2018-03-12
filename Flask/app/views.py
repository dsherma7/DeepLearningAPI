from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField
from flask import render_template, flash, jsonify, Flask, request, Response
from sklearn.model_selection import train_test_split
from importlib.machinery import SourceFileLoader
from werkzeug import secure_filename
from app import app, csrf
import pickle as pickle
from .forms import * 
import pandas as pd
import numpy as np
import json
import io
# Tensorflow Server & Datastore Client
orch 	  = SourceFileLoader("model_orchestrator", "../Tensorflow/model_orchestrator.py").load_module()
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
	return render_template('index.html',title='Build a New Network',form=form)

# @csrf.exempt
@app.route('/_submit_layers', methods=['GET','POST'])
def submit_layers():
	
	# Get the params passed as Lists/Dicts
	exec("layers =" + str(request.args.get('layers', 0, type=str)),globals())	
	exec("optimizer =" + str(request.args.get('optimizer', 0, type=str)),globals())	
	# Get other parameters	
	name  = request.args.get('name', 0, type=str)
	date  = request.args.get('date', 0, type=str)
	size  = request.args.get('input', 0, type=str)
	loss  = request.args.get('loss', 0, type=str)
	user  = request.args.get('user', 0, type=str)
	shape = request.args.get('shape',0, type=str)
	batchsz = request.args.get('batchsz',0, type=str)
	shuffle = request.args.get('shuffle',0, type=str)
	steps   = request.args.get('steps',0, type=str)
	
	train = {"user":user,"project":name,"date":date,
			 "input_size":size,"loss":loss,"shape":shape,
			 "batch_size":batchsz,"shuffle_batch":shuffle,
			 "training_steps":steps,"status":"designed",
			 "optimizer":optimizer}

	params = {'train':train,'layers':layers}
	
	job = datastore.get_next_jobid(user)	
	datastore.add_job(params);	
	orch.create_network(user, job)
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

@app.route('/_train',methods=['GET','SET'])
def _train_model():
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	datatype = request.args.get('datatype',  0, type=str)	
	orch.train_network(user, job, datatype)
	return jsonify({'status':"200",'msg':"Job "+job+" done Training!"})

@app.route('/_test',methods=['GET','SET'])
def _test_model():
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	datatype = request.args.get('datatype',  0, type=str)	
	preds = orch.predict(user, job, datatype)
	classes = [float(x['class']) for x in preds]
	probs = [[float(x) for x in y['probabilities']] for y in preds] 

	return jsonify({'status':"200","probs":probs,"classes":classes})

@app.route('/_evaluate',methods=['GET','SET'])
def _eval_model():
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	datatype = request.args.get('datatype',  0, type=str)	
	evals = orch.eval_network(user, job, datatype)
	return jsonify({'status':"200",'evals':{x:round(float(evals[x]),3) for x in evals}})


@app.route('/_get_dtypes',methods=['GET'])
def _get_dtypes():	
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	dtypes = orch.get_dtypes(user,job)
	return jsonify(dtypes=dtypes)

@app.route('/_archive',methods=['GET'])
def _archive():	
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	datastore.change_status(user,job,"archived")
	return jsonify(status="200")


@app.route('/status',methods=['GET','POST'])
def job_status():
	form = StatusForm()
	if form.validate_on_submit():
		user = form.username.data		
		print(form.selected.data)
		if user == "":
			flash("Please Login First!")
		elif form.selected.data == "":						
			flash("No Job Selected!")
		else:
			selected = json.loads(form.selected.data)	
			f1 = form.Files.data
			l1 = form.Labels.data
			data = read_data(f1)
			lbls = read_data(l1)		
			dtype = form.DataType.data

			[data,lbls] = format_data(data,lbls)
			
			if dtype in orch.get_dtypes(user,selected['job']):
				flash('Data type already exists! Choose a new name.')
			else:
				orch.publish_data(data, user, selected['job'], dtype, 'x' )
				orch.publish_data(lbls, user, selected['job'], dtype, 'y' )									
				flash('Success!')

	elif request.method == 'POST':
		flash("All fields must be filled out!")

	return render_template('status.html',title='Job Status',form=form)

def read_data(f):
	if '.csv' in f.filename:
		return pd.read_csv(f)
	return pd.read_table(f)

def format_data(X,y):
	if y.shape[1] == 1:
		y = [x[1] for x in y.itertuples()]
	if True: # Change this to check for PIC type images
		return np.array(X,dtype=np.float32),np.array(y,dtype=np.int32)

@app.route('/home',methods=['GET','POST'])
def home():
	form = HomeForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('home.html',title='Deep Learning API',form=form)


@app.route('/login',methods=['GET','POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('login.html',title='Login',form=form)

@app.route('/_login',methods=['GET','POST'])
def _login():
	print(request.args)
	print('youve logged in!')
	flash('something')
	return True

@app.route('/signup',methods=['GET','POST'])
def signup():
	form = SignUpForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('signup.html',title='Sign Up',form=form)


@app.route('/_get_users',methods=['GET'])
def get_users():
	users = datastore.list_entities('users')
	users = [x['username'] for x in users]
	return jsonify(users=users)


@app.route('/_add_user',methods=['GET','POST'])
def add_user():
	user = request.args.get('user', 0, type=str)		
	if datastore.username_exists(user):
		return jsonify(out = {'status':600,"msg":"Username Exists"})
	else:
		exec("params =" + str(request.args.get('params', 0, type=str)),globals())	
		datastore.add_user(user,params)
		return jsonify(out = {'status':200,"msg":"OK"})
	return jsonify(out = {'status':400,"msg":"Unknown Error"})


