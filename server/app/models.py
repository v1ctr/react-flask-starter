import datetime
import uuid
from flask import current_app
from sqlalchemy_utils import UUIDType
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from . import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUIDType(binary=False), primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(32), nullable=True)
    last_name = db.Column(db.String(32), nullable=True)
    created_at = db.Column(db.DateTime)
    confirmed = db.Column(db.Boolean, nullable=True, default=False)
    confirmed_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, email, password):
        self.id = uuid.uuid4()
        self.email = email
        self.password = password
        self.confirmed = False
        self.created_at = datetime.datetime.utcnow()

    def __repr__(self):
        return f'<User {self.email}>'

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.get_id()}).decode('utf-8')

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('confirm') != self.get_id():
            return False
        self.confirmed = True
        self.confirmed_at = datetime.datetime.utcnow()
        db.session.add(self)
        db.session.commit()
        return True

    def get_id(self):
        return str(self.id)

