from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.config import config
from app.blueprints import register_blueprints
from app.models import *
import click

app = Flask(__name__)
CORS(app)
configuration = config['development']

# Configuración de la aplicación
app.config.from_object(configuration)


@app.cli.command("drop-db")
@click.confirmation_option(prompt="Are you sure you want to drop all tables?")
def drop_db():
    """Drop all tables in the database."""
    db.drop_all()
    click.echo("Dropped all tables in the database.")

with app.app_context():
    db.init_app(app)
    #db.drop_all()
    db.create_all()
    register_blueprints(app)

