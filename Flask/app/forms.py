from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, BooleanField, SelectField, RadioField, DateField, SubmitField, validators
from wtforms.validators import DataRequired, required
from wtforms.fields.html5 import IntegerField

''' 
Components:
    SelectField: Drop-Down box
    RadioField: Radio Buttons
    StringField: TextBoxes
    BooleanField: CheckBoxes
    FileField: File Browser Field
    DateField: Date/Time Field
'''




class MainForm(FlaskForm):
    '''
    Generates Substitute form. Note: PlateType not displyed
    '''
    # Note: For these choices elements, the pairs are ('Variable Name','What the User Sees')

    Sizes      = [('1D','1D'),('2D','2D'),('3D','3D')]
    LayerTypes = [('Select','Select a Layer'), ('Conv','Convolutional'), ('Dense','Fully Connected'), ('MaxPool','Max Pooling'), ('Drop','Dropout')]
    Optimizers = [('grad','Gradient Descent'),('adam','Adam Optimizer')]


    InputSize = SelectField('InputSize', choices=Sizes, default="2D")
    LayerType = SelectField('LayerType', choices=LayerTypes, default='Select')
    Optimizer = SelectField('Optimizer', choices=Optimizers, default="grad")
    Name      = StringField('Name', validators=[DataRequired("Error msg if no input")])    
    Files     = FileField('Import',validators=[FileRequired(), FileAllowed(['csv'], 'Must be in .csv format.')])
    Date      = DateField('Date',validators=[validators.InputRequired()], format='%m/%d/%Y')
