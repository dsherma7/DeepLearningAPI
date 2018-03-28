import Tensorflow.user_space_utils as utils
from Tensorflow.network import Network
import WebRequest.datastore as ds
import pickle as pickle
import tensorflow as tf
import os

USER_DATA_PATH = utils.USER_DATA_PATH

def create_user_space(username, job):
    if not os.path.exists(USER_DATA_PATH+'/'+username):
        os.makedirs(USER_DATA_PATH+'/'+username)
    if not os.path.exists(USER_DATA_PATH+'/'+username+'/'+job):
        os.makedirs(USER_DATA_PATH+'/'+username+'/'+job)
        os.makedirs(USER_DATA_PATH+'/'+username+'/'+job+'/model')

def get_user_space_data(username, job, data_set_type, y=True):
    data = load_data(username,job, data_set_type, 'x' )
    labels = None
    if y:
        labels = load_data(username,job, data_set_type, 'y' )
    params = get_architecture(username, job)
    network  = Network(username,job,params)
    return data, network, labels

def save_object(obj, username, job,data_set_type, data_type):
    filename = USER_DATA_PATH+'/'+username+'/'+\
        job+'/'+data_set_type+'_'+data_type
    print(filename)
    with open(filename, 'wb') as output:
        pickle.dump(obj, output, pickle.HIGHEST_PROTOCOL)


def load_data(username, job, data_set_type,data_type):
    user_sub_path = utils.create_user_sub_path(username, job)
    filename =  USER_DATA_PATH+user_sub_path+data_set_type+'_'+data_type
    with (open(filename, "rb")) as openfile: 
        return pickle.load(openfile)

def read_userspace(username, job):
    dirname = USER_DATA_PATH+'/'+username+'/'+job+'/'
    if os.path.isdir(dirname):
        return os.listdir(dirname)
    return []


def get_architecture(username, job_id):
    print (username,job_id)
    return ds.get_architecture(username, job_id)
    return  {
        'layers': [
            {
                'type': 'Input',
                'shape': [-1, 28, 28, 1]
            },
            {
                'type': 'conv',
                'filters':32,
                'kernel_size':[5, 5],
                'padding': "same",
                'activation': 'relu'
            },
            {
                'type': 'maxpool',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'type': 'conv',
                'filters':64,
                'kernel_size':[5, 5],
                'padding': "same",
                'activation': 'relu'
            },
            {
                'type': 'maxpool',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'type': 'fcl',
                'units':1024,
                'activation':'relu'
            },
            {
                'type': 'drop_out',
                'rate': 0.4
            },
            {
                'type': 'fcl',
                'units':1024,
                'activation':'relu',
            },
            {
                'type': 'drop_out',
                'rate': 0.4
            },
            {
                'type': 'out',
                'units':10
            }
        ],
        'train': {            
            'optimizer': {
                'name': 'grad optimizer',
                'type': 'grad',
                'learning_rate':0.001,
                'locking': 0
            },
            'loss': 'soft_max_cross_entropy',            
            'batch_size':100,
            'shuffle_batch':True,
            'training_steps': 1,
            'input_size':'2D'
        }
    }