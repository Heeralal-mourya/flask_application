from tensorflow.keras.models import load_model
#import keras.backend as K
#import tensorflow as tf
import os
#from tensorflow import Session
from malaria import app
class malaria_Model():

	model = None
	def __init__(self):
		model_path = os.path.join(app.root_path, 'static/saved_models', 'regularization_techniques_keras_cnn.h5')
		self.model = load_model(model_path)
		return None	

	def predict(self, img):
		return self.model.predict(img)
