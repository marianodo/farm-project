from app import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy import Enum


# Campo
class Field(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False,
                     unique=True, index=True, sqlite_on_conflict_unique='FAIL')
    pens = db.relationship('Pen', backref='field', lazy=True)
    serialize_rules = ("-pens.field",)

    def validate(self):
        if not self.name or not self.name.strip() or len(self.name.strip()) < 3:
            raise ValueError(
                "El campo no puede estar vacío y debe tener una longitud mayor a dos")


class Pen(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True, unique=False,
                     index=True, sqlite_on_conflict_unique='FAIL')
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'), nullable=True)
    serialize_rules = ("-pen_variable.pen", '-field.pens')
    __table_args__ = (
        # Agregamos una restricción de unicidad para (name, field_id)
        UniqueConstraint('name', 'field_id'),
    )

    def validate(self):
        if not (self.name and self.field_id):
            raise ValueError("Nombre y Field_id son requeridos")
        if not self.name or not self.name.strip() or len(self.name.strip()) < 3:
            raise ValueError(
                "El nombre deL corral no puede estar vacío y debe tener una longitud mayor a dos")
        if not isinstance(self.field_id, int) or self.field_id <= 0:
            raise ValueError(
                "El valor field_id debe ser un entero mayor a cero")
        # Validamos que el nombre del corral sea único dentro del mismo Field
        if Pen.query.filter_by(name=self.name, field_id=self.field_id).count() > 0:
            raise ValueError(f"Ya existe un corral con el nombre '{
                             self.name}' en este Field.")

# Variable


class Variable(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True, index=True,
                     sqlite_on_conflict_unique='FAIL')  # 'higiene', 'Peso', 'Nivel De Ruido'
    # 'numérico', 'booleano', 'enum'
    type = db.Column(Enum('number', 'boolean', 'enum'), nullable=False)
    # type_of_object = db.Column(db.String(10), nullable=False)
    default_parameters = db.Column(db.JSON, nullable=False, default={
        "value": {}})  # Parámetros por defecto como JSON

    def validate(self):
        if self.type not in ('number', 'boolean', 'enum'):
            raise ValueError(
                f"El valor de type debe ser uno de los siguientes: 'number', 'boolean', 'enum'")
        if Variable.query.filter_by(name=self.name).first() is not None:
            raise ValueError("El nombre de la variable debe ser único")

# Tabla intermedia corral y variable


class PenVariable(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    pen_id = db.Column(db.Integer, db.ForeignKey('pen.id'), nullable=False)
    variable_id = db.Column(db.Integer, db.ForeignKey(
        'variable.id'), nullable=False)
    custom_parameters = db.Column(db.JSON, nullable=True)
    pen = db.relationship('Pen', backref='pen_variable')
    variable = db.relationship('Variable', backref='pen_variable')
    measurement = db.relationship('Measurement', backref='pen_variable')
    serialize_rules = ('-pen.pen_variable',
                       '-variable.pen_variable', '-measurement.pen_variable')

# Medición


class Measurement(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    pen_variable_id = db.Column(db.Integer, db.ForeignKey(
        'pen_variable.id'), nullable=False)
    value = db.Column(db.String(60), nullable=False)
    report_id = db.Column(db.Integer, db.ForeignKey(
        'report.id'), nullable=False)
    serialize_rules = ('-pen_variable.measurement',
                       '-pen.measurement', 'report_id.measurement')


class Report(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    name = db.Column(db.String(20), nullable=True)
    comment = db.Column(db.String(100), nullable=True)
    measurement = db.relationship('Measurement', backref='report', lazy=True)
    serialize_rules = ('-measurement.report',)
