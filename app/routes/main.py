from flask import Blueprint
from flask import Flask, render_template, request, redirect,url_for,jsonify
from sqlalchemy.exc import IntegrityError
from app.models import PenVariable, Measurement, Pen, Task, Cow, Variable, Field
from app.extensions import db
import enum


class MyEnum(enum.Enum):
    boolean = "boolean"
    enum = "enum"
    number = "number"

main_bp = Blueprint('main', __name__)

# Principal
@main_bp.route('/')
def index():
    return render_template('index.html')

# FIELD ROUTES
@main_bp.route('/field', methods=['GET', 'POST'])
def manage_field():
    if request.method == 'POST':
        if request.content_type == 'application/json':
            # Procesar datos JSON
            data = request.json
            name = data.get('fieldName')
        else:
            # Procesar datos de formulario HTML
            name = request.form['fieldName']
        try:
            new_field = Field(name=name)
            db.session.add(new_field)
            print(new_field)
            db.session.commit()
            return jsonify({'message': 'Campo creado exitosamente'}), 201
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
    if request.method == 'GET':
    #  fields = Field.query.all()
    #  serialized_fields = [field.to_dict() for field in fields]
     return render_template('create_field.html')
# COW ROUTES
@main_bp.route('/cow', methods=['GET', 'POST'])
def manage_cows():
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        pen_id = data.get('pen_id') 
        try:
         if not name:
            return jsonify({'error': 'El nombre de la vaca es requerido'}), 400
         new_cow = Cow(name=name, pen_id=pen_id )
         db.session.add(new_cow)
         db.session.commit()
         return jsonify({'message': 'Nueva vaca creada'}), 201
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        cows = Cow.query.all()
        serialized_cows = [cow.to_dict() for cow in cows]
        return jsonify(serialized_cows), 200
    
# PEN ROUTES
@main_bp.route('/pen', methods=['GET', 'POST'])    
def manage_pen():
    if request.method == 'POST':
       if request.content_type == 'application/json':
        data = request.json
        name = data.get('name')
        field_id = data.get("field_id")
       else:
        name = request.form['penName']
        field_id = request.form['field_id']
        variables = request.form.getlist('variableSelect')
        print('VARIABLES:', variables)
        if not name:
            return jsonify({'error': 'El nombre del corral es requerido'}), 400

        try:
            new_pen = Pen(name=name, field_id=field_id)
            db.session.add(new_pen)
            db.session.commit()
            return jsonify({'message': 'Nuevo corral creado', 'pen_id': new_pen.id}), 201 
        except IntegrityError as e:
            db.session.rollback()  # Deshacer la transacción
            error_info = str(e.__cause__)  # mensaje de error de la excepción
            return jsonify({'error': error_info}), 409  # mensaje de error específico

    if request.method == 'GET':
        variables = Variable.query.all()
        serialized_variables = [variable.to_dict(only=('id','name','type')) for variable in variables]
        fields = Field.query.all()
        serialized_fields = [field.to_dict(only=('id','name')) for field in fields]
        if variables and fields:
        # pens = Pen.query.all()
        # serialized_pens = [pen.to_dict(only=('id','name','cows')) for pen in pens]
         return render_template('create_pen.html', variables=serialized_variables, fields=serialized_fields)
    return render_template('create_pen.html')
@main_bp.route('/variable', methods=['GET', 'POST'])    
def manage_variable():
    if request.method == 'POST':
      if request.content_type == 'application/json':
        data = request.json
        name = data.get('name')
        type = data.get('type')
        parameters = data.get('parameters')
      else:
        name = request.form['variableName']
        type = request.form['variableType']
        if not name:
            return jsonify({'error': 'El nombre de la variable es requerida'}), 400
         # Validación de los parámetros según el tipo de variable
        if type == 'number':
            parameters = {"value": {"min": request.form['min'], "max": request.form['max'], "optimo_min": request.form['optimoMin'], "optimo_max": request.form['optimoMax']}}
            if not isinstance(parameters, dict) or 'value' not in parameters:
                return jsonify({'error': 'Los parámetros para una variable numérica deben ser un objeto con la clave "value"'}), 400
            number_params = parameters['value']
            if not isinstance(number_params, dict) or not all(key in number_params for key in ['min', 'max', 'optimo_min', 'optimo_max']):
                return jsonify({'error': 'Los parámetros para una variable numérica deben ser un objeto con las claves "min", "max", "optimo_min" y "optimo_max"'}), 400
            parameters = {"value": {"min": request.form['min'], "max": request.form['max'], "optimo_min": request.form['optimoMin'], "optimo_max": request.form['optimoMax']}}
        if type == 'boolean':
            parameters = {"value": ""}
        if type == 'enum':
            if not isinstance(parameters, dict) or 'value' not in parameters:
                return jsonify({'error': 'Los parámetros para una variable enum deben ser un objeto con la clave "value"'}), 400
            if not isinstance(parameters['value'], list):
                return jsonify({'error': 'El valor de los parámetros para una variable enum debe ser una lista'}), 400
        try:
            new_variable = Variable(name=name, type=type, default_parameters=parameters)
            db.session.add(new_variable)
            db.session.commit()
            return jsonify({'message': 'Nueva variable creada', 'variable_id': new_variable.id}), 201 
        except IntegrityError as e:
            db.session.rollback()  # Deshacer la transacción
            error_info = str(e.__cause__)  # mensaje de error de la excepción
            return jsonify({'error': error_info}), 409  # mensaje de error específico

    if request.method == 'GET':
        # variables = Variable.query.all()
        # serialized_variables = [variable.to_dict() for variable in variables]
        return render_template('create_variable.html')

@main_bp.route('/pen_variable', methods=['POST'])
def create_pen_variable():
    data = request.json
    pen_id = data.get('pen_id')
    variable_id = data.get('variable_id')
    custom_parameters = data.get('custom_parameters')

    if not all([pen_id, variable_id]):
        return jsonify({'error': 'Se requieren pen_id y variable_id'}), 400

    pen = Pen.query.get(pen_id)
    variable = Variable.query.get(variable_id)

    if not pen:
        return jsonify({'error': 'No se encontró el corral con el pen_id proporcionado'}), 404

    if not variable:
        return jsonify({'error': 'No se encontró la variable con el variable_id proporcionado'}), 404

    new_pen_variable = PenVariable(pen=pen, variable=variable, custom_parameters=custom_parameters)

    try:
        db.session.add(new_pen_variable)
        db.session.commit()
        return jsonify({'message': 'Relación Pen-Variable creada exitosamente', 'pen_variable_id': new_pen_variable.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main_bp.route('/pen_variable/<pen_id>/<variable_id>', methods=['GET'])
def get_pen_variable(pen_id, variable_id):
    pen_variable = PenVariable.query.filter_by(pen_id=pen_id, variable_id=variable_id).first()
    if pen_variable:
        return jsonify({
            'pen_id': pen_variable.pen_id,
            'variable_id': pen_variable.variable_id,
            'custom_parameters': pen_variable.custom_parameters
        }), 200
    else:
        return jsonify({'message': 'No se encontró la relación Pen-Variable'}), 404
    
@main_bp.route('/measurement', methods=['GET', 'POST'])
def add_measurement():
    if request.method == 'GET':
        meansurements = Measurement.query.all()
        serialized_meansurements = [meansurement.to_dict() for meansurement in meansurements]
        return jsonify(serialized_meansurements), 200
    data = request.json
    pen_id = data.get('penSelect')
    variable_id = data.get('variableSelect')
    value = data.get('measurementValue')
    # Crear la medición y asociarla con la vaca correspondiente
    new_measurement = Measurement(cow_id=cow_id, variable_id=variable_id, value=value)
    db.session.add(new_measurement)
    db.session.commit()
    return jsonify({'message': 'Medición agregada exitosamente'}), 201    
# @main_bp.route("/variable_type", methods=["GET", "POST"])
# def manage_variable_type():
#     if request.method == "POST":
#        data = request.json
#        type = data.get('type') 
#        description = data.get('description')

#        if type not in [e.value for e in MyEnum]:
#             return jsonify({"error": "El valor de 'type' no es válido. Debe ser 'boolean', 'enum' o 'number'."}),400

#        if not type:
#             return jsonify({'error': 'El nombre de la vaca es requerido'}), 400

#        new_variable_type = Variable(type=type, description=description)

#        db.session.add(new_variable_type)
#        db.session.commit()
       
#        return jsonify({'message': 'Nueva vaca creada'}), 201
    
#     if request.method == 'GET':
     
#         cows = Cow.query.all()
       
#         cows_json = [{'id': cow.id, 'name': cow.name, 'pen_id': cow.pen_id} for cow in cows]
    
#         return jsonify(cows_json), 200