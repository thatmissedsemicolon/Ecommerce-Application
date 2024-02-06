from .. import os, app, Blueprint, Response, request, jsonify, token_required, admin_token_required, send_file
from ..auth.auth import Auth
from ..user.user import User
from ..product.product import Product
from ..order.order import Order
from ..utils.ImageManager import ImageManager
from ..wishlist.wishlist import Wishlist
from ..dashboard.dashboard import Dashboard

routes = Blueprint('routes', __name__)

@routes.route('/api/v1/validate_email', methods=['GET', 'POST'])
def user_validate_email() -> Response:
    user_data = request.get_json()
    email = user_data.get('email', None)

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    auth = Auth(email=email)

    response = auth.validate_email()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/signin', methods=['POST'])
def user_signin() -> Response:
    user_data = request.get_json()
    email = user_data.get('email', None)
    password = user_data.get('password', None)

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    auth = Auth(email=email, password=password)

    response = auth.signin()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/signup', methods=['POST'])
def user_signup() -> Response:
    user_data = request.get_json()
    name = user_data.get('name', None)
    email = user_data.get('email', None)
    password = user_data.get('password', None)
    repeat_password = user_data.get('repeat_password', None)

    if not name or not email or not password or not repeat_password:
        return jsonify({'message': 'Name, Email and password are required'}), 400

    auth = Auth(name=name, email=email, password=password, repeat_password=repeat_password)

    response = auth.signup()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/user', methods=['GET'])
@token_required
def user_details(user_data) -> Response:
    _id = user_data.get('id', None)
    email = user_data.get('email', None)

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    auth = User(_id=_id, email=email)

    response = auth.get_user()

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/update_user', methods=['PUT'])
@token_required
def user_update(user_data) -> Response:
    _id = user_data.get('id', None)
    email = user_data.get('email', None)
    user_details = request.get_json()

    user = User(_id=_id, email=email)

    response = user.update_user(user_details=user_details)

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/delete_user', methods=['DELETE'])
@token_required
def user_delete(user_data) -> Response:
    _id = user_data.get('id', None)
    email = user_data.get('email', None)

    user = User(_id=_id, email=email)

    response = user.delete_user()

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/products', methods=['GET'])
def get_products() -> Response:
    category = request.args.get('category')
    productId = request.args.get('productId')
    page = request.args.get('page', 1, type=int)
    
    if productId:
        product = Product(productId=productId)
    else:
        product = Product(category=category)

    response = product.get_product(page=page)

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/products/add_review', methods=['POST'])
@token_required
def user_add_review(_) -> Response:
    review = request.get_json()
    productId = review.get('productId', None)
    
    if not productId:
        return jsonify({'message': 'Product Id is required'}), 401

    product = Product(productId=productId)
    response = product.add_product_review(review_data=review)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/add_order', methods=['POST'])
@token_required
def user_add_order(user_data) -> Response:
    order = request.get_json()
    user_id = user_data.get('id', None)

    order = Order(order=order, user_id=user_id)
    response = order.add_order()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/get_orders', methods=['GET'])
@token_required
def user_get_order(user_data) -> Response:
    user_id = user_data.get('id', None)
    order_id = request.args.get('orderId', None)
    page = request.args.get('page', 1, type=int)

    order = Order(user_id=user_id)
    response = order.get_orders(order_id=order_id, page=page)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/user_order_validation', methods=['GET'])
@token_required
def user_has_purchased_product(user_data) -> Response:
    user_id = user_data.get('id', None)
    product_id = request.args.get('productId', None)

    order = Order(user_id=user_id)
    response = order.has_user_purchased_product(product_id=product_id)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/cancel_order', methods=['PUT'])
@token_required
def user_cancel_order(_) -> Response:
    order_data = request.get_json()
    order_id = order_data.get('orderId', None)

    order= Order(_id=order_id)
    response = order.update_order(status='Cancelled')

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/get_wish_list', methods=['GET'])
@token_required
def user_get_wish_list(user_data) -> Response:
    user_id = user_data.get('id', None)

    wishlist = Wishlist(user_id=user_id)
    response = wishlist.get_wish_list()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/add_to_wishlist', methods=['POST'])
@token_required
def user_add_to_wishlist(_) -> Response:
    wishlist_data = request.get_json()

    _id = wishlist_data.get('_id', None)
    user_id = wishlist_data.get('userId', None)
    product_id = wishlist_data.get('productId', None)

    wishlist = Wishlist(_id=_id, user_id=user_id, product_id=product_id)
    response = wishlist.add_to_wish_list()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/product_in_wish_list', methods=['GET'])
@token_required
def user_product_in_wish_list(user_data) -> Response:
    user_id = user_data.get('id', None)
    product_id = request.args.get('productId', None)

    wishlist = Wishlist(user_id=user_id, product_id=product_id)
    response = wishlist.product_in_wish_list()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/remove_from_wishList', methods=['POST'])
@token_required
def user_remove_wishlist(_) -> Response:
    wishlist_data = request.get_json()
    user_id = wishlist_data.get('userId', None)
    product_id = wishlist_data.get('productId', None)

    wishlist = Wishlist(user_id=user_id, product_id=product_id)
    response = wishlist.remove_from_wishlist()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/upload', methods=['POST'])
@admin_token_required
def admin_upload_file(_) -> Response:
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    image_manager = ImageManager(app.config['UPLOAD_FOLDER'])

    success, message, file_path = image_manager.save_image(file, file.filename)

    if success:
        return jsonify({'message': message, 'imageUrl': 'http://localhost:8000/api/v1/get_image?filepath=' + file_path}), 200
    return jsonify({'message': message}), 400

@routes.route('/api/v1/get_image', methods=['GET'])
def admin_get_image():
    filepath = request.args.get('filepath')

    if not os.path.isfile(filepath):
        return "File not found", 404
    
    return send_file(filepath, mimetype='image/*')

@routes.route('/api/v1/admin/get_dashboard_data', methods=['GET'])
@admin_token_required
def admin_get_dashboard_data(user_data) -> Response:
    user_id = user_data.get('id', None)
    user_is_admin = user_data.get('is_admin', None)

    dashboard = Dashboard(user_id=user_id, user_is_admin=user_is_admin)
    
    response = dashboard.get_dashboard_data()

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/get_all_users', methods=['GET'])
@admin_token_required
def admin_get_all_users(_) -> Response:
    search_term = request.args.get('searchTerm', None)
    page = request.args.get('page', 1, type=int)
    user = User()
    response = user.get_all_users(search_term=search_term, page=page)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/update_user', methods=['PUT'])
@admin_token_required
def admin_update_user(_) -> Response:
    user_details = request.get_json()
    email = user_details.get('email', None)
    user = User(email=email)

    user_details.pop('email', None)

    response = user.update_user(user_details=user_details)

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/add_product', methods=['POST'])
@admin_token_required
def admin_add_product(user_data) -> Response:
    if not user_data:
        return jsonify({'message': 'Unauthorized!'}), 401

    product_json = request.get_json()
    product = Product(product=product_json)

    response = product.add_product()

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/get_products', methods=['GET'])
@admin_token_required
def admin_get_all_products(_) -> Response:
    search_term = request.args.get('searchTerm', None)
    page = request.args.get('page', 1, type=int)
    product = Product()
    response = product.get_all_products(search_term=search_term, page=page)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/update_product', methods=['PUT'])
@admin_token_required
def admin_update_product(_) -> Response:
    product_details = request.get_json()
    product_id = product_details.get('_id', None)
    product = Product(productId=product_id, product=product_details)

    product_details.pop('_id', None)

    response = product.update_product()

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/delete_product', methods=['DELETE'])
@admin_token_required
def admin_delete_product(_) -> Response:
    product_id = request.args.get('productId', None)
    product = Product(productId=product_id)

    response = product.delete_product()

    if response:
        return response

    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/get_orders', methods=['GET'])
@admin_token_required
def admin_get_orders(_) -> Response:
    search_term = request.args.get('searchTerm', None)
    page = request.args.get('page', 1, type=int)
    order = Order()
    response = order.get_orders(search_term=search_term, page=page)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500

@routes.route('/api/v1/admin/update_order', methods=['PUT'])
@admin_token_required
def admin_update_order(_) -> Response:
    order_data = request.get_json()
    order_id = order_data.get('orderId', None)
    status = order_data.get('status', None)

    order= Order(_id=order_id)
    response = order.update_order(status=status)

    if response:
        return response
    
    return jsonify({'message': 'Something went wrong...'}), 500