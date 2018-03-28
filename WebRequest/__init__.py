from google.cloud import datastore
import sys

sys.path.append("../")

# Instantiates a client
client = datastore.Client(project="tensorfloss")	
