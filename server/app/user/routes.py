from . import user_blueprint
from flask import jsonify
from flask_jwt_extended import jwt_required


@user_blueprint.route('/me', methods=['GET'])
@jwt_required
def get_me():
    response_data = {
        'success': True
    }
    return jsonify(response_data), 200