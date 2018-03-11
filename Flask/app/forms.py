from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, BooleanField, DecimalField, SelectField, RadioField, DateField, SubmitField, FieldList, FormField, HiddenField, validators
from wtforms.validators import DataRequired, required, NoneOf
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

Activations = ["ReLU","ReLU6","CReLU","ExpLU","SoftPlus","SoftSign","Sigmoid","Tanh"]
Paddings = ["Valid","Same"]

class MainForm(FlaskForm):
    '''
    Generates Substitute form. Note: PlateType not displyed
    '''
    # Note: For these choices elements, the pairs are ('Variable Name','What the User Sees')
    Sizes      = [('1D','1D'),('2D','2D'),('3D','3D')]
    LayerTypes = [('Select','Select a Layer'), ('Conv','Convolutional'), ('Dense','Fully Connected'), ('MaxPool','Max Pooling'), ('Drop','Dropout'),('BatchNorm','Batch Normalization'),('Input','Input'),('Output','Output')]
    Optimizers = [('Select','Select an Optimizer'),('grad','Gradient Descent'),('adadelta','Adadelta'),('adagrad','Adagrad'),('adagradda','Adagrad Dual Averaging'),('adam','Adam Optimizer'),('momentum','Momentum Optimizer')]
    LossFuncs  = [('Select','Select a Loss Function'), ("log","Log Loss"), ("hinge","Hinge Loss"), ("mse","Mean Squared Error"), ("AbsDif","Absolute Difference"), ("CosDif","Cosine Difference"), ("mpse","Mean Pairwise Squared Error"), ("sigmoid","Sigmoid Cross Entropy"), ("softmax","Softmax Cross Entropy"), ("sparseSoftmax","Sparse Softmax Cross Entropy")]

    InputSize  = SelectField('InputSize', choices=Sizes, default="2D")
    # InputShape = IntegerField('InputShape')
    LayerType  = SelectField('LayerType', choices=LayerTypes, default='Select')
    Optimizer  = SelectField('Optimizer', choices=Optimizers, default='grad', validators=[validators.NoneOf(values=['Select'], message='This field is required')])
    LossFunct  = SelectField('Loss Function', choices=LossFuncs, default='mse', validators=[validators.NoneOf(values=['Select'], message='This field is required')])
    Name       = StringField('Name', validators=[DataRequired('This field is required')])    
    Comments   = StringField('Comments')    
    Batch_Size = IntegerField('Batch_Size',default=100)
    Train_Steps= IntegerField('Train_Steps',default=1)
    Shuffle    = BooleanField('Shuffle',default=True)

class StatusForm(FlaskForm):
    '''
    Generates the Job Status page
    '''
    Files    = FileField('Import',validators=[FileRequired(), FileAllowed(['csv','zip','tar','png','xlsx','xls'], 'Invalid data format!')])
    Labels   = FileField('Labels',validators=[FileRequired(), FileAllowed(['csv','zip','tar','png','xlsx','xls'], 'Invalid data format!')])
    
    DataType = StringField('DataType', validators=[DataRequired("The data must be named!")])
    username = HiddenField("username")
    selected = HiddenField("selected")

class LoginForm(FlaskForm):
    '''
    Generates the Login Form. No WTF elements are used
    '''    

class SignUpForm(FlaskForm):
    '''
    Generates the Signup Form. Also, no WTF elements are used
    '''    

class HomeForm(FlaskForm):
    '''
    Generates the Home Page Form. Also, no WTF elements are used
    '''        