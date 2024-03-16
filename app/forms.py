from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SubmitField
from wtforms.validators import DataRequired, Optional

class VariableForm(FlaskForm):
    nombre = StringField('Nombre', validators=[DataRequired()])
    descripcion = StringField('Descripción', validators=[Optional()])
    minimo = FloatField('Mínimo', validators=[DataRequired()])
    maximo = FloatField('Máximo', validators=[DataRequired()])
    step = FloatField('Step', validators=[DataRequired()])
    rango_optimo = StringField('Rango Óptimo', validators=[Optional()])
    submit = SubmitField('Crear Variable')

class GrupoForm(FlaskForm):
    nombre = StringField('Nombre', validators=[DataRequired()])
    submit = SubmitField('Crear Grupo')
