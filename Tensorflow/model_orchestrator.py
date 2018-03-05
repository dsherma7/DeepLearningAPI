from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import numpy as np
import sys
sys.path.insert(0, '../WebRequest')
import random
# from network import Network
import pickle as pickle
# import user_space_handler as us
# import user_space_utils as utils
from importlib.machinery import SourceFileLoader
network = SourceFileLoader("network", "../Tensorflow/network.py").load_module()
utils   = SourceFileLoader("user_space_utils", "../Tensorflow/user_space_utils.py").load_module()
us      = SourceFileLoader("user_space_utils", "../Tensorflow/user_space_handler.py").load_module()



def publish_data(obj, username, job, data_set_type, data_type):
    us.create_user_space(username, job)
    us.save_object(obj, username, job,data_set_type, data_type)


def train_network(username, job, data_set_type):
    data, network, labels = us.get_user_space_data(username, job, data_set_type)
    network.train(data,labels)

def eval_network(username, job, data_set_type):
    data, network, labels = us.get_user_space_data(username, job, data_set_type)
    return network.eval(data,labels)

# returns an array of objects:
#   - {'classes'[[the predicted class as an int]], 
#       'probabilities:[[the probabilities of each class as a array of floats]]'
#     }
def predict(username, job, data_set_type):
    data, network, _ = us.get_user_space_data(username, job, data_set_type)
    expression = network.predict(data)
    out = []
    for i in expression:
        out.append(i)
    return out

def create_network(username, job):
    params = us.get_architecture(username, job)
    print('create network')
    Network(username,job,params=params)
















