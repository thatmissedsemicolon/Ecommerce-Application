from .. import Response, bcrypt, json, jsonify, db, redis_client, datetime
import re
import math

class User:
    def __init__(self, _id=None, email=None) -> None:
        self._id = _id
        self.email = email
    
    def get_user(self) -> Response:
        cache_key = f"user:{self.email}"
        cached_user = redis_client.get(cache_key)
        if cached_user:
            return Response(cached_user, mimetype='application/json', status=200)

        user_exists = db.users.find_one({'email': self.email})
        if user_exists:
            user_data = {
                "_id" : user_exists.get("_id", None),
                "email": user_exists.get("email", None),
                "name": user_exists.get("name", None),
                "user_email_verified": user_exists.get("is_email_verified", False),
                "user_is_admin": user_exists.get("user_is_admin", False),
                "user_account_is_active": user_exists.get("user_is_active", True),
                "account_created_timestamp": user_exists.get("account_created_timestamp", None),
                "last_login_timestamp": user_exists.get("last_login_timestamp", None),
                "expires": user_exists.get("expires", None)
            }

            response_json = json.dumps(user_data, indent=2)

            redis_client.setex(cache_key, 3600, response_json)
            
            return Response(response_json, mimetype='application/json', status=200)
        return jsonify({'message': 'User does not exist!'}), 401
    
    def delete_user(self):
        db.wishlist.delete_many({'userId': self._id})

        result = db.users.delete_one({'email': self.email})

        if result.deleted_count == 0:
            return jsonify({'message': 'User does not exist!'}), 404

        return jsonify({'message': 'User and wishlist deleted successfully!'}), 200

    def get_all_users(self, search_term=None, page=1, page_size=10):
        query = {}
        if search_term:
            regex = re.compile(f'.*{re.escape(search_term)}.*', re.IGNORECASE)
            query['email'] = regex

        skip = (page - 1) * page_size

        total_count = db.users.count_documents(query)

        cursor = db.users.find(query).skip(skip).limit(page_size)
        users = [user for user in cursor]

        serialized_users = []

        for user in users:
            if '_id' in user:
                user['_id'] = str(user['_id'])
            user.pop('password', None)

            if 'last_login_timestamp' in user:
                user['last_login_timestamp'] = datetime.utcfromtimestamp(user['last_login_timestamp']).strftime('%m-%d-%Y %H:%M:%S')

            serialized_users.append(user)

        total_pages = math.ceil(total_count / page_size)

        return jsonify({"users": serialized_users, "total_pages": total_pages}), 200
    
    def update_user(self, user_details):
        admin_fields = ['user_is_admin', 'user_account_is_active']
        user_fields = ['name', 'email']

        update_fields = {k: user_details[k] for k in admin_fields + user_fields if k in user_details}

        if 'password' in user_details and user_details['password'].strip():
            update_fields['password'] = bcrypt.hashpw(
                user_details['password'].encode('utf-8'), 
                bcrypt.gensalt()
            )

        if not update_fields:
            return jsonify({'message': 'No valid fields provided'}), 400

        if 'email' in update_fields:
            existing_user = db.users.find_one({'email': update_fields['email']})
            if existing_user and existing_user['_id'] != self._id:
                return jsonify({'message': 'Email already in use by another account'}), 409
            
        result = db.users.update_one(
            {'email': self.email},
            {'$set': update_fields}
        )

        if result.matched_count == 0:
            return jsonify({'message': 'User does not exist!'}), 404

        return jsonify({'message': 'User updated successfully!'}), 200
    
    def user_is_admin(userId):
        user = db.users.find_one({'_id': userId})
        if user and user.get('user_is_admin', False):
            return True
        return False
