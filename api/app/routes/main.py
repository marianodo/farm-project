from flask import Blueprint
from flask import Flask, render_template, request, redirect, url_for, jsonify
from sqlalchemy.exc import IntegrityError
from app.models import PenVariable, Measurement, Pen, Variable, Field, Report, TypeOfObject, Object
from app.extensions import db
import enum
from datetime import datetime


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
        # Procesar datos JSON
        data = request.json
        name = data.get('fieldName')
        try:
            new_field = Field(name=name)
            new_field.validate()
            db.session.add(new_field)
            print(new_field)
            db.session.commit()
            return jsonify({'message': 'Campo creado exitosamente', 'field': new_field.to_dict()}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        fields = Field.query.all()
        serialized_fields = [field.to_dict(only=(
            'id', 'name', 'pens.name', 'pens.pen_variable', 'pens.id', 'reports')) for field in fields]
        return serialized_fields, 200


@main_bp.route('/field/<int:field_id>', methods=['GET', 'DELETE', 'PUT'])
def manage_one_field(field_id):
    if request.method == 'GET':
        try:
            field = Field.query.get(field_id)
            if not field:
                return jsonify({'error': 'No se encontró el campo'}), 404
            serialized_field = field.to_dict(only=(
                'id', 'name', 'pens.name', 'pens.pen_variable', 'pens.id'))
            return serialized_field, 200
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'DELETE':
        field_to_delete = Field.query.get(field_id)
        if not field_to_delete:
            return jsonify({'error': 'No se encontró el campo a eliminar'}), 404
        try:
            db.session.delete(field_to_delete)
            db.session.commit()
            return jsonify({'message': 'Campor eliminado exitosamente'}), 200
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'PUT':
        try:
            data = request.json
            new_name = data.get('fieldName')
            field = Field.query.get_or_404(field_id)
            if new_name and new_name.lower() != field.name.lower():
                field.name = new_name
                db.session.commit()
                return jsonify({'message': 'Campo actualizado exitosamente'}), 200
            field.validate()
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    # if request.method == 'PATCH':
    #     try:
    #         variable = Variable.query.get_or_404(variable_id)
    #         data = request.json
    #         new_name = data.get('name')
    #         if new_name and new_name.lower() != variable.name.lower():
    #             variable.name = new_name
    #             db.session.commit()
    #             return jsonify({'message': 'Variable modificada correctamente'}), 200
    #         variable.validate()
    #     except ValueError as e:
    #         db.session.rollback()
    #         return jsonify({'error': str(e)}), 400
    #     except Exception as e:
    #         db.session.rollback()
    #         return jsonify({'error': str(e)}), 500


# PEN ROUTES


@main_bp.route('/pen', methods=['GET', 'POST'])
def manage_pen():
    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = request.json
            name = data.get('name')
            field_id = data.get('field_id')
            variables = data.get('variables')
        try:
            new_pen = Pen(name=name, field_id=field_id)
            new_pen.validate()
            db.session.add(new_pen)
            db.session.commit()
            data, status = manage_penVariable(new_pen.id, variables)
            if (status == 200 or status == 201):
                return jsonify({'message': 'Nuevo corral creado', 'pen_id': new_pen.id}), 201
            db.session.delete(new_pen)
            db.session.commit()
            return data, status
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        # Verificar si se proporcionó el parámetro fieldId en la solicitud
        field_id = request.args.get('fieldId')
        if field_id:
            # Si se proporcionó el parámetro, filtrar solo los corrales que coincidan con el fieldId
            pens = Pen.query.filter(Pen.field_id == field_id).all()
            serialized_pens = [pen.to_dict(
                rules=('-field', '-variable')) for pen in pens]
            return jsonify(serialized_pens)
        pens = Pen.query.all()
        serialized_pens = [pen.to_dict() for pen in pens]
        return jsonify(serialized_pens)


@main_bp.route('/report', methods=['GET', 'POST', 'DELETE'])
def manage_report():
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        comment = data.get('comment')
        field_id = data.get('field_id')
        # measurements = data.get('measurements')
        # object_id = data.get('object_id')

        date = datetime.now()
        try:
            new_report = Report(name=name, comment=comment,
                                field_id=field_id, date=date)
            print(new_report)
            db.session.add(new_report)
            db.session.commit()
            # manage_measurement(new_report.id, measurements, object_id)
            serialized_report = new_report.to_dict()
            return jsonify({'message': f'Nuevo reporte creado.', 'report': serialized_report}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        reports = Report.query.all()
        serialized_reports = [report.to_dict() for report in reports]
        return jsonify(serialized_reports)
    if request.method == 'DELETE':
        try:
            reports = Report.query.filter(~Report.measurement.any()).all()
            for report in reports:
                if report.measurement.count() == 0:
                    db.session.delete(report)
                    db.session.commit()
                    print(f'Reporte con ID {
                          report.id} eliminado correctamente.')
                # return jsonify({'message': 'Informes sin mediciones asociadas eliminados correctamente.'}), 200
            return jsonify({'message': 'Informes sin mediciones asociadas eliminados correctamente.'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Ocurrió un error al eliminar los informes: {str(e)}'}), 500


@main_bp.route('/typeofobjects', methods=['GET', 'POST'])
def manage_get_type_of_objects():
    if request.method == 'GET':
        typeofobjects = TypeOfObject.query.all()
        print(typeofobjects)
        serialized = [type_obj.to_dict() for type_obj in typeofobjects]
        return jsonify(serialized)
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        try:
            new_typeofobject = TypeOfObject(name=name)
            db.session.add(new_typeofobject)
            db.session.commit()
            return jsonify({'message': 'Nuevo tipo de objeto creado'}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500


@main_bp.route('/object', methods=['GET', 'POST'])
def manage_object():
    if request.method == 'GET':
        objects = Object.query.all()
        serialized = [obj.to_dict() for obj in objects]
        return jsonify(serialized)
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        typeid = data.get('typeid')
        try:
            newobj = Object(name=name, type_of_object_id=typeid)
            db.session.add(newobj)
            db.session.commit()
            return jsonify({'message': 'Nuevo objeto creado'}), 201
        except ValueError as e:
            errormessage = str(e)
            return jsonify({'error': errormessage}), 400
        except Exception as e:
            db.session.rollback()
            errormessage = str(e)
            return jsonify({'error': errormessage}), 500


@main_bp.route('/penVariablee', methods=['POST'])
def manage_penvariablee():
    if request.method == 'POST':
        data = request.json
        pen_id = data.get('pen_id')
        variable_id = data.get('variable_id')
        custom_parameters = data.get('custom_parameters')
        try:
            new_pen_variable = PenVariable(
                pen_id=pen_id, variable_id=variable_id, custom_parameters=custom_parameters)
            db.session.add(new_pen_variable)
            db.session.commit()
            return jsonify({'message': 'Nuevo penVariable creado'}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500


@main_bp.route('/pen/<int:pen_id>', methods=['DELETE'])
def delete_pen(pen_id):
    pen_to_delete = Pen.query.get(pen_id)

    if not pen_to_delete:
        return jsonify({'error': 'No se encontró el corral a eliminar'}), 404
    try:
        db.session.delete(pen_to_delete)
        db.session.commit()
        return jsonify({'message': 'Corral eliminado exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        error_message = str(e)
        return jsonify({'error': error_message}), 500


@main_bp.route('/penVariable', methods=['GET', 'POST'])
def manage_penVariable(new_pen_id=None, variables=None):
    print("ENTRE")
    if request.method == 'POST':
        print("ENTRE2")
        if not new_pen_id:
            return jsonify({'error': 'El ID del corral es requerido'}), 400
        existing_variables_ids = [v.id for v in Variable.query.all()]
        invalid_variables_ids = [
            v['id'] for v in variables if v['id'] not in existing_variables_ids]

        if invalid_variables_ids:
            return jsonify({'error': f'Las siguientes variables no existen: {invalid_variables_ids}'}), 400
        try:
            for variable in variables:
                print("variable:", variable)
                variable_id = variable.get('id')
                parameters = variable.get('parameters')
                new_pen_variable = PenVariable(
                    pen_id=new_pen_id, variable_id=variable_id, custom_parameters=parameters)
                db.session.add(new_pen_variable)

            db.session.commit()
            return jsonify({'message': 'Relaciones Pen-Variable creadas exitosamente'}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        penVariables = PenVariable.query.all()
        serialized_penVariables = [pen_variable.to_dict(rules=('-pen', '-variable'))
                                   for pen_variable in penVariables]
        return jsonify(serialized_penVariables)


@main_bp.route('/penVariable/<int:pen_id>', methods=['GET'])
def get_penVariables_by_pen_id(pen_id):
    penVariables = PenVariable.query.filter_by(pen_id=pen_id).all()
    if not penVariables:
        return jsonify({'message': f'No se encontraron relaciones PenVariable para el pen_id {pen_id}'}), 404
    serialized_penVariables = [pen_variable.to_dict(only=(
        'id', 'custom_parameters', 'variable.type', 'variable.name', 'variable.id')) for pen_variable in penVariables]
    return jsonify(serialized_penVariables)


@main_bp.route('/measurement', methods=['GET', 'POST'])
def manage_measurement(report_id=None, measurements=None, object_id=None):
    if request.method == 'POST':
        try:

            # for pen_variable_id in measurements:
            #     new_measurement = Measurement(
            # date = datetime.now()
            # new_measurement = Measurement(
            #     pen_variable_id=pen_variable_id, value=value, report_id=report_id)
            # db.session.add(new_measurement)
            # db.session.commit()
            data = request.json
            # report_id = data.get('report_id')
            # measurements = data.get('measurements')
            # object_id = data.get('object_id')
            for pen_variable_id in measurements:
                new_measurement = Measurement(
                    report_id=report_id, pen_variable_id=pen_variable_id, value=measurements[pen_variable_id], object_id=object_id)
                db.session.add(new_measurement)
                db.session.commit()
            return jsonify({'message': 'Medición creada correctamente'}), 201
        except ValueError as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            error_message = str(e)
            return jsonify({'error': error_message}), 500
    if request.method == 'GET':
        # measurements = Measurement.query.all()
        # # return jsonify({'message': f'No se encontraron relaciones PenVariable para el pen_id {pen_id}'}), 404
        # serialized_measurement =[m.to_dict(only=('id','value','pen_variable_id.id', 'pen_variable_id.custom_parameters', 'cow.id', 'cow.name', 'date')) for m in measurements]
        # return jsonify(serialized_measurement)
        measurements = Measurement.query.all()
        serialized_measurements = [measurement.to_dict()
                                   for measurement in measurements]
        # for m in measurements:
        #     date_str = m.date.date().isoformat()
        #     m_dict = m.to_dict(
        #         only=('id', 'value', 'pen_variable_id', 'cow_id'))
        # # Buscar si ya existe el objeto para esta fecha
        #     date_obj = next(
        #         (d for d in serialized_measurements if d["date"] == date_str), None)
        #     if date_obj is not None:
        #         # Si ya existe, agregar esta medición a la lista
        #         date_obj["measurements"].append(m_dict)
        #     else:
        #         # Si no existe, crear un nuevo objeto con la fecha y la lista de mediciones
        #         serialized_measurements.append({
        #             "date": date_str,
        #             "measurements": [m_dict]
        #         })
    return jsonify(serialized_measurements)


@main_bp.route('/variable', methods=['GET', 'POST'])
def manage_variable():
    if request.method == 'POST':
        try:
            data = request.json
            print("DATA:", data)
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
                    granularity = float(parameters['granularity'])
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
            new_variable = Variable(
                name=name, type=type, default_parameters=parameters)
            new_variable.validate()
            db.session.add(new_variable)
            db.session.commit()
            return jsonify({'message': 'Nueva variable creada con exito', 'variable_id': new_variable.id}), 201
        except ValueError as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 400
        except Exception as e:
            db.session.rollback()
            error_message = str(e)
            return jsonify({'error': error_message}), 500

    if request.method == 'GET':
        variables = Variable.query.all()
        serialized_variables = [variable.to_dict(
            only=('id', 'name', 'type', 'default_parameters')) for variable in variables]
        return serialized_variables


@main_bp.route('/variable/<int:variable_id>', methods=['PATCH', 'DELETE'])
def manage_modify_variable(variable_id):
    if request.method == 'PATCH':
        try:
            variable = Variable.query.get_or_404(variable_id)
            data = request.json
            new_name = data.get('name')
            if new_name and new_name.lower() != variable.name.lower():
                variable.name = new_name
                db.session.commit()
                return jsonify({'message': 'Variable modificada correctamente'}), 200
            variable.validate()
        except ValueError as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    if request.method == 'DELETE':
        try:
            variable = Variable.query.get_or_404(variable_id)
            db.session.delete(variable)
            db.session.commit()
            return jsonify({'message': 'Variable eliminada exitosamente.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
