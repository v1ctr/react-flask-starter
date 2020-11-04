import unittest
from app import create_app, db
from app.models import User


class UserModelTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_password_setter(self):
        u = User('email', 'password')
        self.assertTrue(u.password_hash is not None)

    def test_no_password_getter(self):
        u = User('email', 'password')
        with self.assertRaises(AttributeError):
            u.password

    def test_password_verification(self):
        u = User('email', 'password')
        self.assertTrue(u.verify_password('password'))
        self.assertFalse(u.verify_password('wrong_password'))

    def test_password_salts_are_random(self):
        u = User('email', 'password')
        u2 = User('email', 'password')
        self.assertTrue(u.password_hash != u2.password_hash)

    def test_confirmation(self):
        u = User('email', 'password')
        self.assertFalse(u.confirmed)
        self.assertFalse(u.confirmed_at)
        token = u.generate_confirmation_token()
        self.assertFalse(u.confirm(''))
        self.assertFalse(u.confirm('wrong_token'))
        self.assertTrue(u.confirm(token))
        self.assertTrue(u.confirmed)
        self.assertTrue(u.confirmed_at)
        u2 = User('email', 'password')
        self.assertFalse(u2.confirm(token))
