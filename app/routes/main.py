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
        field_id = data.get('field_id')
        variables = data.get('variables')
       else:
        name = request.form['penName']
        field_id = request.form['field_id']
        variables = request.form.getlist('variableSelect')
        if not name:
            return jsonify({'error': 'El nombre del corral es requerido'}), 400
        if not all([variables]):
            return jsonify({'error': 'Debes seleccionar variables para asociar al corral'}), 400
        try:
            variables_enteros = [int(x) for x in variables]
            print("Variables: ",variables_enteros)
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
        try:    
            if request.content_type == 'application/json':
                data = request.json
                name = data.get('name')
                type = data.get('type')
                parameters = data.get('parameters')
                # print("parameters: ", parameters)
                # granularity = data.get('parameters')['granularity']
                
                if type == 'number':
                    if not isinstance(parameters, dict) or not parameters or \
                        'value' not in parameters or not parameters['value']:
                        return jsonify({'error': 'La clave "value" no puede estar vacía'}), 400
                    if not isinstance(parameters, dict) or not parameters or \
                        'granularity' not in parameters or parameters['granularity'] == '':
                        return jsonify({'error': 'La clave "granularity" no puede estar vacía'}), 400
                    number_params = parameters['value']
                    for key in ['min', 'max', 'optimo_min', 'optimo_max']:
                     value = int(number_params.get(key))
                     granularity = parameters['granularity']
                     if value is None or not (isinstance(value, (int, float)) and value >= 0):
                        return jsonify({'error': f'El parametro "{key}" debe ser un mayor a 0'})
                     if granularity is None or not (isinstance(granularity, (int, float)) and granularity >= 0):
                        return jsonify({'error': f'El parametro "granularity" debe ser mayor a 0'}), 400
                     if not all(key in number_params for key in ['min', 'max', 'optimo_min', 'optimo_max']):
                        return jsonify({'error': 'Los parámetros para una variable numérica deben ser un objeto con las claves "min", "max", "optimo_min" y "optimo_max"'}), 400

                elif type == 'enum':
                    if not isinstance(parameters, dict) or 'value' not in parameters:
                        return jsonify({'error': 'Los parámetros para una variable enum deben ser un objeto con la clave "value"'}), 400

                    if not isinstance(parameters['value'], list):
                        return jsonify({'error': 'El valor de los parámetros para una variable enum debe ser una lista'}), 400

            else:
                name = request.form['variableName']
                type = request.form['variableType']
                if not name:
                    return jsonify({'error': 'El nombre de la variable es requerida'}), 400

                if type == 'number':
                    parameters = {"value": {"min": request.form['min'], "max": request.form['max'], "optimo_min": request.form['optimoMin'], "optimo_max": request.form['optimoMax']}, 'granularity': request.form['granularity']}
                    if not isinstance(parameters, dict) or not parameters or \
                        'value' not in parameters or not parameters['value']:
                        return jsonify({'error': 'La clave "value" no puede estar vacía'}), 400
                    if not isinstance(parameters, dict) or not parameters or \
                        'granularity' not in parameters or parameters['granularity'] == '':
                        return jsonify({'error': 'La clave "granularity" no puede estar vacía'}), 400
                    number_params = parameters['value']
                    for key in ['min', 'max', 'optimo_min', 'optimo_max']:
                     value = int(number_params.get(key))
                     print("VALUE:",value)
                     granularity = float(request.form['granularity'])
                     if value is None or not (isinstance(value, (int, float)) and value >= 0):
                        return jsonify({'error': f'El parametro "{key}" debe ser un mayor a 0'})
                     if granularity is None or not (isinstance(granularity, (int, float)) and granularity >= 0):
                        return jsonify({'error': f'El parametro "granularity" debe ser mayor a 0'}), 400
                     if not all(key in number_params for key in ['min', 'max', 'optimo_min', 'optimo_max']):
                        return jsonify({'error': 'Los parámetros para una variable numérica deben ser un objeto con las claves "min", "max", "optimo_min" y "optimo_max"'}), 400
                if type == 'boolean':
                    parameters={"value": {}} 
                if type == 'enum':
                    print("enumValues: ", request.form.getlist('enumValues[]'))
                    parameters={'value': request.form.getlist('enumValues[]')}
                    if not isinstance(parameters, dict) or 'value' not in parameters:
                        return jsonify({'error': 'Los parámetros para una variable enum deben ser un objeto con la clave "value"'}), 400

                    if not isinstance(parameters['value'], list):
                        return jsonify({'error': 'El valor de los parámetros para una variable enum debe ser una lista'}), 400

            new_variable = Variable(name=name, type=type, default_parameters=parameters)
            db.session.add(new_variable)
            db.session.commit()
            return jsonify({'message': 'Nueva variable creada con exito', 'variable_id': new_variable.id}), 201 
        except Exception as e:
            db.session.rollback()  # Deshacer la transacción
            error_info = str(e.__cause__)  # mensaje de error de la excepción
            return jsonify({'error': f'Error: {error_info}'}), 409  # mensaje de error específico

    if request.method == 'GET':
        return render_template('create_variable.html')

