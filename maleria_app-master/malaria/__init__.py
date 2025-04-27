from flask import Flask, render_template, url_for, redirect 
from flask_cors import CORS
#from flask_sqlalchemy import SQLAlchemy

#Flask – Application
app = Flask(__name__)
app.config['SECRET_KEY'] = 'f2a29aa07b15cdc112e80e07f442eb76' 
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
CORS(app)
#initializing database
#db = SQLAlchemy(app)

from malaria import routes
