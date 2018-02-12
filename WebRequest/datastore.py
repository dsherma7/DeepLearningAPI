# Imports the Google Cloud client library
from google.cloud import datastore
import helper

# # Instantiates a client
client = datastore.Client(project="tensorfloss")

## Helper functions for the functions needed for 
## Python server and 
def flatten(params):
	new_params = {}
	for key in params:
		if 'layer' in key:
			new_params[key] = str(params[key])
		else:
			for task in params[key]:
				new_params[task] = params[key][task]
	return(new_params)	

def expand(params):
	new_params = {}
	for key in params:
		if 'layer' in key:
			expanded = locals()
			exec("var =" + params[key],globals(),expanded)
			new_params[key] = {x:expanded['var'][x] for x in expanded['var']}
		else:
			new_params[key] = params[key]
	return(new_params)
	
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
	params = flatten_params(params)
	job = helper.parse_JobId(params['job'])
	user = params['user']
	task_key = client.key('jobs', user+job)
	task = datastore.Entity(key=task_key)	
	for key in params:
		task[key] = params[key]
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


# Information the UI would need to get 
def get_next_jobid(user):
	# Use this to get the next available job id for a user
	all_jobs = get_jobs_from_user(user)
	max_job = max(int(x['job'].replace('J','')) for x in all_jobs)
	return helper.parse_JobId(max_job+1)

def get_job_stats(user):
	# Gets the stats for each job of a given user
	all_jobs = get_jobs_from_user(user)
	all_jobs = [{x:each_job[x] for x in each_job if 'layer' not in x} for each_job in all_jobs]
	return (all_jobs)

def add_user(user,params):
	'''
		Addes a user entity with the 
		provided parameters.
	'''
	job = helper.parse_JobId(job)
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
	description = {x:job[x] for x in job if 'layer' not in x}
	layers = [job[x] for x in job if 'layer' in x]
	return ({'train':description,'layers':layers})

def change_status(user,job,status):
	job = helper.parse_JobId(job)
	with client.transaction():
		key = client.key('jobs', user+job)
		task = client.get(key)
		if not task:
			raise ValueError('Job {} does not exist.'.format(user+job))
		task['status'] = status
		client.put(task)

def set_storage_loc(user,job,path):
	job = helper.parse_JobId(job)
	with client.transaction():
		key = client.key('jobs', user+job)
		task = client.get(key)
		if not task:
			raise ValueError('Job {} does not exist.'.format(user+job))
		task['storage-loc'] = path
		client.put(task)



