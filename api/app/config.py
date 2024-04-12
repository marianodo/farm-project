import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = 'lalala123' 
    SQLALCHEMY_DATABASE_URI = 'sqlite:///C:/Users/BurGo-Dev/Desktop/farm_project/app/database/tasks.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True

config={
    'development' : DevelopmentConfig
}