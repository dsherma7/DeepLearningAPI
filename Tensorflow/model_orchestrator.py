from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import numpy as np
import sys
import tensorflow as tf
import random
from network import Network


def train_network( network,x,y):
    return network.train(x,y)

def eval_network( nework,x,y):
    return network.eval(x,y)

def create_network( params):
    return Network(params)




# adapted the mnist tutorial to create a configurable convolutional neural network 
# over the mnist dataset  : https://www.tensorflow.org/tutorials/layers

def main(unused_argv):
    mnist = tf.contrib.learn.datasets.load_dataset("mnist")
    train_data = mnist.train.images  # Returns np.array
    train_labels = np.asarray(mnist.train.labels, dtype=np.int32)
    eval_data = mnist.test.images  # Returns np.array
    eval_labels = np.asarray(mnist.test.labels, dtype=np.int32)
    params = {
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
                'layer_type': 'pool2d',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'layer_type': 'conv2d',
                'filters':64,
                'kernel_size':[5, 5],
                'padding': "same",
                'activation': tf.nn.relu
            },
            {
                'layer_type': 'pool2d',
                'pool_size':[2, 2],
                'strides':2
            },
            {
                'layer_type': 'fcl',
                'units':1024,
                'activation':tf.nn.relu,
                'drop_out': {
                    'rate': 0.4

                }
            },
            {
                'layer_type': 'out',
                'units':10
            }
        ],
        'mode': tf.estimator.ModeKeys.TRAIN,
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
            'training_steps': 20000
        }
    }
    print('create network')
    network  = create_network(params)
    classifier = tf.estimator.Estimator(
        model_fn=network.model)
    print('train')
    train_network(network,train_data,train_labels)
    print('evaluate')
    print(eval_network(network,eval_data,eval_labels))


if __name__ == "__main__":
    tf.app.run()












