from flask import Flask, jsonify, render_template, request
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, template_folder="../templates", static_folder="../static")

# MongoDB Configuration
mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI is not set in the .env file.")

client = MongoClient(mongo_uri)
db = client["bakedbyaisha"]  # Database
products_collection = db["products"]  # Collection

# Serve the static HTML pages
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

@app.route("/manage")
def manage():
    return render_template("manage_products.html")

# API to get all products
@app.route("/api/products", methods=["GET"])
def get_products():
    products = list(
        products_collection.find(
            {}, {"_id": 1, "name": 1, "price": 1, "images": 1, "category": 1, "size": 1, "description": 1}
        )
    )
    for product in products:
        product["_id"] = str(product["_id"])  # Convert ObjectId to string
    return jsonify(products)

# API to add a new product
@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.json
    new_product = {
        "name": data["name"],
        "price": data["price"],
        "images": data["images"],
        "category": data["category"],
        "size": data["size"],
        "description": data["description"],
    }
    result = products_collection.insert_one(new_product)
    return jsonify({"_id": str(result.inserted_id)}), 201

# API to delete a product
@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    result = products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Product deleted successfully"}), 200
    return jsonify({"message": "Product not found"}), 404

# API to update a product
@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    update_data = {
        "name": data.get("name"),
        "price": data.get("price"),
        "images": data.get("images"),
        "category": data.get("category"),
        "size": data.get("size"),
        "description": data.get("description"),
    }
    result = products_collection.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    if result.matched_count > 0:
        return jsonify({"message": "Product updated successfully"}), 200
    return jsonify({"message": "Product not found"}), 404

# Ensure the app runs correctly on Cloud Run or locally
if __name__ == "__main__":
    # Use the PORT environment variable or default to 8080
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
