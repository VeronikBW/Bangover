"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import User, Activity, Favorite

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body)

@api.route('/health-check', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"}), 200

# USERS

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200

@api.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        name=data['name'],
        nickname=data['nickname'],
        password=data['password'],
        avatar=data.get('avatar'),
        status=data.get('status', 'ACTIVE'),
        role=data.get('role', 'USER')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"error": "User not found"}), 404

@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    user.name = data.get('name', user.name)
    user.nickname = data.get('nickname', user.nickname)
    user.password = data.get('password', user.password)
    user.avatar = data.get('avatar', user.avatar)
    user.status = data.get('status', user.status)
    user.role = data.get('role', user.role)

    db.session.commit()
    return jsonify(user.serialize()), 200

#ACTIVITIES

@api.route('/activities', methods=['GET'])
def get_activities():
    activities = Activity.query.all()
    activities_list = [activity.serialize() for activity in activities]
    return jsonify(activities_list), 200

@api.route('/activities/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if activity:
        return jsonify(activity.serialize()), 200
    else:
        return jsonify({"error": "Activity not found"}), 404
    
@api.route('/activities', methods=['POST'])
def add_activity():
    data = request.get_json()
    new_activity = Activity(
        name=data['name'],
        category=data['category'],
        description=data.get('description'),
        image=data.get('image'),
        code=data['code']
    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.serialize()), 201

@api.route('/activities/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"error": "Activity not found"}), 404

    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted successfully"}), 200

@api.route('/activities/<int:activity_id>', methods=['PUT'])
def update_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"error": "Activity not found"}), 404

    data = request.get_json()
    activity.name = data.get('name', activity.name)
    activity.category = data.get('category', activity.category)
    activity.description = data.get('description', activity.description)
    activity.image = data.get('image', activity.image)
    activity.code = data.get('code', activity.code)

    db.session.commit()
    return jsonify(activity.serialize()), 200

# FAVORITES

@api.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.all()
    favorites_list = [favorite.serialize() for favorite in favorites]
    return jsonify(favorites_list), 200

@api.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    new_favorite = Favorite(
        user_id=data['user_id'],
        activity_id=data['activity_id']
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201

@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = Favorite.query.get(favorite_id)
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite deleted successfully"}), 200
