from flask import render_template, flash, jsonify, Flask, request, Response
from app import app
from json import dumps
from .forms import * 
from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField

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
		# A List of activation functions to choose from (defined above)
		row1 = {"Name":"Activation","Fields":[{"Field":"SelectField","Choices":activations}]}
		# A textbox for each filter dimension
		row2 = {"Name":"Filter","Fields":[{"Field":"FilterField","Size":int(input_size[0])}]}
		print("here")
		return jsonify(params=[row1,row2])


	
	return ""