from app.extensions import db
from datetime import datetime

from datetime import datetime

class Pen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    measurements = db.relationship('PenMeasurement', backref='pen', lazy=True)

class Variable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    generic_minimum = db.Column(db.Float, nullable=True)
    generic_maximum = db.Column(db.Float, nullable=True)
    generic_optimal_min_range = db.Column(db.Float, nullable=True)
    generic_optimal_max_range = db.Column(db.Float, nullable=True)
    step = db.Column(db.Float, nullable=True)
    measurements = db.relationship('PenMeasurement', backref='variable', lazy=True)

class PenVariable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    variable_id = db.Column(db.Integer, db.ForeignKey('variable.id'), nullable=False)
    pen_id = db.Column(db.Integer, db.ForeignKey('pen.id'), nullable=False)
    specific_minimum = db.Column(db.Float, nullable=True)
    specific_maximum = db.Column(db.Float, nullable=True)
    specific_optimal_min_range = db.Column(db.Float, nullable=True)
    specific_optimal_max_range = db.Column(db.Float, nullable=True)

class PenMeasurement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pen_id = db.Column(db.Integer, db.ForeignKey('pen.id'), nullable=False)
    variable_id = db.Column(db.Integer, db.ForeignKey('variable.id'), nullable=False)
    value = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

