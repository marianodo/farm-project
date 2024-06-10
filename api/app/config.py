from pathlib import Path
import os

root_path = Path(__file__).parent.parent
basedir = os.path.abspath(os.path.dirname(__file__))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_PORT = os.environ.get('DB_PORT')
DB_DATABASE = os.environ.get('DB_DATABASE')
DB_HOST = os.environ.get('DB_HOST')
# Construye la ruta a la base de datos usando el directorio base

class Config:
    pass

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'lalala123'
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

config={
    'development' : DevelopmentConfig
}