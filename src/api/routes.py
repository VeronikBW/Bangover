"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, admin_required
from flask_cors import CORS
from api.models import User, Activity, Favorite, roleUser, statusUser, categoryActivity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import cloudinary.uploader as uploader
from base64 import b64encode
import os
from datetime import timedelta

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
def register_user():

    data_form = request.form
    data_files = request.files

    name = data_form.get('name')
    nickname = data_form.get('nickname')
    password = data_form.get('password')
    avatar_db = data_files.get('avatar')

    if not all([name, nickname, password]):
        return jsonify({"error": "Missing required fields"}), 400
    
    user_exists = User.query.filter_by(nickname=nickname).first()

    if user_exists:
        return jsonify({"error": "Nickname already exists"}), 400
    
    salt = b64encode(os.urandom(32)).decode('utf-8')
    hashed_password = generate_password_hash(password + salt)

    avatar = "https://i.pravatar.cc/300"

    if avatar_db is not None:
        avatar = uploader.upload(avatar_db)
        avatar = avatar["secure_url"]

    rol = "USER"
    if nickname == "Saret" or nickname == "Andrew":
        rol = "ADMIN"

    new_user = User(
        name=name,
        nickname=nickname,
        password=hashed_password,
        avatar=avatar,
        status="ACTIVE",
        role=rol
    )

    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "Error": f"{e.args}"}), 500
    


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

@api.route('/login', methods=['POST'])
def login():
    data_form = request.form

    nickname = data_form.get('nickname')
    password = data_form.get('password').strip()
    if not all([nickname, password]):
        return jsonify({"error": "Missing required fields"}), 400

    user = User.query.filter_by(nickname=nickname).first()
    if not user:
        return jsonify({"error": "Invalid nickname or password"}), 401
    
    password_valid = f"{password}{user.salt}"
    if not check_password_hash(user.password, password_valid):
        return jsonify({"error": "Invalid nickname or password"}), 401
    
    if user.status != "ACTIVE":
        return jsonify({"error": "User account is not active"}), 403
    
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=1)
    )

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"error": "User not found"}), 404


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
@jwt_required()
@admin_required
def create_activity():
    try:
        data_form = request.form
        data_files = request.files

        data = {
            "name": data_form.get('name'),
            "category": data_form.get('category'),
            "description": data_form.get('description'),
            "code": data_form.get('code'),
            "image_db": data_files.get('image'),
            }
        
        image = ""

        if data.get("image_db") is not None:
            image = uploader.upload(data.get("image_db"))
            image = image["secure_url"]

        new_activity = Activity(
            name=data.get('name'),
            category=data.get('category'),
            description=data.get('description'),
            code=data.get('code'),
            image=image
        )

        db.session.add(new_activity)

        db.session.commit()
        return jsonify({"message": "Activity created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating activity", "Error": f"{e.args}"}), 500

@api.route('/activities/<int:activity_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_activity(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return jsonify({"error": "Activity not found"}), 404

    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted successfully"}), 200

@api.route('/activities/<int:activity_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_activity(activity_id):
    try:
        activity = Activity.query.get(activity_id)
        if not activity:
            return jsonify({"error": "Activity not found"}), 404

        data_form = request.form
        data_files = request.files

        if data_form.get('name'):
            activity.name = data_form.get('name')

        if data_form.get('category'):
            activity.category = categoryActivity[data_form.get('category')] 
        
        if data_form.get('description'):
            activity.description = data_form.get('description')

        if data_form.get('code'):
            activity.code = data_form.get('code')

        image_db = data_files.get('image')
        if image_db is not None:
            image = uploader.upload(image_db)
            activity.image = image["secure_url"]
        
        db.session.commit()
        return jsonify({"message": "Activity updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating activity", "Error": f"{e.args}"}), 500

# FAVORITES

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = get_jwt_identity()

    favorites = Favorite.query.filter_by(user_id=current_user_id).all()
    favorites_list = [favorite.serialize() for favorite in favorites]

    return jsonify({"favorites": favorites_list}), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user_id = get_jwt_identity()
    
    activity = Activity.query.get('activity_id')

    if not activity:
        return jsonify({"error": "Activity not found"}), 404
    
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user_id,
        activity_id=activity.id
        ).first()
    
    if existing_favorite:
        return jsonify({"error": "Activity already in favorites"}), 409
    
    new_favorite = Favorite(
        user_id=current_user_id,
        activity_id=activity.id
    )

    db.session.add(new_favorite)

    try:
        db.session.commit()
        return jsonify({"message": "Favorite added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error adding favorite", "Error": f"{e.args}"}), 500



@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(favorite_id):
    current_user_id = get_jwt_identity()

    favorite = Favorite.query.filter_by(
        id=favorite_id, 
        user_id=current_user_id
        ).first()

    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404
    
    db.session.delete(favorite)

    try:
        db.session.commit()
        return jsonify({"message": "Favorite removed successfully"}), 200   
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error removing favorite", "Error": f"{e.args}"}), 500
    


    