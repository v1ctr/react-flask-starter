from . import user_blueprint
from app.models import User
import uuid
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


@user_blueprint.route('/me', methods=['GET'])
@jwt_required
def get_me():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=uuid.UUID(current_user_id)).first_or_404()
    response_data = {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'created_at': user.created_at
    }
    return jsonify(response_data), 200
