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

    LayerTypes = [('rad_Conv','Convolutional'), ('rad_Full','Fully Connected')]
    DropDowns  = [("dd_Choice1","Choice1"),("dd_Choice2","Choice2")]

    LayerType = RadioField('LayerType', choices=LayerTypes, default='rad_Conv')
    DropDown  = SelectField('DropDown', choices=DropDowns)
    Name      = StringField('Name', validators=[DataRequired("Error msg if no input")])    
    CheckBox  = BooleanField('CheckBox',default=False)
    Files     = FileField('Import',validators=[FileRequired(), FileAllowed(['csv'], 'Must be in .csv format.')])
    Date      = DateField('Date',validators=[validators.InputRequired()], format='%m/%d/%Y')
