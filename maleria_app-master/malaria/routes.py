from flask import Flask, render_template, url_for, redirect, request, jsonify, Response 
from malaria import app
#from malaria import db
from malaria import classifier ,validation_classifier 
from datetime import datetime
from malaria.util import save_image,  get_img
import numpy as np
from PIL import Image
import os
import logging
import cv2
#import jsonpickle
import requests
# import pandas as pd 
import time
import matplotlib.pyplot as plt

height = 50
width = 50
dim = 3
val_obj = validation_classifier.val_model()
model_obj = classifier.malaria_Model()

@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template('index.html')
    
@app.route("/malariadetect", methods=['GET', 'POST'])
def malariadetect():
    try:
        if ('temp_id' in request.form):
            temp_id = request.form.get('temp_id')
        else:
            raise Exception('temp_id Not found')
    except Exception as msg:
        print("[ERROR] in reading temp_id from form : " + time.asctime(time.localtime(time.time())) + " : " + str(msg))
        data = {'temp_id' : 0, 'status' : False, 'message' : str(msg)}
        resp = jsonify(data)
        resp.status_code = 200
        return resp
    try:
        img_request = request.files.get('image_file')
    except Exception as msg:
        print("[ERROR] in reading request form and files : " + time.asctime(time.localtime(time.time())) + " : " + str(msg))
        data = {'temp_id' : temp_id, 'status' : False, 'message' : str(msg)}
        resp = jsonify(data)
        resp.status_code = 200
        return resp
    try:
        img_file_name = save_image(img_request, temp_id)
        img_path = os.path.join(app.root_path, 'static/Uploaded', img_file_name)
#        print('got image path : ',img_path)
        if (val_obj.predict(img_path)=='negative'):
            raise Exception('Invalid Image')
        img = get_img(img_path, height, width, dim)
#        print('got image ',img.shape)   
        result = model_obj.predict(img)
        result_val = result[0][0]
        print("result is : {}".format(result))
        if(result_val >= 0.6):
            output = "malaria_detected"
        elif(result_val >= 0.4 and result_val < 0.6):
            output = "consult_doctor"
        else:
            output = "no_malaria"
    except Exception as msg:
        print("[ERROR] while prediction : " + time.asctime(time.localtime(time.time())) + " : " + str(msg))
        data = {'temp_id' : temp_id, 'status' : False, 'message' : str(msg)}
        resp = jsonify(data)
        resp.status_code = 200
        return resp 
    

    dict = {'temp_id' : temp_id, 'status': True, 'result' : str(result[0][0]), 'output' : output}    
    resp = jsonify(dict)
    resp.status_code = 200
    return(resp)

