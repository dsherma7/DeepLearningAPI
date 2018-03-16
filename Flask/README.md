## Python Flask Front-End

Use the following to code to install the necessary packages for developing Python Flask via the provided requirements.txt file. 

`pip3 install -r requirements.txt`

Anything at this level will not be visible to the users. Within this folder, the `config.py` and `run.py` files define how the server should be hosted (port, debug, etc.). `views.py` contains the end-points for the UI and `forms.py` lists the components for each of the pages within the UI. The `app/` directory contains all the static files that are visible to the user. This consists of the HTML, CSS, and Javascript code as well as any images or icons used in the styling. 


###Contributors:###
__Joe Kotlarek:__ Worked on some of the functionality for the `buildjob` page, including building the different layer & optimizer classes contained in `util.js` and parsing the layer information dynamically within the form via `BuildList()` and `parse_params()`.
__Doug Sherman:__ Worked on the remaining pages including the splash page, dashboard, login/signup, and job status pages. Built the layer table in Jquery for the `BuildForm` page and designed all the styling throughout the UI.