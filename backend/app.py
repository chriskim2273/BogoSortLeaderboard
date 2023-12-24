import json
import os
import re
from functools import wraps

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials
from flask import Flask, jsonify, request

from flask_cors import CORS, cross_origin


from queryHandler import ConnectToMySQL

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

queryHandler = ConnectToMySQL()
queryHandler.get_all_scores()

# Load Firebase service account credentials
cred = credentials.Certificate('serviceAccountKey.json')

# Initialize the Firebase Admin SDK with the credentials and an app name
default_app = firebase_admin.initialize_app(cred)

def authenticate_request(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        id_token = request.headers.get('Authorization')  # Get ID token from request header
        request_body = None
        try:
            request_body = request.json
        except Exception as e:
            return jsonify({'error': "Please provide valid JSON for body Data."}), 400

        uid_token = request_body.get("user_id")
        if not uid_token:
            return jsonify({'error': "User uid missing."}), 401
        
        if id_token:
            try:
                decoded_token = auth.verify_id_token(id_token)
                uid = decoded_token['uid']
                if uid != uid_token:
                    return jsonify({'error': 'User ID provided in Body does not match User ID associated with accessToken provided.'}), 401
                # Perform additional checks or actions based on the verified user's UID
                # ...
                return func(*args, **kwargs)  # Proceed with the API request
            except auth.InvalidIdTokenError as e:
                return jsonify({'error': 'Invalid ID token: ' + id_token}), 401
        else:
            return jsonify({'error': 'Authorization header missing'}), 401
    
    return wrapper

@app.route("/createNewUser", methods=['POST'])
@authenticate_request
def createNewUser():
    request_body = None
    try:
        request_body = request.json
    except Exception as _:
        return {'status': False, "message": "Please provide proper request body."}, 400

    user_id = request_body.get("user_id")
    email = request_body.get("email")
    display_name = request_body.get("display_name")
    if not email or not user_id or not display_name:
        return {'status': False, "message": "Please provide proper request body."}, 400
    
    response = queryHandler.create_new_user(user_id, display_name, email)
    return response
    
@app.route("/uploadScore", methods=['POST'])
def uploadScore():
    request_body = None
    try:
        request_body = request.json
    except Exception as _:
        return {'status': False, "message": "Please provide proper request body."}, 400

    user_id = request_body.get("user_id")
    score = request_body.get("score")
    amount_of_elements = request_body.get("amount_of_elements")
    if not score or not user_id or not amount_of_elements:
        return {'status': False, "message": "Please provide proper request body."}, 400
    
    response = queryHandler.upload_score(user_id, score, amount_of_elements)
    return response

@app.route("/getAllUserScoresById", methods=['GET'])
def getAllUserScoresById():
    request_body = None
    try:
        request_body = request.json
    except Exception as _:
        return {'status': False, "message": "Please provide proper request body."}, 400

    user_id = request_body.get("user_id")
    if not user_id:
        return {'status': False, "message": "Please provide proper request body."}, 400
    
    response = queryHandler.get_user_scores(user_id=user_id)
    return response

@app.route("/getAllUserScoresByEmail", methods=['GET'])
def getAllUserScoresByEmail():
    request_body = None
    try:
        request_body = request.json
    except Exception as _:
        return {'status': False, "message": "Please provide proper request body."}, 400

    email = request_body.get("email")
    if not email:
        return {'status': False, "message": "Please provide proper request body."}, 400
    
    response = queryHandler.get_user_scores(email=email)
    return response

@app.route("/getBestScores", methods=['GET'])
def getBestScores():
    amount_of_elements = request.args.get('amount_of_elements')
    if not amount_of_elements:
        return {'status': False, "message": "Please provide the amount of elements to find the best scores for."}, 400
    
    response = queryHandler.get_best_scores(amount_of_elements)
    return response
# TODO: Delete scores, get all user scores, get best scores for each amount, search others


"""
@app.route("/")
def hello_world():
    data_to_upload = {
        'creater_user_id': 'id',
        'date_created': "timestamp",
        'likes': 0,
        'dislikes': 0,
        'split_id': 'split_id',
        'split_name': 'name',
        'split_data': [
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []},
            {'day_name': '', 'exercises': []}
        ]
    }

    # Insert the document into the collection
    result = UserSplitCollection.insert_one(data_to_upload)
    # Print the _id of the new document
    print("Inserted document with _id:", result.inserted_id)
    return("Inserted document with _id: " + str(result.inserted_id))

@app.route('/registerNewUser', methods=['POST'])
@authenticate_request
def register_new_user():
    request_body = None
    try:
        request_body = request.json
    except Exception as e:
        return {"error": "Please provide proper Split Data."}, 400

    user_id = request_body.get("user_id", "")
    email = request_body.get("email")
    if not email:
        return jsonify("Please provide email in request body."), 400

    new_user_data_template = {
        'user_id': user_id,
        'email': email,
        'date_registered': 'timestamp',
        'published_splits': [],
        'favorited_splits': [],
        'collections': [],
        'favorite_exercises': [],
        'user_splits': []
    }

    result = UserSplitCollection.insert_one(new_user_data_template)
    print(result)
    return {}


@app.route('/set_split', methods=['POST'])
@authenticate_request
def set_split():
    request_body = None
    try:
        request_body = request.json
    except Exception as e:
        return {"error": "Please provide proper Split Data."}, 400

    split_data = request_body.get("split_data", {})
    user_id = request_body.get("user_id", "")
    split_id = request_body.get("split_id", "")
    split_name = request_body.get("split_name", "")

    #print(split_data, user_id, split_id, split_name)

    existing_document = UserSplitCollection.find_one_and_update(
        {"user_id": user_id,
        "split_id": split_id},
        {'$set': split_data},
        upsert=True,  # Create the document if it doesn't exist
        return_document=True  # Return the updated/found document
    )

    print(existing_document)

    if existing_document:
        # Convert ObjectId to string for serialization
        existing_document['_id'] = str(existing_document['_id'])

        # Serialize the document to JSON
        json_document = json.dumps(existing_document)
        print("Document found/updated:")
        print(json_document)
    else:
        print("New document created.")
        #print(split_data)
    return existing_document


@app.route('/set_multiple_splits', methods=['POST'])
@authenticate_request
def set_multiple_splits():
    request_body = None
    try:
        request_body = request.json
    except Exception as e:
        return {"error": "Please provide proper Split Data."}, 400

    all_splits = request_body.get("all_splits", {})
    user_id = request_body.get("user_id", "")

    for split in all_splits:
        # Maybe change to use the MongoDB ID.
        split_id = split["split_id"]
        
        existing_document = UserSplitCollection.find_one_and_update(
            {"user_id": user_id,
            "split_id": split_id},
            {'$set': split},
            upsert=True,  # Create the document if it doesn't exist
            return_document=True  # Return the updated/found document
        )
        if existing_document:
            # Convert ObjectId to string for serialization
            existing_document['_id'] = str(existing_document['_id'])

            # Serialize the document to JSON
            json_document = json.dumps(existing_document)
            print("Document found/updated:")
            print(json_document)
        else:
            print("New document created.")
            
    return jsonify({'result': 'Set all splits successfully.'}), 200
"""
@app.route('/', methods=('GET', 'POST'))
def index():
    return "Index"