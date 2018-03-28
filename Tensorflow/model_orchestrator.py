from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import pickle as pickle
import numpy as np
import random
import sys

sys.path.append('../')
import Tensorflow.network as net
import Tensorflow.user_space_handler as us
import Tensorflow.user_space_utils as utils
import WebRequest.datastore as ds

def publish_data(obj, username, job, data_set_type, data_type):
    us.create_user_space(username, job)
    us.save_object(obj, username, job,data_set_type, data_type)

def train_network(username, job, data_set_type):
    ds.change_status(username,job,'Training')        
    data, network, labels = us.get_user_space_data(username, job, data_set_type)
    network.train(data,labels)
    ds.change_status(username,job,'Trained')        
    ds.set_progress(username,job,100)        

def eval_network(username, job, data_set_type):
    ds.change_status(username,job,'Evaluating')        
    data, network, labels = us.get_user_space_data(username, job, data_set_type)
    ds.change_status(username,job,'Evaluated')   
    return network.eval(data,labels)

# returns an array of objects:
#   - {'classes'[[the predicted class as an int]], 
#       'probabilities:[[the probabilities of each class as a array of floats]]'
#     }
def predict(username, job, data_set_type):
    ds.change_status(username,job,'Predicting')        
    data, network, _ = us.get_user_space_data(username, job, data_set_type)
    expression = network.predict(data)
    out = []
    for i in expression:
        out.append(i)
    ds.change_status(username,job,'Predicted')             
    return out

def create_network(username, job, params):    
    ds.change_status(username,job,'Building')        
    us.create_user_space(username, job)
    if not params:
        params = us.get_architecture(username, job)
    print('create network')
    net.Network(username,job,params=params)
    ds.change_status(username,job,'Built')        

def get_dtypes(username, job):
    dirs = us.read_userspace(username,job)
    dtypes = [x.replace('_x','') for x in dirs if '_x' in x]
    return dtypes












