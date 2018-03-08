import os
from importlib.machinery import SourceFileLoader
helper = SourceFileLoader("helper", "../WebRequest/helper.py").load_module()
USER_DATA_PATH = '../user_space/'

def create_user_sub_path(user,job):	
	job = helper.parse_JobId(job)
	return user+'/'+job+'/'