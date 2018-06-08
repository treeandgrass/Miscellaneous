'''build model weights'''
from keras.models import model_from_config
import json
import pickle
import tensorflow as tf
import module.constant as constant
# import constant
from keras.models import Model
import os
# re build model from config and weights 
graph = tf.get_default_graph()
with open(os.path.join(constant.root, constant.resnet_1_3_config), 'rb') as f:
    build_config =  pickle.load(f)
    build_config = build_config['config']
build_model = Model.from_config(build_config)
build_model.load_weights(os.path.join(constant.root, constant.resnet_1_3_weights))