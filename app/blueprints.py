from .routes.penMeasurementRoutes import penMeasurement_bp
from .routes.main import main_bp

def register_blueprints(app):
    app.register_blueprint(penMeasurement_bp)
    app.register_blueprint(main_bp)