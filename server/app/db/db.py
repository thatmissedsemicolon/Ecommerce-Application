from . import Username, Password
from .. import MongoClient

uri = f'mongodb+srv://{Username}:{Password}@cluster0.4ooavq3.mongodb.net/?retryWrites=true&w=majority'

def connect_db():
  try:
    client = MongoClient(uri)
    return client
  except:
    print("Could not connect to the database!")