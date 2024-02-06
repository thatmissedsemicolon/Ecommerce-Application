"""
This module defines the authentication logic for the application, including
methods for signing in and signing up users.
"""

import uuid
from . import secret_key
from .. import Response, json, jsonify, bcrypt, jwt, datetime, timedelta, db

class Auth:
    """
    This class implements authentication mechanisms for the application.
    It provides methods for user sign-up, sign-in, and email validation.
    """

    def __init__(self, _id=None, name=None,
            email=None, password=None, repeat_password=None,
            user_is_admin=False, user_account_is_active=True, user_email_verified = False,
            account_created_timestamp=None, last_login_timestamp=None, expires=None
        ) -> None:
        self._id = _id if _id else str(uuid.uuid4())
        self.name = name
        self.email = email
        self.password = password
        self.repeat_password = repeat_password
        self.user_email_verified = user_email_verified
        self.user_is_admin = user_is_admin
        self.user_account_is_active = user_account_is_active
        self.account_created_timestamp = account_created_timestamp if account_created_timestamp else int(datetime.utcnow().timestamp())
        self.last_login_timestamp = last_login_timestamp if last_login_timestamp else int(datetime.utcnow().timestamp())
        self.expires = expires

    def validate_email(self) -> Response:
        """Validates if the provided email exists in the database."""
        user_exists = db.users.find_one({'email': self.email})

        if user_exists:
            return jsonify({'message': True}), 200
        return jsonify({'message': 'Email does not exist!'}), 401

    def signin(self) -> Response:
        """Authenticates a user and returns a token upon successful sign-in."""
        try:
            user = db.users.find_one({'email': self.email})
            if user and bcrypt.checkpw(self.password.encode('utf-8'), user.get('password', None)):
                if user.get('user_account_is_active', True):
                    expires = datetime.utcnow() + timedelta(hours=1)
                    token = jwt.encode({
                        "id": user.get("_id", None),
                        'email': user.get("email", None), 
                        'user_is_admin': user.get("user_is_admin", False),
                        "user_account_is_active": user.get("user_account_is_active", True), 
                        'exp': expires
                    }, secret_key, algorithm='HS256')

                    db.users.update_one(
                        {
                            'email': self.email
                        }, 
                        {
                            '$set': {
                                'last_login_timestamp': int(datetime.utcnow().timestamp()),
                                'expires': int(expires.timestamp())
                            }
                        }
                    )

                    user_data = {
                        "id": user.get("_id", None),
                        "name": user.get("name", None),
                        "email": user.get("email", None),
                        "user_is_admin": user.get("user_is_admin", False),
                        "user_email_verified": user.get("is_email_verified", False),
                        "user_account_is_active": user.get("user_account_is_active", True),
                        "account_created_timestamp": user.get("account_created_timestamp", None),
                        "last_login_timestamp": user.get("last_login_timestamp", None),
                        "expires": user.get("expires", None) if user.get("expires") is not None else int(expires.timestamp())
                    }

                    response_data = {
                        "access_token": token,
                        "user": user_data
                    }

                    response_json = json.dumps(response_data, indent=2)
                    return Response(response_json, mimetype='application/json', status=200)
                return jsonify({'message': 'Account is not active!'}), 401
            return jsonify({'message': 'Invalid credentials!'}), 401
        except Exception:
            return jsonify({'message': 'An error occurred during sign in!'}), 500

    def signup(self) -> Response:
        """Registers a new user into the system."""
        user_exists = db.users.find_one({'email': self.email})

        if user_exists:
            return jsonify({'message': 'User already exists!'}), 400

        if self.password != self.repeat_password:
            return jsonify({'message': 'Passwords do not match!'}), 401

        password = self.password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        self.password = hashed_password

        user_data = {
            "_id": self._id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "user_is_admin": self.user_is_admin,
            "user_email_verified": self.user_email_verified,
            "user_account_is_active": self.user_account_is_active,
            "account_created_timestamp": self.account_created_timestamp,
            "last_login_timestamp": self.last_login_timestamp,
            "expires": self.expires,
        }

        db.users.insert_one(user_data)
        return jsonify({'message': 'User successfully created!'}), 201
