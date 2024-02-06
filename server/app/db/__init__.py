import os
from dotenv import load_dotenv

load_dotenv()

Username = os.environ.get('MONGO_USERNAME')
Password = os.environ.get('MONGO_PASSWORD')