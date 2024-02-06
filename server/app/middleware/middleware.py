from . import secret_key, db
from .. import request, jwt, wraps, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {'message': 'Token is missing'}, 401
        try:
            user_data = jwt.decode(token, secret_key, algorithms=['HS256'])
            email = user_data.get('email')

            user_account = db.users.find_one({'email': email})

            if not user_account or not user_account.get('user_account_is_active', True):
                return jsonify({'message': 'Account is not active'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'message': 'Something went wrong...'}), 500
        return f(user_data, *args, **kwargs)
    return decorated

def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {'message': 'Token is missing'}, 401
        try:
            user_data = jwt.decode(token, secret_key, algorithms=['HS256'])
            if not user_data.get('user_is_admin', False):
                return jsonify({'message': 'User is not an admin'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'message': 'Something went wrong...'}), 500
        return f(user_data, *args, **kwargs)
    return decorated