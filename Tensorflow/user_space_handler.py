import pickle as pickle
import datastore as ds
import tensorflow as tf
import os
# from network import Network
# import user_space_utils as utils
from importlib.machinery import SourceFileLoader
Network = SourceFileLoader("network", "../Tensorflow/network.py").load_module()
utils   = SourceFileLoader("user_space_utils", "../Tensorflow/user_space_utils.py").load_module()

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


def get_architecture(username, job_id):
    ds.get_architecture('njoodi', '001')
    return  {
        'layers': [
            {
                'layer_type': 'input',
                'shape': [-1, 28, 28, 1]
            },
            {
                'layer_type': 'conv2d',
                'filters':32,
                'kernel_size':[5, 5],
                'padding': "same",
                'activation': tf.nn.relu
            },
            {
                'layer_type': 'maxpool2d',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'layer_type': 'conv2d',
                'filters':64,
                'kernel_size':[5, 5],
                'padding': "same",
                'activation': 'relu'
            },
            {
                'layer_type': 'maxpool2d',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'layer_type': 'fcl',
                'units':1024,
                'activation':'relu',
                'drop_out': {
                    'rate': 0.4

                }
            },
            {
                'layer_type': 'fcl',
                'units':1024,
                'activation':'relu',
                'drop_out': {
                    'rate': 0.4

                }
            },

            {
                'layer_type': 'out',
                'units':10
            }
        ],
        'train': {
            'loss': {
                'loss_type': 'soft_max_cross_entropy'
            },
            'optimizer': {
                'train_type': 'gradient_descent'
            },
            'learning_rate':0.001,
            'batch_size':100,
            'shuffle_batch':True,
            'training_steps': 1
        }
    }