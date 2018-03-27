# Python Flask Front-End #

Use the following to code to install the necessary packages for developing Python Flask via the provided requirements.txt file. 

`pip3 install -r requirements.txt`

Anything at this level will not be visible to the users. Within this folder, the `config.py` and `run.py` files define how the server should be hosted (port, debug, etc.). `views.py` contains the end-points for the UI and `forms.py` lists the components for each of the pages within the UI. The [`app/`](https://github.com/dsherma7/DeepLearningAPI/tree/master/Flask/app) directory contains all the static files that are visible to the user. This consists of the HTML, CSS, and Javascript code as well as any images or icons used in the styling. To run the app use 

`python3 run.py`
