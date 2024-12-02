const Product = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    // Fetch products from the backend API
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="container-xxl bg-light my-6 py-6 pt-0">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "500px" }}>
          <p className="text-primary text-uppercase mb-2">// Bakery Products</p>
          <h1 className="display-6 mb-4">Explore The Categories Of Our Bakery Products</h1>
        </div>
        <div className="row g-4">
          {/* Render Product Cards from the database */}
          {products.map((product) => (
            <div className="col-lg-4 col-md-6" key={product._id}>
              <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                <div className="text-center p-4">
                  <div className="d-inline-block border border-primary rounded-pill px-3 mb-3">
                    {product.price}
                  </div>
                  <h3 className="mb-3">{product.name}</h3>
                  <span>Category: {product.category}</span>
                  <br />
                  <span>Size: {product.size}</span>
                </div>
                <div className="position-relative mt-auto">
                  <img
                    className="img-fluid"
                    src={`/static/img/${product.images}.jpg`} // Adjust path based on your static folder setup
                    alt={product.name}
                  />
                  <div className="product-overlay">
                    <a className="btn btn-lg-square btn-outline-light rounded-circle" href="#">
                      <i className="fa fa-eye text-primary"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mount the React Component
document.addEventListener("DOMContentLoaded", () => {
  const productRoot = document.getElementById("product");
  if (productRoot) {
    console.log("Found #product, rendering React component...");
    ReactDOM.createRoot(productRoot).render(<Product />);
  } else {
    console.error("No #product div found in the DOM.");
  }
});
