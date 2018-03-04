from flask import render_template, flash, jsonify, Flask, request, Response
from app import app
import json
from .forms import * 
from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField
from importlib.machinery import SourceFileLoader

datastore = SourceFileLoader("datastore", "../WebRequest/datastore.py").load_module()


activations = ["Sigmoid","ReLU","ExpLU"]

# Makes the substiution form based on SubForm
@app.route('/', methods=['GET', 'POST'])
def sub_form():
    form = MainForm()
    if form.validate_on_submit():
        flash("This message appears after clicking submit!")
    return render_template('index.html',
                           title='Sub Form',
                           form=form)


# Gets the necessary list of params needed for a given layer
@app.route('/_get_params', methods=['GET'])
def function():
	layer_type = request.args.get('layer', 0, type=str)
	input_size = request.args.get('size', 0, type=str)

	if layer_type == 0:
		# Returned when Get request fails
		return ""

	if layer_type == "Convolutional":
		# Name field
		row1 = {"Name":"Name","Fields":[{"Field":"StringField"}]}
		# A List of activation functions to choose from (defined above)
		row2 = {"Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]}
		# A textbox for each filter dimension
		row3 = {"Name":"Filter","Fields":[{"Field":"FilterField","Size":int(input_size[0])}]}
		return jsonify(params=[row1,row2,row3])

	if layer_type == "Max Pooling":
		# Name field
		row1 = {"Name":"Name","Fields":[{"Field":"StringField"}]}
		# A textbox for each filter dimension
		row2 = {"Name":"Pool Size","Fields":[{"Field":"FilterField","Size":int(input_size[0])}]}
		return jsonify(params=[row1,row2])


	return ""



@app.route('/navbar')
def deleteme():
	form = StatusForm()
	return render_template('navbar.html',title='Job Status', form=form)

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
	return(loggedIn())

def loggedIn():
	form = LoginForm()
	if form.validate_on_submit():
		flash('Success!')
	return render_template('logged.html',title='Job Status',form=form)
