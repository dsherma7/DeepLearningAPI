# Imports the Google Cloud client library
from google.cloud import datastore
import numpy as np
from time import gmtime, strftime
from importlib.machinery import SourceFileLoader

helper = SourceFileLoader("datastore", "../WebRequest/helper.py").load_module()

# # Instantiates a client
client = datastore.Client(project="tensorfloss")

## Helper functions for the functions needed for 
## Python server and user interfaces
def format(val):
	if type(val) == list:
		return [format(x) for x in val]
	if type(val) == dict:
		return {x:format(val[x]) for x in val}

	try:
		float(val)
	except ValueError:
		return str(val)
	try: 
		int(val)
	except ValueError:		
		return float(val)
	return int(val)
	
def flatten(params):
	new_params = {}
	cnt = 1
	for key in params:
		if 'layer' in key:
			for layer in params[key]:
				new_params['layer'+str(cnt)] = str(layer)
				cnt=cnt+1
		else:
			for task in params[key]:
				new_params[task] = params[key][task]
	return(new_params)	

def expand(params):
	train = {}
	layers = []
	# Get the layers
	for key in np.sort([x for x in params.keys() if 'layer' in x]):
		expanded = locals()
		exec("var =" + params[key],globals(),expanded)
		layers.append({x:format(expanded['var'][x]) for x in expanded['var']})
	# Get the 
	for key in params:			
		if 'layer' not in key:
			train[key] = params[key]
	return({'train':train,'layers':layers})
	
def add_job(params):	
	'''
	Stores the values in params for a
	given username/job as key=[username][job]
	user: Username of new job, the primary key
	job:  Job ID to reference within each column (2nd key)
	params: A 2 layer dictionary of the values to add to 
		    the new row. The keys in the first layer are 
		    ignored, unless they are of the form layer<i>.			    
		-project: Description of project
		-status: Current status of job (built/trained)
		-storage-loc: Location of weights on Python server		
	'''			
	params = flatten(params)
	user = params['user']
	job = helper.parse_JobId(params['job'])
	task_key = client.key('jobs', user+job)
	task = datastore.Entity(key=task_key)	
	for key in params:
		task[key] = params[key]
	task['date'] = strftime("%m/%d/%y",gmtime())
	task['job'] = job
	client.put(task)	

def list_entities(kind):
	# returns all entities of a given kind use kind=jobs 
	# for each jobs, and kind=user for each user
	query = client.query(kind=kind)
	return list(query.fetch())

def get_job(user,job):
	# Reads a specific job from with key <user><job>
	job = helper.parse_JobId(job)
	all_jobs = list_entities('jobs')
	this_job = [x for x in all_jobs if (x['user']+helper.parse_JobId(x['job']) == user+job)]
	if len(this_job) > 1:
		return([expand(x) for x in this_job])
	return(expand(this_job[0]))

def get_jobs_from_user(user):
	# Reads all jobs and then returns any jobs for a given user
	all_jobs = list_entities('jobs')
	jobs = [x for x in all_jobs if (x['user'] == user)]
	jobs = 	[expand(x) for x in jobs]
	return (jobs)

def set_val(user,job,key,val):
	job = helper.parse_JobId(job)
	with client.transaction():
		Key = client.key('jobs', user+job)
		task = client.get(Key)
		if not task:
			raise ValueError('Job {} does not exist.'.format(user+job))
		task[key] = val
		client.put(task)

# Information the UI would need to get 
def get_next_jobid(user):
	# Use this to get the next available job id for a user
	all_jobs = get_jobs_from_user(user)
	max_job = max(int(x['train']['job'].replace('J','')) for x in all_jobs)
	return helper.parse_JobId(max_job+1)

def get_job_stats(user):
	# Gets the stats for each job of a given user
	all_jobs = get_jobs_from_user(user)
	all_jobs = [{x:each_job['train'][x] for x in each_job['train']} for each_job in all_jobs]
	return (all_jobs)

def add_user(user,params):
	'''
		Addes a user entity with the 
		provided parameters.
	'''
	task_key = client.key('users', user)
	task = datastore.Entity(key=task_key)
	for key in params:
		task[key] = params[key]
	client.put(task)

def delete_job(user,job):
	key = client.key('jobs', user+job)
	client.delete(key)

def delete_user(user):
	key = client.key('users', user)
	client.delete(key)	

def set_comment(user,job,comment):
	set_val(user,job,'comment',comment)	

def username_exists(user):
	users = list_entities('users')
	if len([x for x in users if x['username']==user]):
		return (True)
	return (False)

# For the python server to use to change the DB
def get_architecture(user,job):
	'''
		Returns the necessary config parameters for a 
		job for a given user. Output is of the form
		{train:{}, layers:[]} where train is a set of
		global paramaters (like optimizer) and layers
		is a list of params for each layer.
	'''
	job = get_job(user,job)
	return job
	description = {x:job[x] for x in job if 'layer' not in x}
	layers = [job[x] for x in job if 'layer' in x]
	return ({'train':description,'layers':layers})

def change_status(user,job,status):
	set_val(user,job,'status',status)	

def set_storage_loc(user,job,path):
	set_val(user,job,'storage-loc',path)	

def set_progress(user,job,val):
	set_val(user,job,'progress',val)

