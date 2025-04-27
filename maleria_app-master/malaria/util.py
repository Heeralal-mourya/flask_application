import os, time
import tensorflow as tf
import numpy as np
import cv2
from flask import current_app
# from skimage import data, color
# from skimage.transform import rescale, resize

#saving image in static/Uploaded
def save_image(cur_img, temp_id):
    picture_ext =  cur_img.filename.split('.')[-1]
    picture_name = temp_id + '_' + str(time.time()).split('.')[0] + "." + picture_ext
    cur_img.save(os.path.join(current_app.root_path, 'static/Uploaded', picture_name))
    return picture_name


#To load image from static/Uploaded with required dimensions
def get_img(image_path, height, width, dim):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (height, width))
    img = np.reshape(img,(1,img.shape[0],img.shape[1],img.shape[2]))
    return img/255.0
    
