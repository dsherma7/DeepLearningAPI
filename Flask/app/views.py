from flask import render_template, flash, jsonify, Flask, request, Response
from app import app, csrf
from json import dumps
from .forms import * 
from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField

activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"]
paddings = ["Valid","Same"]


# Makes the substiution form based on SubForm
@app.route('/', methods=['GET', 'POST'])
def sub_form():

    form = MainForm()

    if form.validate_on_submit():
        flash("This message appears after clicking submit!")
        print(request.form)
    return render_template('index.html',
                           title='Sub Form',
                           form=form)


@csrf.exempt
@app.route('/submit_extra', methods=['POST'])
def sub_extra():
	print(request.get_json())
	return {'Status':'200 OK'}