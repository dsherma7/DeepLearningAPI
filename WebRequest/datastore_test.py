
import datastore

# necessary params needed from UI upon
# submitting a new job. Note, this is 
# not all the fields for each layer, but
# just add the key:value pair as needed.
# Also, the division between description/model
# is arbitrary, but this could be helpful on the UI
# side of things. 
description = {"user":"dsherman",
			   "job":helper.parse_JobId(2),
			   "project":"for a test project",
			   "status":"training"}
model = {"input":"1D",
		"num_classes":"5",
		"optimizer":"Adadelta"}
layer1 = {'type':'conv','filter':'2555','activtion':'ReLU'}
layer2 = {'type':'drop','rate':'0.1','training':'0'}
layer3 = {'type':'conv','filter':'3412','activtion':'ReLU'}
layer4 = {'type':'dense','activtion':'ExpLU'}
layer5 = {'type':'dense','activtion':'ExpLU'}
layer6 = {'type':'dense','activtion':'ExpLU'}
params = {'description':description,
		  'model':model,
		  'layer1':layer1,
		  'layer2':layer3,
		  'layer3':layer4,
		  'layer4':layer5,
		  'layer5':layer2,
		  'layer6':layer1,
		  'layer7':layer6}
##END Necessary params
add_job(params)