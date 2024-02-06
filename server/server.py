"""
This module sets up a Flask web application with Flask-SocketIO for real-time communication.
It includes a MongoDB watcher for order updates and socket events for order management.
"""

import os
from threading import Thread
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo.errors import PyMongoError
from socketio.exceptions import ConnectionError as SocketIOConnectionError
from app.routes.routes import routes
from app import db
from app.order.order import Order
from app.user.user import User

app = Flask(__name__, static_folder='dist')
CORS(app, origins=['http://localhost:8000'])
socketio = SocketIO(app, cors_allowed_origins="http://localhost:8000")

app.register_blueprint(routes)

GLOBAL_USER_ID = None
GLOBAL_ORDER_ID = None
GLOBAL_PAGE = None

def watch_orders_update():
    global GLOBAL_USER_ID, GLOBAL_ORDER_ID
    try:
        with db.orders.watch() as stream:
            for change in stream:
                if change['operationType'] == 'update':
                    updated_document_id = change['documentKey']['_id']
                    if updated_document_id == GLOBAL_ORDER_ID:
                        updated_document = Order.get_order_updates({'userId': GLOBAL_USER_ID, 'orderId': updated_document_id})
                        if updated_document.get('userId') == GLOBAL_USER_ID or User.user_is_admin(userId = GLOBAL_USER_ID):
                            socketio.emit('order_updated', updated_document)
    except PyMongoError as e:
        print(f"MongoDB error: {e}")

def watch_new_orders():
    try:
        with db.orders.watch() as stream:
            for change in stream:
                if change['operationType'] == 'insert':
                    orders_data = Order.get_all_orders(search_term=None, page=GLOBAL_PAGE)
                    socketio.emit('orders', orders_data)
    except PyMongoError as e:
        print(f"MongoDB error: {e}")

@socketio.on('connect')
def handle_connect():
    """Handles client connection events."""
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    """Handles client disconnection events."""
    print('Client disconnected')

@socketio.on('get_order_details')
def handle_get_order_details(data):
    """
    Handles requests for order details and emits the order details back to the client.
    """
    try:
        global GLOBAL_USER_ID, GLOBAL_ORDER_ID
        GLOBAL_USER_ID = data.get('userId', None)
        GLOBAL_ORDER_ID = data.get('orderId', None)
        order = Order.get_order_updates(data)
        socketio.emit('order_details', order)
    except PyMongoError as e:
        print(f"MongoDB error retrieving order details: {e}")
    except SocketIOConnectionError as e:
        print(f"SocketIO connection error: {e}")

@socketio.on('get_orders')
def handle_get_orders(data):
    """
    Handles requests for order details and emits the order details back to the client.
    """
    try:
        global GLOBAL_PAGE
        GLOBAL_PAGE = data.get('page', None)
        search_term = data.get('searchTerm', None)
        order = Order.get_all_orders(search_term=search_term, page=GLOBAL_PAGE)
        socketio.emit('orders', order)
    except PyMongoError as e:
        print(f"MongoDB error retrieving order details: {e}")
    except SocketIOConnectionError as e:
        print(f"SocketIO connection error: {e}")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serves the static files from the dist directory.
    """

    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
def start_threads():
    watch_orders_update_thread = Thread(target=watch_orders_update)
    watch_new_orders_thread = Thread(target=watch_new_orders)

    watch_orders_update_thread.start()
    watch_new_orders_thread.start()

start_threads()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='localhost', port=8000)
