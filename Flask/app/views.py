from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField
from flask import render_template, flash, jsonify, Flask, request, Response
from sklearn.model_selection import train_test_split
from importlib.machinery import SourceFileLoader
from werkzeug import secure_filename
from app import app, csrf
import pickle as pickle
from .responses import * 
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

#############################################
# 		Page Rendering Functions
#############################################

@app.route('/', methods=['GET', 'POST'])
def main():
	form = MainForm()
	if form.validate_on_submit():
		flash("This message appears after clicking submit!")	
	return render_template('index.html',title='TensorFloss',form=form)	

@app.route('/home',methods=['GET','POST'])
def home():
	form = HomeForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('home.html',title='Dashboard',form=form)

@app.route('/build', methods=['GET', 'POST'])
def build_network():   
	form = BuildForm()
	if form.validate_on_submit():
		flash("This message appears after clicking submit!")		
	return render_template('buildjob.html',title='Build a New Network',form=form)

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
			
			if data.shape[0] != lbls.shape[0]:
				flash('Error, data mismatched! Check data and try again.')

			if dtype in orch.get_dtypes(user,selected['job']):
				flash('Data type already exists! Choose a new name.')
			else:
				orch.publish_data(data, user, selected['job'], dtype, 'x' )
				if l1 != None:
					orch.publish_data(lbls, user, selected['job'], dtype, 'y' )									
				flash('Success!')

	elif request.method == 'POST':
		flash("All fields must be filled out!")

	return render_template('status.html',title='Job Status',form=form)

@app.route('/login',methods=['GET','POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('login.html',title='Login',form=form)


@app.route('/signup',methods=['GET','POST'])
def signup():
	form = SignUpForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('signup.html',title='Sign Up',form=form)



#############################################
# 		Web Request Functions
#############################################

@app.route('/_submit_layers', methods=['POST'])
def submit_layers():	
	if request.method == 'POST':
		print(divider+str(request.data)+divider)
		print(divider+str(request.args)+divider)
		params = request.get_json()
		user = params['train']['user']
		job = datastore.get_next_jobid(user)
		params['train']['job'] = job

		np.save("params.npy", params)

		datastore.add_job(params);		
		orch.create_network(user, job, params)
		return STATUS_OK("Job submitted as "+job)
	return METHOD_NOT_ALLOWED("Method " + request.method + " is not allowed!")

@app.route('/_get_jobs',methods=['GET'])
def _get_jobs():
	user = request.args.get('user', 0, type=str)
	jobs = datastore.get_job_stats(user)
	return STATUS_OK('Job Request Successful!',{'jobs':jobs})

@app.route('/_set_comment',methods=['SET'])
def _set_comment():
	params = request.get_json()
	datastore.set_comment(params['user'],params['job'],params['comment'])
	return STATUS_OK("Comment Set Successfully!")

@app.route('/_train',methods=['POST'])
def _train_model():
	params = request.get_json()
	user = params['user']
	job = params['job']
	datatype = params['datatype']
	print(divider+user+job+datatype+divider)
	try:
		orch.train_network(user, job, datatype)
		return STATUS_OK("Job "+job+" done Training!")
	except:
		print("Error")
	return BAD_REQUEST("Training data "+datatype+" on job "+job+" failed!")

@app.route('/_test',methods=['POST'])
def _test_model():
	params = request.get_json()
	user = params['user']
	job = params['job']
	datatype = params['datatype']
	try:
		preds = orch.predict(user, job, datatype)
		classes = [float(x['class']) for x in preds]
		probs = [[float(x) for x in y['probabilities']] for y in preds] 	
		return STATUS_OK("Predicting "+datatype+" on "+job+" Successful!",{"probs":probs,"classes":classes})
	except:
		print("Error")
	return BAD_REQUEST("Predicting on data "+datatype+" with job "+job+" failed!")

@app.route('/_evaluate',methods=['POST'])
def _eval_model():
	params = request.get_json()
	user = params['user']
	job = params['job']
	datatype = params['datatype']
	try:
		evals = orch.eval_network(user, job, datatype)
		return STATUS_OK("Evaluating "+datatype+" on "+job+" Successful!",{'evals':{x:round(float(evals[x]),3) for x in evals}})
	except:
		print("Error")
	return BAD_REQUEST("Evaluating on data "+datatype+" with job "+job+" failed!")


@app.route('/_get_dtypes',methods=['GET'])
def _get_dtypes():	
	user = request.args.get('user', 0, type=str)
	job = request.args.get('job',  0, type=str)	
	dtypes = orch.get_dtypes(user,job)
	return STATUS_OK("Datatypes retrieved!",{"dtypes":dtypes})

@app.route('/_archive',methods=['SET'])
def _archive():	
	params = request.get_json()
	user = params['user']
	job = params['job']
	datastore.change_status(user,job,"archived")
	return STATUS_OK("Job "+job+" Archived Successfully!")

def read_data(f):
	if f == None:
		return f
	if '.csv' in f.filename:
		return pd.read_csv(f)
	return pd.read_table(f)

def format_data(X,y):
	if len(y.shape)>1 and y.shape[1] == 1:
		y = [x[1] for x in y.itertuples()]
	if True: # Change this to check for PIC type images
		return np.array(X,dtype=np.float32),np.array(y,dtype=np.int32)

@app.route('/_get_users',methods=['GET'])
def get_users():
	users = datastore.list_entities('users')
	users = [x['username'] for x in users]
	return STATUS_OK("Users Returned Successfully!",{"users":users})

@app.route('/_add_user',methods=['SET'])
def add_user():
	params = request.get_json()
	user = params['user']
	if datastore.username_exists(user):
		return FORBIDDEN("Username Already Exists!")
	else:
		# exec("params =" + str(request.args.get('params', 0, type=str)),globals())	
		datastore.add_user(user,params)
		return STATUS_OK("User "+user+ " Created Successfully!")
	return BAD_REQUEST("Unknown Error!")
