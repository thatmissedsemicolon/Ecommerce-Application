from decimal import Decimal, ROUND_HALF_UP
from bson import SON
from .. import jsonify, db

class Dashboard:
    def __init__(self, user_id, user_is_admin):
        self.user_id = user_id
        self.user_is_admin = user_is_admin

    def get_dashboard_data(self):
        return jsonify({
            'total_fulfilled_orders': self.get_number_of_fulfilled_orders(),
            'total_cancelled_orders': self.get_number_of_cancelled_orders(),
            'total_revenue': self.get_total_revenue(),
            'total_active_users': self.get_number_of_active_users(),
            'sales': self.get_sales(),
        }), 200

    def get_number_of_active_users(self):
        users = db.users.count_documents({'user_account_is_active': True})
        return users
    
    def get_total_revenue(self):
        orders = db.orders.find({'status': 'Fulfilled'})
        total_revenue = 0
        for order in orders:
            total_revenue += order['total']
        return float(Decimal(total_revenue).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP))
    
    def get_number_of_fulfilled_orders(self):
        orders = db.orders.count_documents({'status': 'Fulfilled'})
        return orders
    
    def get_number_of_cancelled_orders(self):
        orders = db.orders.count_documents({'status': 'Cancelled'})
        return orders

    def get_sales(self):
        orders_count = db.orders.count_documents({'status': 'Fulfilled'})
        if orders_count == 0:
            return []

        # Aggregation pipeline
        pipeline = [
            {'$match': {'status': 'Fulfilled'}},
            {'$project': {
                'formatted_date': {
                    '$dateFromString': {
                        'dateString': '$date',
                        'format': "%Y-%m-%dT%H:%M:%S.%LZ"
                    }
                },
                'total': 1
            }},
            {'$project': {
                'month': {'$dateToString': {'format': "%Y-%m", 'date': "$formatted_date"}},
                'total': 1
            }},
            {'$group': {
                '_id': '$month',
                'total_sales': {'$sum': '$total'}
            }},
            {'$sort': SON([('_id', 1)])} 
        ]

        aggregated_sales = db.orders.aggregate(pipeline)

        sales_data = []
        for month_data in aggregated_sales:
            sales_data.append({
                'year_month': month_data['_id'],
                'total_sales': month_data['total_sales']
            })

        return sales_data
