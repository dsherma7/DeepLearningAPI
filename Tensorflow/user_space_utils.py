import WebRequest.helper as helper
import os

USER_DATA_PATH = '../user_space/'

def create_user_sub_path(user,job):	
	job = helper.parse_JobId(job)
	return user+'/'+job+'/'