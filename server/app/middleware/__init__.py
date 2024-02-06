import os
from ..db.db import connect_db
from dotenv import load_dotenv

load_dotenv()

client = connect_db()
db = client['Project']

secret_key = os.environ.get('SECRET_KEY')