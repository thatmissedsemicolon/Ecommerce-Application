import uuid
import math
import re
from decimal import Decimal, ROUND_HALF_UP
from .. import Response, json, jsonify, db, redis_client

class Product:
    def __init__(self, product={}, category=None, productId=None) -> None:
        self.product = product
        self.category = category
        self.productId = productId

        if '_id' not in self.product:
            self.product['_id'] = str(uuid.uuid4())

    def add_product(self) -> Response:
        added_product = db.products.insert_one(self.product)
        if added_product:
            return jsonify({'message': 'Product added!'}), 200 
        return jsonify({'message': 'Something went wrong...'}), 500
    
    def get_product_details(product_id):
        product = db.products.find_one({'_id': product_id})
        return product if product else None

    def get_product(self, page, limit=10) -> Response:
        if self.productId:
            return self.get_single_product(page, limit=7)
        return self.get_product_category_list(page, limit)

    def get_single_product(self, page, limit=2):
        redis_key = self.generate_redis_key(self.productId, page, limit)

        cached_product = self.get_cached_products(redis_key)
        if cached_product:
            return self.create_response(cached_product)

        product = db.products.find_one({'_id': self.productId})
        if product:
            reviews = product.get('reviews', [])

            sorted_reviews = sorted(reviews, key=lambda r: r.get('rating', 0), reverse=True)

            if sorted_reviews:
                total_ratings = sum(Decimal(review.get('rating', 0)) for review in sorted_reviews)
                average_rating = (total_ratings / Decimal(len(sorted_reviews))).quantize(Decimal('0.0'), rounding=ROUND_HALF_UP)
            else:
                average_rating = Decimal(0)

            start_index = (page - 1) * limit
            end_index = start_index + limit
            paginated_reviews = sorted_reviews[start_index:end_index]

            next_page_available = len(sorted_reviews) > end_index

            serialized_product = json.dumps({
                **product,
                'reviews': paginated_reviews,
                'average_rating': float(average_rating),
                'next_page_available': next_page_available
            }, indent=2)

            redis_client.setex(redis_key, 60, serialized_product)
            return self.create_response(serialized_product)
        return jsonify({'message': 'Product not found'}), 404

    def get_product_category_list(self, page, limit):
        redis_key = self.generate_redis_key(self.category, page, limit)
        cached_products = self.get_cached_products(redis_key)

        if cached_products:
            return self.create_response(cached_products)

        products_list, next_page_available = self.query_products(page, limit)
        if products_list:
            for product in products_list:
                reviews = product.get('reviews', [])
                if reviews:
                    total_ratings = sum(Decimal(review.get('rating', 0)) for review in reviews)
                    average_rating = (total_ratings / Decimal(len(reviews))).quantize(Decimal('0.0'), rounding=ROUND_HALF_UP)
                    product['average_rating'] = float(average_rating)
                else:
                    product['average_rating'] = 0.0

            response_data = {
                'data': products_list,
                'next_page_available': next_page_available
            }
            redis_client.setex(redis_key, 300, json.dumps(response_data))
            return self.create_response(response_data)

        return jsonify({'message': 'No products found'}), 404

    def get_cached_products(self, key):
        cached_data = redis_client.get(key)
        if cached_data:
            return cached_data.decode('utf-8')
        return None

    def query_products(self, page, limit):
        skip = (page - 1) * limit
        query = {'category': self.category} if self.category else {}
        product_cursor = db.products.find(query).skip(skip).limit(limit + 1)
        products_list = list(product_cursor)

        next_page_available = len(products_list) > limit
        if next_page_available:
            products_list = products_list[:-1]

        return products_list, next_page_available

    def generate_redis_key(self, key, page, limit):
        return f"products:{key}:{page}:{limit}"

    def create_response(self, data, status=200):
        if isinstance(data, dict):
            data = json.dumps(data, indent=2)
        return Response(data, mimetype='application/json', status=status)
    
    def add_product_review(self, review_data):
        product = None

        if self.productId:
            product = db.products.find_one({'_id': self.productId})  

        if product:
            db.products.update_one(
               {'_id': review_data.get('productId')},
               {'$push': {'reviews': review_data}},
            )

            return jsonify({'success': 'Review added'}), 200
        else:
            return jsonify({'message': 'Something went wrong...'}), 400
        
    def get_all_products(self, search_term, page, limit=10):
        skip = limit * (page - 1)

        search_query = {}

        if search_term:
            regex_pattern = re.compile(f'.*{re.escape(search_term)}.*', re.IGNORECASE)

            try:
                number_search = int(search_term)
                price_query = {"price": number_search}
                stock_query = {"stock": number_search}
            except ValueError:
                price_query = {}
                stock_query = {}

            search_query = {
                "$or": [
                    {"title": regex_pattern},
                    {"description": regex_pattern},
                    {"brand": regex_pattern},
                    {"category": regex_pattern},
                    price_query,
                    stock_query
                ]
            }

            search_query["$or"] = [condition for condition in search_query["$or"] if condition]

        products = db.products.find(search_query).skip(skip).limit(limit)

        products_list = list(products)

        total_count = db.products.count_documents(search_query)

        total_pages = math.ceil(total_count / limit)

        return jsonify({'products': products_list, 'total_pages': total_pages}), 200
    
    def update_product(self):
        product = db.products.find_one({'_id': self.productId})

        if product:
            db.products.update_one(
                {'_id': self.productId},
                {'$set': self.product}
            )

            return jsonify({'success': 'Product updated'}), 200
        else:
            return jsonify({'message': 'Something went wrong...'}), 400
        
    def delete_product(self):
        product = db.products.find_one({'_id': self.productId})

        if product:
            db.products.delete_one({'_id': self.productId})

            return jsonify({'success': 'Product deleted'}), 200
        else:
            return jsonify({'message': 'Something went wrong...'}), 400
