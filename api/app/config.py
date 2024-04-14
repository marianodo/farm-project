from pathlib import Path
import os

root_path = Path(__file__).parent.parent
basedir = os.path.abspath(os.path.dirname(__file__))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Construye la ruta a la base de datos usando el directorio base

class Config:
    pass

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'lalala123'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'farm.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

config={
    'development' : DevelopmentConfig
}