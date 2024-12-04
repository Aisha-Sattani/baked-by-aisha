# Baked By Aisha

"Baked by Aisha" is a web application designed to showcase and manage a bakery's product offerings. Built with **Flask**, it serves static HTML pages, provides an API endpoint to fetch product data from a MongoDB collection, and includes a management page for adding, editing, and deleting products.

---

## Features

### Static Pages:
- **`index.html`**: Homepage showcasing highlights of the bakery.
- **`about.html`**: Information about the bakery.
- **`product.html`**: Displays a list of products.
- **`contact.html`**: Contact information and inquiry form.
- **`manage-product.html`**: A page for managing products in the database.

### Database Integration:
- Uses MongoDB to store product details:
  - **Fields for each product**:
    - `name`: Name of the product.
    - `price`: Price of the product.
    - `images`: URLs of product images.
    - `category`: Category of the product (default is `"cakes"`).
    - `size`: Size of the product (e.g., "small", "medium", "large").
    - `description`: A detailed description of the product.

### API Endpoint:
- **`/api/products`**: Fetches all product details from the MongoDB collection in JSON format.

  
## Prerequisites

Ensure the following are installed:

- **Python 3.8** or later
- **Pip** (Python package manager)
- **MongoDB** (local or cloud instance)
- **Git** (for cloning the repository)

## Installation and Setup

Follow these steps to set up and run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Aisha-Sattani/baked-by-aisha.git
cd baked-by-aisha
```

### 2. Set Up a Virtual Environment
Create and activate a virtual environment to manage dependencies.

**On Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
Install the required Python packages:
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```
Replace `<username>`, `<password>`, and `<dbname>` with your MongoDB credentials.

### 5. Run the Application
Start the Flask development server:
```bash
python app.py
```
The application will be accessible at `http://127.0.0.1:5000`.

## Project Structure

```
baked-by-aisha/
├── static/                 # Static assets (CSS, JS, images)
├── templates/              # HTML templates
│   ├── index.html
│   ├── about.html
│   ├── product.html
│   ├── contact.html
│   └── manage-product.html
├── .gitignore              # Git ignore file
├── LICENSE.txt             # License information
├── README.md               # Project README
├── app.py                  # Main application script
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (not included in the repo)
```


## API Documentation

### GET `/api/products`
Fetches all products from the MongoDB `products` collection.

**Response Example**:
```json
[
    {
        "name": "Chocolate Cake",
        "price": "15.99",
        "images": ["image1.jpg", "image2.jpg"],
        "category": "cakes",
        "size": "medium",
        "description": "Delicious and moist chocolate cake."
    },
    {
        "name": "Vanilla Cupcake",
        "price": "3.99",
        "images": ["image3.jpg"],
        "category": "cupcakes",
        "size": "small",
        "description": "Classic vanilla cupcake with buttercream frosting."
    }
]
```

## Product Management

The **`/manage`** page allows you to manage the products in the database. To access it:
1. Open your browser and navigate to `http://127.0.0.1:5000/manage`.
2. Use the interface to:
   - Add new products by filling out the form.
   - Edit existing products directly.
   - Delete products from the database.


## Next Phase of Development

In the next phase of development, the following features will be implemented:

1. **Website Deployment**:
   - The website will be deployed to **bakedbyaisha.com**, a domain already owned.
   - A production-grade hosting solution will be used to make the site accessible online.

2. **Order Form**:
   - An order form will be added, allowing customers to place orders directly from the website.
   - Orders will be stored in a database for processing.

3. **Contact Us Functionality**:
   - The contact form on the **Contact Us** page will be fully functional.
   - It will send inquiries directly to the bakery’s email.

These additions will enhance the functionality of the website and improve user experience, making it a complete solution for online bakery management.

## Troubleshooting

1. **MongoDB Connection Errors**:
   - Ensure the `MONGODB_URI` in the `.env` file is correct.
   - Verify that your MongoDB instance is running and accessible.

2. **Static Files Not Loading**:
   - Confirm that the `static/` and `templates/` directories are correctly placed relative to `app.py`.

3. **Accessing the Manage Page**:
   - If the `/manage` page doesn't load, check if the `manage-product.html` template exists in the `templates/` directory.


## License

This project is licensed under the MIT License. See `LICENSE.txt` for details.

---

For questions or support, please open an issue in this repository.

--- 
