import datetime
import uuid
from . import auth_blueprint
from app import db
from app.models import User
from app.email import send_email
from flask import request, jsonify
from werkzeug.exceptions import BadRequest, Unauthorized, UnprocessableEntity
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_current_user,
                                create_access_token, create_refresh_token)


@auth_blueprint.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        raise BadRequest('must include email and password fields')

    user = User.query.filter_by(email=data['email']).first()
    if user and user.verify_password(data['password']):
        response_data = {
            'access_token': create_access_token(identity=user, expires_delta=datetime.timedelta(minutes=15)),
            'refresh_token': create_refresh_token(identity=user)
        }
        return jsonify(response_data), 200

    raise Unauthorized('Bad username or password')


@auth_blueprint.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user_id = get_jwt_identity()
    response_data = {
        'access_token': create_access_token(identity=current_user_id, fresh=False, expires_delta=datetime.timedelta(minutes=15))
    }
    return jsonify(response_data), 200


@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data:
        raise BadRequest('must include email and password fields')
    if User.query.filter_by(email=data['email']).first():
        raise BadRequest('please use a different email address')

    new_user = User(data['email'], data['password'])
    db.session.add(new_user)
    db.session.commit()
    token = new_user.generate_confirmation_token()
    send_email(new_user.email, 'Confirm Your Account',
        'email/confirm', user=new_user, token=token)
    response_data = {
        'access_token': create_access_token(identity=new_user, expires_delta=datetime.timedelta(minutes=15)),
        'refresh_token': create_refresh_token(identity=new_user)
    }
    return jsonify(response_data), 201


@auth_blueprint.route('/confirm/<token>', methods=['POST'])
@jwt_required
def confirm(token):
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=uuid.UUID(current_user_id)).first_or_404()
    if user.confirmed:
        return jsonify({ 'confirmed': True }), 200
    if user.confirm(token):
        return jsonify({ 'confirmed': user.confirmed }), 200
    raise UnprocessableEntity('Bad confirmation token')
