from tensorflow.keras.models import load_model
import numpy as np
import os, cv2
#tf.disable_eager_execution()


class val_model():
    model = None
    IMAGE_SIZE = 256
    labels = ['negative', 'positive']
    def __init__(self):
        cur_path = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(cur_path,"static","saved_models","malaria_256_validation_mobilenet_3.h5")
        print("Validation Model: "+model_path)
        self.model = load_model(model_path)
        print("Validation Model loaded ")
        return None    

    def predict(self, img_path):
        img = cv2.imread(img_path)
        img = cv2.resize(img,(self.IMAGE_SIZE,self.IMAGE_SIZE)).astype(np.float32)
        img = np.expand_dims(img,axis=0)
        pred = self.labels[np.argmax(self.model.predict(img),axis=1)[0]]
        return pred