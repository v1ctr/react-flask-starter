import unittest
import datetime
from flask_jwt_extended import create_refresh_token, decode_token
from flask import current_app
from app import create_app, db
from app.models import User, TokenBlacklist


class TokenBlacklistModelTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_blacklisted_token(self):
        user = User('email', 'password')
        db.session.add(user)
        db.session.commit()
        refresh_token = create_refresh_token(identity=user)
        blacklisted_token = TokenBlacklist(refresh_token, current_app.config['JWT_IDENTITY_CLAIM'])
        db.session.add(blacklisted_token)
        db.session.commit()
        decoded_token = decode_token(refresh_token)
        self.assertEqual(blacklisted_token.jti, decoded_token['jti'])
        self.assertEqual(blacklisted_token.user, user)
        self.assertTrue(blacklisted_token.created_at)
        self.assertEqual(blacklisted_token.expires_at, datetime.datetime.fromtimestamp(decoded_token['exp']))
        self.assertFalse(blacklisted_token.revoked)

    def test_is_token_revoked(self):
        user = User('email', 'password')
        db.session.add(user)
        db.session.commit()
        refresh_token = create_refresh_token(identity=user)
        blacklisted_token = TokenBlacklist(refresh_token, current_app.config['JWT_IDENTITY_CLAIM'])
        db.session.add(blacklisted_token)
        db.session.commit()
        decoded_token = decode_token(refresh_token)
        self.assertFalse(TokenBlacklist.is_token_revoked(decoded_token))

