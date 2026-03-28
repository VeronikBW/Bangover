"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import User, Activity

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

