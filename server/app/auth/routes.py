import datetime
import uuid
from . import auth_blueprint
from app import db
from app.models import User, TokenBlacklist
from app.email import send_email
from flask import request, jsonify, current_app
from werkzeug.exceptions import BadRequest, Unauthorized, UnprocessableEntity
from flask_jwt_extended import (jwt_required, jwt_refresh_token_required, get_jwt_identity, get_current_user,
                                create_access_token, create_refresh_token, set_refresh_cookies)


@auth_blueprint.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        raise BadRequest('must include email and password fields')

    user = User.query.filter_by(email=data['email']).first()
    if user and user.verify_password(data['password']):
        refresh_token = create_refresh_token(identity=user)
        # Add Refresh Token to Blacklist with status not revoked
        blacklisted_token = TokenBlacklist(refresh_token, current_app.config['JWT_IDENTITY_CLAIM'])
        db.session.add(blacklisted_token)
        db.session.commit()
        response_data = {
            'access_token': create_access_token(identity=user, expires_delta=datetime.timedelta(minutes=15))
        }
        response = jsonify(response_data)
        set_refresh_cookies(response, refresh_token)
        return response, 200

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

    new_user = User(data['email'].lower(), data['password'])
    db.session.add(new_user)
    db.session.commit()
    token = new_user.generate_confirmation_token()
    confirmation_url = f'http://{current_app.config["CLIENT_BASE_URL"]}/auth/confirm/{token}'
    send_email(new_user.email, 'Confirm Your Account',
        'email/confirm', user=new_user, url=confirmation_url)
    
    refresh_token = create_refresh_token(identity=new_user)
    # Add Refresh Token to Blacklist with status not revoked
    blacklisted_token = TokenBlacklist(refresh_token, current_app.config['JWT_IDENTITY_CLAIM'])
    db.session.add(blacklisted_token)
    db.session.commit()
    response_data = {
        'access_token': create_access_token(identity=new_user, expires_delta=datetime.timedelta(minutes=15))
    }
    response = jsonify(response_data)
    set_refresh_cookies(response, refresh_token)
    return response, 201


@auth_blueprint.route('/confirm/<token>', methods=['POST'])
@jwt_required
def confirm(token):
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=uuid.UUID(current_user_id)).first_or_404()
    if user.confirmed:
        raise BadRequest('Account already confirmed.')
    if user.confirm(token):
        return jsonify({ 'confirmed': user.confirmed }), 200
    raise UnprocessableEntity('Bad confirmation token')


@auth_blueprint.route('/resend', methods=['POST'])
@jwt_required
def resend_confirmation():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=uuid.UUID(current_user_id)).first_or_404()
    if user.confirmed:
        raise BadRequest('Account already confirmed.')

    token = user.generate_confirmation_token()
    confirmation_url = f'http://{current_app.config["CLIENT_BASE_URL"]}/auth/confirm/{token}'
    send_email(user.email, 'Confirm Your Account',
        'email/confirm', user=user, url=confirmation_url)
    return {}, 200


@auth_blueprint.route('/reset', methods=['POST'])
def request_password_reset():
    data = request.get_json() or {}
    if 'email' not in data :
        raise BadRequest('must include email field')
    
    user = User.query.filter_by(email=data['email'].lower()).first_or_404()
    if user:
        token = user.generate_reset_token()
        reset_url = f'http://{current_app.config["CLIENT_BASE_URL"]}/auth/reset/{token}'
        send_email(user.email, 'Reset Your Password',
            'email/reset', user=user, url=reset_url) 
    return {}, 200


@auth_blueprint.route('/reset/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json() or {}
    if 'password' not in data :
        raise BadRequest('must include password field')
    
    if User.reset_password(token, data['password']):
        return jsonify({ 'reset': True }), 200
    
    raise UnprocessableEntity('Bad reset token')
