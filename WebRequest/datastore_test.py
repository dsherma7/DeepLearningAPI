
import datastore
from datastore import *
# necessary params needed from UI upon
# submitting a new job. Note, this is 
# not all the fields for each layer, but
# just add the key:value pair as needed.
# Also, the division between description/model
# is arbitrary, but this could be helpful on the UI
# side of things. 
train = {"user":"dsherman",
	     "project":"One more for testing purposes",
	     "comments":"This is a note, and should be editable.",
	     "status":"built",
	     "input":"1D",
	     "num_classes":"52",
	     'optimizer': {'type': 'gradient_descent'},
	     'loss': {'type': 'soft_max_cross_entropy'},
	     'learning_rate':0.001,
	     'batch_size':100,
	     'shuffle_batch':True,
	     'training_steps': 1            
        }

layer1 = {'type':'conv','filter':2555,'activtion':'ReLU','padding': "same"}
layer2 = {'type':'drop','rate':0.1,'training':0,'units':1024}
layer3 = {'type':'conv','filter':3412,'activtion':'ReLU'}
layer4 = {'type':'dense','activtion':'ExpLU','units':1024}
layer5 = {'type':'dense','activtion':'ExpLU'}
layer6 = {'type':'dense','activtion':'ExpLU'}
layers = [layer1,layer2,layer3,layer2,layer4,layer6,layer1]
params = {'train':train,'layers':layers}

##END Necessary params
add_job(params)


#### ADD User #####
user = {"username":"dsherman",
		"password":"password1",
		"email":"desherman@ucdavis.edu"}
# Check user doesn't exist
if not username_exists(user['username']):
	add_user(user['username'],user)





