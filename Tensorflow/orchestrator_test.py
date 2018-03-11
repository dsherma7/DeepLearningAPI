import model_orchestrator as orch
import user_space_handler as us
import numpy as np
import pickle as pickle
from sklearn.model_selection import train_test_split

#These commands are just to create us example data
def load_data(filename):
    with (open(filename, "rb")) as openfile: 
        return pickle.load(openfile)
combined_data = load_data('mnist_data_all.pkl')
combined_labels = load_data('mnist_labels_all.pkl')
X_train, X_test, y_train, y_test = train_test_split(combined_data, combined_labels, test_size=0.33, random_state=42)



# These are the commands that will be used to publish data. 
# it will save the 'X_train' data in ../userspace/npjoodi/001/train_x
# If the file path is not created, it will create it automatically
orch.publish_data(X_train, 'njoodi', 'J00009', 'train', 'x' )
orch.publish_data(y_train, 'njoodi', 'J00009', 'train', 'y' )
orch.publish_data(X_test, 'njoodi', 'J00009', 'test', 'x' )
orch.publish_data(y_test, 'njoodi', 'J00009', 'test', 'y' )

# This command will create the network. It makes a request to 
# datastore to load the params using the username and job id.
# I am currently hardcoding the params because we do not
# have the data in the format that this code works with
# no return
orch.create_network('njoodi', 'J00009')

# This command will train the network for the specific user
# and job id. The last option tells the network which
# data we should train on. In this case, we are training on
# the train data. But we could train on the test data if we wanted to
# this will save the model in the userspace
# no return
orch.train_network('njoodi', 'J00009', 'train')

# Evaluate the model with the same logic as above. It will use the 
# stored model in the userspace to do this.
# simply returns the accuracy and loss in one object for now
orch.eval_network('njoodi', 'J00009', 'test')

# predict with no ground truth
# returns an array of objects:
#   - {'classes': [[the predicted class as an int]], 
#       'probabilities:[[the probabilities of each class as an array of floats]]'
#     }
# and object for each prediction
orch.predict('njoodi', 'J00009', 'test')

