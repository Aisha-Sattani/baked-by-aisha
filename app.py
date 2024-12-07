from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# MongoDB Configuration
mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI is not set in the .env file.")

client = MongoClient(mongo_uri)
db = client["bakedbyaisha"]  # Database
products_collection = db["products"]  # Collection

# Allow CORS for frontend requests (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the static HTML pages
@app.get("/", response_class=HTMLResponse)
async def home():
    return Path("templates/index.html").read_text()

@app.get("/products", response_class=HTMLResponse)
async def products():
    return Path("templates/product.html").read_text()

@app.get("/about", response_class=HTMLResponse)
async def about():
    return Path("templates/about.html").read_text()

@app.get("/contact", response_class=HTMLResponse)
async def contact():
    return Path("templates/contact.html").read_text()

@app.get("/manage", response_class=HTMLResponse)
async def manage():
    return Path("templates/manage_products.html").read_text()

# API to get all products
@app.get("/api/products")
async def get_products():
    products = list(
        products_collection.find(
            {}, {"_id": 1, "name": 1, "price": 1, "images": 1, "category": 1, "size": 1, "description": 1}
        )
    )
    for product in products:
        product["_id"] = str(product["_id"])  # Convert ObjectId to string
    return products

# API to add a new product
@app.post("/api/products", status_code=201)
async def add_product(request: Request):
    data = await request.json()
    new_product = {
        "name": data["name"],
        "price": data["price"],
        "images": data["images"],
        "category": data["category"],
        "size": data["size"],
        "description": data["description"],
    }
    result = products_collection.insert_one(new_product)
    return {"_id": str(result.inserted_id)}

# API to delete a product
@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    result = products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count > 0:
        return {"message": "Product deleted successfully"}
    raise HTTPException(status_code=404, detail="Product not found")

# API to update a product
@app.put("/api/products/{product_id}")
async def update_product(product_id: str, request: Request):
    data = await request.json()
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
        return {"message": "Product updated successfully"}
    raise HTTPException(status_code=404, detail="Product not found")
