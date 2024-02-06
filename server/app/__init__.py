"""
This module initializes the Flask application and its configurations,
including database connections and middleware setup.
"""

import os
import json
from datetime import datetime, timedelta
from functools import wraps
import bcrypt
import redis
import jwt
from pymongo import MongoClient, UpdateOne, DESCENDING
from flask import Flask, Blueprint, Response, request, jsonify, send_file, url_for

from .db.db import connect_db
from .middleware.middleware import token_required, admin_token_required

client = connect_db()

db = client['Project']

app = Flask(__name__)

redis_client = redis.Redis(host='localhost', port=6379, db=0)

app.config['UPLOAD_FOLDER'] = '/Users/sury/Downloads/projects/Ecommerce/server/app/assets'
