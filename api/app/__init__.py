from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.config import config
from app.blueprints import register_blueprints
from app.models import *

app = Flask(__name__)
CORS(app)
configuration = config['development']

# Configuración de la aplicación
app.config.from_object(configuration)


with app.app_context():
    db.init_app(app)
    db.drop_all()
    db.create_all()
    register_blueprints(app)

