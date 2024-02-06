import uuid
import re
import math
from .. import jsonify, db, UpdateOne, DESCENDING
from ..product.product import Product
from ..user.user import User

class Order:
    def __init__(self, order = {}, _id = None, user_id = None) -> None:
        self.order = order
        self._id = _id if _id else str(uuid.uuid4())
        self.user_id = user_id

        if '_id' not in self.order:
            self.order['_id'] = str(uuid.uuid4())
    
    def add_order(self):
        order_id = db.orders.insert_one(self.order).inserted_id

        if not order_id:
            return jsonify({'message': 'Something went wrong...'}), 500

        updates = {}
        for item in self.order.get('items', []):
            product_id = item['_id']
            quantity_ordered = item['quantity']
            updates[product_id] = updates.get(product_id, 0) + quantity_ordered

        product_ids = list(updates.keys())
        products = {p['_id']: p for p in db.products.find({'_id': {'$in': product_ids}})}

        bulk_operations = []
        for product_id, quantity_ordered in updates.items():
            product = products.get(product_id)
            if product:
                new_quantity = int(product['stock']) - quantity_ordered
                bulk_operations.append(
                    UpdateOne({'_id': product_id}, {'$set': {'stock': new_quantity}})
                )

        if bulk_operations:
            db.products.bulk_write(bulk_operations)

        return jsonify({"_id": order_id}), 200
    
    def get_orders(self, order_id=None, page=1, limit=4):
        if order_id:
            orders = db.orders.find_one({'_id': order_id})
            if orders:
                return orders
            return jsonify({'message': 'Order not found'}), 404

        skip = (page - 1) * limit
        orders_cursor = db.orders.find({'userId': self.user_id}).sort('date', DESCENDING).skip(skip).limit(limit)
        orders_list = list(orders_cursor)

        total_orders = db.orders.count_documents({'userId': self.user_id})
        next_page_available = total_orders > (skip + limit)

        if orders_list:
            return jsonify({'orders': orders_list, 'next_page_available': next_page_available}), 200
        else:
            return jsonify({'message': 'No orders found'}), 404
        
    def has_user_purchased_product(self, product_id):
        order = db.orders.find_one({'userId': self.user_id, 'items._id': product_id})
        if order:
            return jsonify({'message': True }), 200
        return jsonify({'message': False }), 200
    
    def update_order(self, status):
        order = db.orders.find_one({'_id': self._id})
        if order:
            db.orders.update_one(
                {'_id': self._id},
                {'$set': {'status': status}}
            )

            bulk_operations = []
            for item in order.get('items', []):
                product_id = item.get('_id')
                quantity = item.get('quantity', 0)
                bulk_operations.append(
                    UpdateOne({'_id': product_id}, {'$inc': {'stock': quantity}})
                )

            if bulk_operations:
                db.products.bulk_write(bulk_operations)

            return jsonify({'message': 'Success!'}), 200
        else:
            return jsonify({'message': 'Order not found'}), 404
        
    def get_order_updates(data):
        order_id = data.get('orderId', None)
        user_id = data.get('userId', None)
        order = db.orders.find_one({'_id': order_id})

        if order.get('userId', None) != user_id and not User.user_is_admin(userId=user_id):
            return {'error': 'Unauthorized access!'}

        if order and 'items' in order:
            product_details = [Product.get_product_details(item['_id']) for item in order['items']]
            updated_items = [{**item, **details} for item, details in zip(order['items'], product_details)]
            order['items'] = updated_items

        return order
    
    def get_all_orders(search_term, page, limit=10):
        skip = limit * (page - 1)

        search_query = {}

        if search_term:
            regex_pattern = re.compile(f'.*{re.escape(search_term)}.*', re.IGNORECASE)

            search_query = {
                "$or": [
                    {"_id": regex_pattern},
                    {"email": regex_pattern}
                ]
            }

        orders = db.orders.find(search_query).skip(skip).limit(limit).sort('date', DESCENDING)
        orders_list = list(orders)

        total_count = db.orders.count_documents(search_query)
        total_pages = math.ceil(total_count / limit)

        return {'orders': orders_list, 'total_pages': total_pages}
