from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import Tensorflow.user_space_utils as utils
import numpy as np
import tensorflow as tf
import random
import math

tf.logging.set_verbosity(tf.logging.INFO)
USER_DATA_PATH = utils.USER_DATA_PATH

class Network:
    def __init__(self,username,job,params):
        user_sub_path = utils.create_user_sub_path(username, job)
        self.params = params
        print(USER_DATA_PATH+user_sub_path)
        self.classifier = tf.estimator.Estimator(
            model_fn=self.model, model_dir=USER_DATA_PATH+user_sub_path+'/model')


    def model(self,features, labels, mode):    
        prev_layer_out = None
        for i in self.params['layers']:
            if i['type'] == 'input':
                prev_layer_out = tf.reshape(features['x'],i['shape'])
            elif i['type'] == 'conv':
                activation = self.parse_activation(i['activation'])
                prev_layer_out = self.get_conv()(
                    inputs=prev_layer_out,
                    filters=i['filters'],
                    kernel_size=i['kernel_size'],
                    padding=i['padding'],
                    activation=activation)
            elif i['type'] == 'maxpool':
                prev_layer_out = self.get_max_pooling()(
                    inputs=prev_layer_out, 
                    pool_size=i['pool_size'], 
                    strides=i['strides'])
            elif i['type'] == 'fcl':
                activation = self.parse_activation(i['activation'])
                prev_layer_out = tf.contrib.layers.flatten(prev_layer_out)
                prev_layer_out = tf.layers.dense(inputs=prev_layer_out, units=i['units'], activation=activation)
            elif i['type'] == 'drop_out':
                prev_layer_out = tf.layers.dropout(
                    inputs=prev_layer_out, rate=i['rate'], 
                    training=mode == tf.estimator.ModeKeys.TRAIN)
            elif i['type'] == 'out':
                prev_layer_out = tf.layers.dense(inputs=prev_layer_out, units=i['units'])

        predictions =  {
            "class": tf.argmax(input=prev_layer_out, axis=1),
            "probabilities": tf.nn.softmax(prev_layer_out, name="softmax_tensor")
        }
        if mode == tf.estimator.ModeKeys.PREDICT:
            return tf.estimator.EstimatorSpec(mode=mode, predictions=predictions)
        loss = None
        # if self.params['train']['loss'] == 'soft_max_cross_entropy':
        if self.params['train']['loss'] == 'softmax':
            loss = tf.losses.sparse_softmax_cross_entropy(labels=labels, logits=prev_layer_out)
        if mode == tf.estimator.ModeKeys.TRAIN:
            optimizer = None
            if self.params['train']['optimizer']['type'] == 'grad':
                optimizer = tf.train.GradientDescentOptimizer(learning_rate=self.params['train']['optimizer']['rate'])
            train_op = optimizer.minimize(
                loss=loss,
                global_step=tf.train.get_global_step())
            return tf.estimator.EstimatorSpec(mode=mode, loss=loss, train_op=train_op)
        eval_metric_ops = {
            "accuracy": tf.metrics.accuracy(
                labels=labels, predictions=predictions["class"])}
        return tf.estimator.EstimatorSpec(
            mode=mode, loss=loss, eval_metric_ops=eval_metric_ops)


    def train(self,x,y):
        train_input_fn = tf.estimator.inputs.numpy_input_fn(
            x={"x": x},
            y=y,
            batch_size=int(self.params['train']['batch_size']),
            num_epochs=None,
            shuffle=bool(self.params['train']['shuffle_batch']))
        self.classifier.train(
            input_fn=train_input_fn,
            steps=int(self.params['train']['training_steps']))

    def eval(self,x, y):
        eval_input_fn = tf.estimator.inputs.numpy_input_fn(
            x={"x": x},
            y=y,
            num_epochs=1,
            shuffle=False)
        eval_results = self.classifier.evaluate(input_fn=eval_input_fn)
        return eval_results

    def predict(self,x):
        pred_input_fn = tf.estimator.inputs.numpy_input_fn(
            x={"x": x},
            num_epochs=1,
            shuffle=False)
        pred_results = self.classifier.predict(input_fn=pred_input_fn)
        return pred_results

    def parse_activation(self,act) :
        activation=None
        if act == 'relu':
            activation = tf.nn.relu
        elif act == 'sigmoid':
            activation = tf.sigmoid
        elif act == 'tanh':
            activation = tf.tanh
        return activation

    def get_max_pooling(self) :
        self.params['train']['input_size'] = self.params['train']['input_size'].replace("'", "")
        if self.params['train']['input_size'] == '2D':
            return tf.layers.max_pooling2d
        elif self.params['train']['input_size'] == '1D':
            return tf.layers.max_pooling1d

    def get_conv(self) :
        self.params['train']['input_size'] = self.params['train']['input_size'].replace("'", "")
        if self.params['train']['input_size'] == '2D':
            return tf.layers.conv2d
        elif self.params['train']['input_size'] == '1D':
            return tf.layers.conv1d











