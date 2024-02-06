from .. import db, jsonify

class Wishlist:
    def __init__(self, _id=None, user_id=None, product_id=None) -> None:
        self._id = _id
        self.user_id = user_id
        self.product_id = product_id

    def add_to_wish_list(self):
        wishlist_exists = db.wishlist.count_documents({'userId': self.user_id}) > 0

        if wishlist_exists:
            db.wishlist.update_one(
                {'userId': self.user_id},
                {'$addToSet': {'products': self.product_id}}
            )
        else:
            db.wishlist.insert_one({'_id': self._id, 'userId': self.user_id, 'products': [self.product_id]})

        return jsonify({'message': 'Product added to wishlist'}), 200
    
    def product_in_wish_list(self):
        wishlist = db.wishlist.find_one({'userId': self.user_id})

        if wishlist:
            products = wishlist.get('products', [])

            for product in products:
                if product == self.product_id:
                    return jsonify({'message': True }), 200
        return jsonify({'message': False }), 200
    
    def remove_from_wishlist(self):
        wishlist = db.wishlist.find_one({'userId': self.user_id})

        if wishlist:
            products = wishlist.get('products', [])

            for product in products:
                if product == self.product_id:
                    products.remove(product)
                    db.wishlist.update_one(
                        {'userId': self.user_id},
                        {'$set': {'products': products}}
                    )
                    return jsonify({'message': 'Product removed from wishlist'}), 200
        return jsonify({'message': 'Product not found'}), 404
    
    def get_wish_list(self):
        wishlist = db.wishlist.find_one({'userId': self.user_id})

        if wishlist:
            return jsonify({'wishlist': wishlist}), 200
        return jsonify({'wishlist': []}), 404