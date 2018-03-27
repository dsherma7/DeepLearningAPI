## Middleware ##

The files here provide abstractions for communicating with the Google Cloud Datastore NoSQL database and for interacting with the Celery scheduler for handling scheduling of the back-end pieces. 

run `pip3 -r requirements.txt` to install dependencies for development. 

run `export GOOGLE_APPLICATION_CREDENTIALS="[Path to this dir]/data-store-authentication.json"` to set credentials for the Google Cloud Datastore client.
