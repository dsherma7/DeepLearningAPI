# Imports the Google Cloud client library
from google.cloud import datastore
import numpy as np
from time import gmtime, strftime
from importlib.machinery import SourceFileLoader

helper = SourceFileLoader("datastore", "../WebRequest/helper.py").load_module()

# # Instantiates a client
client = datastore.Client(project="tensorfloss")	
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
	# params = flatten(params)
	user = params['train']['user']
	job = helper.parse_JobId(params['train']['job'])
	task_key = client.key('jobs', user+job)
	task = datastore.Entity(key=task_key)	
	for key in params:
		task[key] = params[key]
	task['date'] = strftime("%m/%d/%y",gmtime())
	task['job'] = job
	task['user'] = user
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
		raise NameError("More than one matching job for "+user+"/"+job)
	return (this_job[0])

def get_jobs_from_user(user):
	# Reads all jobs and then returns any jobs for a given user
	all_jobs = list_entities('jobs')
	jobs = [x for x in all_jobs if (x['user'] == user)]
	# jobs = 	[expand(x) for x in jobs]
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
	if len(all_jobs) == 0:
		return helper.parse_JobId(1)
	max_job = max(int(x['train']['job'].replace('J','')) for x in all_jobs)
	return helper.parse_JobId(max_job+1)

def get_job_stats(user):
	# Gets the stats for each job of a given user
	all_jobs = get_jobs_from_user(user)
	job_stats = []
	for each_job in all_jobs:
		dic = {x:each_job[x] for x in each_job if x != 'train' and x != 'layers'}
		[dic.update({x:each_job['train'][x]}) for x in each_job['train']]
		job_stats.append(dic)
	return (job_stats)

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

def change_status(user,job,status):
	set_val(user,job,'status',status)	

def set_storage_loc(user,job,path):
	set_val(user,job,'storage-loc',path)	

def set_progress(user,job,val):
	set_val(user,job,'progress',val)

