from app import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from datetime import datetime

# Campo
class Field(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True, sqlite_on_conflict_unique='FAIL')
    pens = db.relationship('Pen', backref='field', lazy=True)
    serialize_rules = ("-pens.field",)

# Vaca
class Cow(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True, unique=False, sqlite_on_conflict_unique='FAIL')
    pen_id = db.Column(db.Integer, db.ForeignKey('pen.id'), nullable=False)
    measurement = db.relationship('Measurement', backref='cow', lazy=True)
    serialize_rules = ("-measurement.cow",)

# Corral
class Pen(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True, sqlite_on_conflict_unique='FAIL')
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'), nullable=True)
    cows = db.relationship('Cow', backref='pen', lazy=True)
    serialize_rules = ("-cows.pen","-pen_variable.pen",)

# Variable
class Variable(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True, sqlite_on_conflict_unique='FAIL')  # 'higiene', 'Peso', 'Nivel De Ruido'
    type = db.Column(db.String(10), nullable=False)  # 'numérico', 'booleano', 'enum'
    default_parameters = db.Column(db.JSON, nullable=False, default={"value": {}})  # Parámetros por defecto como JSON
    
# Tabla intermedia corral y variable
class PenVariable(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    pen_id = db.Column(db.Integer, db.ForeignKey('pen.id'), nullable=False)
    variable_id = db.Column(db.Integer, db.ForeignKey('variable.id'), nullable=False)
    custom_parameters = db.Column(db.JSON, nullable=True)
    pen = db.relationship('Pen', backref='pen_variable')
    variable = db.relationship('Variable', backref='pen_variable')
    serialize_rules = ('-pen.pen_variable', '-variable.pen_variable')

# Medición
class Measurement(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    # agregar date
    cow_id = db.Column(db.Integer, db.ForeignKey('cow.id'), nullable=False)
    pen_variable_id = db.Column(db.Integer, db.ForeignKey('pen_variable.id'), nullable=False) #deberia ser el id de penVariable por el custom_parametres
    value = db.Column(db.String(60), nullable=False)  # Valor del atributo como JSON
    serialize_rules = ('-pen_variable_id.measurement', '-cow.measurement', '-pen.measurement',)