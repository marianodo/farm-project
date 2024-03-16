from flask import render_template
from app.main import bp
from app.extensions import db
from flask import render_template, request, redirect, url_for, flash
#from app import db
from app.models import Variable, Grupo
from app.forms import VariableForm, GrupoForm


@bp.route('/')
def index():
    variables = Variable.query.all()
    grupos = Grupo.query.all()
    return render_template('index.html', variables=variables, grupos=grupos)


@bp.route('/crear_variable', methods=['GET', 'POST'])
def crear_variable():
    form = VariableForm()
    if form.validate_on_submit():
        variable = Variable(
            nombre=form.nombre.data,
            descripcion=form.descripcion.data,
            minimo=form.minimo.data,
            maximo=form.maximo.data,
            step=form.step.data,
            rango_optimo=form.rango_optimo.data
        )
        db.session.add(variable)
        db.session.commit()
        flash('Variable creada con éxito!')
        return redirect(url_for('main.index'))
    return render_template('crear_variable.html', form=form)

@bp.route('/editar_variable/<int:variable_id>', methods=['GET', 'POST'])
def editar_variable(variable_id):
    variable = Variable.query.get_or_404(variable_id)
    form = VariableForm(obj=variable)
    if form.validate_on_submit():
        variable.nombre = form.nombre.data
        variable.descripcion = form.descripcion.data
        variable.minimo = form.minimo.data
        variable.maximo = form.maximo.data
        variable.step = form.step.data
        variable.rango_optimo = form.rango_optimo.data
        db.session.commit()
        flash('Variable actualizada con éxito.', 'success')
        return redirect(url_for('main.index'))
    return render_template('editar_variable.html', form=form)

@bp.route('/eliminar_variable/<int:variable_id>', methods=['GET', 'POST'])
def eliminar_variable(variable_id):
    variable = Variable.query.get_or_404(variable_id)
    db.session.delete(variable)
    db.session.commit()
    flash('Variable eliminada con éxito.', 'success')
    return redirect(url_for('main.index'))

@bp.route('/eliminar_grupo/<int:grupo_id>', methods=['GET', 'POST'])
def eliminar_grupo(grupo_id):
    grupo = Grupo.query.get_or_404(grupo_id)
    db.session.delete(grupo)
    db.session.commit()
    flash('Grupo eliminado con éxito.', 'success')
    return redirect(url_for('main.index'))

@bp.route('/crear_grupo', methods=['GET', 'POST'])
def crear_grupo():
    form = GrupoForm()
    if form.validate_on_submit():
        grupo = Grupo(nombre=form.nombre.data)
        db.session.add(grupo)
        db.session.commit()
        flash('Grupo creado con éxito!')
        return redirect(url_for('main.index'))
    return render_template('crear_grupo.html', form=form)

@bp.route('/editar_grupo/<int:grupo_id>', methods=['GET', 'POST'])
def editar_grupo(grupo_id):
    grupo = Grupo.query.get_or_404(grupo_id)
    form = GrupoForm(obj=grupo)
    if form.validate_on_submit():
        grupo.nombre = form.nombre.data
        db.session.commit()
        flash('Grupo actualizado con éxito.', 'success')
        return redirect(url_for('main.index'))
    return render_template('editar_grupo.html', form=form)