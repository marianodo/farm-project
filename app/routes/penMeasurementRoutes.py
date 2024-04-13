from flask import Blueprint

penMeasurement_bp = Blueprint('penMeasurement', __name__, url_prefix='/pen-measurements')

@penMeasurement_bp.route('/')
def pen_measurements():
    return 'Pen Measurements Route'