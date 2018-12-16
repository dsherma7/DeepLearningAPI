#!/usr/bin/python
from dotenv import load_dotenv
from app import app
import os

# Load environment variables from .env
load_dotenv()
debug = os.environ['DEBUG'].lower() == 'true'

app.run(port=5000,host='0.0.0.0',debug=debug)
