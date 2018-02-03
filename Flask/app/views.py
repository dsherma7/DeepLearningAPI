from flask import render_template, flash, jsonify, Flask, request, Response
from app import app
from json import dumps
from .forms import * 
from wtforms import SelectField, TextField, TextAreaField, validators, StringField, SubmitField


# Makes the substiution form based on SubForm
@app.route('/', methods=['GET', 'POST'])
def sub_form():
    form = MainForm()
    if form.validate_on_submit():
        flash("This message appears after clicking submit!")
    return render_template('index.html',
                           title='Sub Form',
                           form=form)
