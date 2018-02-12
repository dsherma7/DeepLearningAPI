from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import numpy as np
import tensorflow as tf
import random
import math

tf.logging.set_verbosity(tf.logging.INFO)

class Network:
    def __init__(self,params):
        self.classifier =None
        self.params = params

    def model(self,features, labels, mode):
        prev_layer_out = None
        for i in self.params['layers']:
            if i['layer_type'] == 'input':
                prev_layer_out = tf.reshape(features['x'],i['shape'])
            elif i['layer_type'] == 'conv2d':
                prev_layer_out = tf.layers.conv2d(
                    inputs=prev_layer_out,
                    filters=i['filters'],
                    kernel_size=i['kernel_size'],
                    padding=i['padding'],
                    activation=i['activation'])
            elif i['layer_type'] == 'pool2d':
                prev_layer_out = tf.layers.max_pooling2d(
                    inputs=prev_layer_out, 
                    pool_size=i['pool_size'], 
                    strides=i['strides'])
            elif i['layer_type'] == 'fcl':
                prev_layer_out_shape = tf.shape(prev_layer_out)
                prev_layer_out = tf.reshape(prev_layer_out, [-1, prev_layer_out_shape[0]* prev_layer_out_shape[1] * prev_layer_out_shape[2]])
                prev_layer_out = tf.layers.dense(inputs=prev_layer_out, units=i['units'], activation=i['activation'])
                if 'drop_out' in i:
                    prev_layer_out = tf.layers.dropout(
                        inputs=prev_layer_out, rate=i['drop_out']['rate'], 
                        training=mode == tf.estimator.ModeKeys.TRAIN)
            elif i['layer_type'] == 'out':
                prev_layer_out = tf.layers.dense(inputs=prev_layer_out, units=i['units'])

        predictions =  {
            "classes": tf.argmax(input=prev_layer_out, axis=1),
            "probabilities": tf.nn.softmax(prev_layer_out, name="softmax_tensor")
        }
        if mode == tf.estimator.ModeKeys.PREDICT:
            return tf.estimator.EstimatorSpec(mode=mode, predictions=predictions)
        if mode == tf.estimator.ModeKeys.TRAIN:
            loss = None
            if 'soft_max_cross_entropy' in self.params['train']['loss']['loss_type']:
                loss = tf.losses.sparse_softmax_cross_entropy(labels=labels, logits=prev_layer_out)
            optimizer = tf.train.GradientDescentOptimizer(learning_rate=self.params['train']['learning_rate'])
            train_op = optimizer.minimize(
                loss=loss,
                global_step=tf.train.get_global_step())
            return tf.estimator.EstimatorSpec(mode=mode, loss=loss, train_op=train_op)
        eval_metric_ops = {
            "accuracy": tf.metrics.accuracy(
                labels=labels, predictions=predictions["classes"])}
        return tf.estimator.EstimatorSpec(
            mode=mode, loss=loss, eval_metric_ops=eval_metric_ops)

    def train(self,x,y):

        self.classifier = tf.estimator.Estimator(
            model_fn=self.model, model_dir="/tmp/mnist_convnet_model")

        tensors_to_log = {"probabilities": "softmax_tensor"}
        #logging_hook = tf.train.LoggingTensorHook(tensors=tensors_to_log, every_n_iter=50)
        train_input_fn = tf.estimator.inputs.numpy_input_fn(
            x={"x": x},
            y=y,
            batch_size=self.params['train']['batch_size'],
            num_epochs=None,
            shuffle=self.params['train']['shuffle_batch'])
        self.classifier.train(
            input_fn=train_input_fn,
            steps=self.params['train']['training_steps'])
            #hooks=[logging_hook])

    def eval(self,x, y):
        # Evaluate the model and print results
        eval_input_fn = tf.estimator.inputs.numpy_input_fn(
            x={"x": x},
            y=y,
            num_epochs=1,
            shuffle=False)
        eval_results = self.classifier.evaluate(input_fn=eval_input_fn)
        return eval_results










