from flask import Flask, jsonify, render_template
from asgiref.wsgi import WsgiToAsgi
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# MongoDB Configuration
mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI is not set in the .env file.")

client = MongoClient(mongo_uri)
db = client["bakedbyaisha"]  # Database
products_collection = db["products"]  # Collection

# Serve the static HTML
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/products")
def product():
    return render_template("product.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

# API to get products from MongoDB
@app.route("/api/products", methods=["GET"])
def get_products():
    products = list(products_collection.find({}, {"_id": 1, "name": 1, "price": 1, "images": 1, "category": 1, "size": 1}))
    # Convert ObjectId to string for JSON compatibility
    for product in products:
        product["_id"] = str(product["_id"])
    return jsonify(products)


asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run(debug=True)