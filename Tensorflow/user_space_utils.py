import os
USER_DATA_PATH = '../user_space/'


def does_path_exist(username, job) :
    user_sub_path = create_user_sub_path(username, job)
    return os.path.exists(USER_DATA_PATH+user_sub_path)


def create_user_sub_path(user,job):
    return user+'/'+job+'/'