const Product = () => {
  const [products, setProducts] = React.useState([]);
  const [modalProduct, setModalProduct] = React.useState(null); // Product details for the modal

  React.useEffect(() => {
    // Fetch products from the backend API
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  // Filter products by category
  const filterByCategory = (category) =>
    products.filter((product) => product.category === category);

  return (
    <div className="container-xxl bg-light my-6 py-6 pt-0">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "500px" }}>
          <p className="text-primary text-uppercase mb-2">Bakery Products</p>
          <h1 className="display-6 mb-4">Explore The Categories Of Our Bakery Products</h1>
        </div>

        {/* Section for Cakes */}
        <div className="mb-5">
          <h2 className="text-primary text-center mb-4">Cakes</h2>
          <div className="row g-4">
            {filterByCategory("cakes").map((product) => (
              <div className="col-lg-4 col-md-6" key={product._id}>
                <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                  <div className="text-center p-4">
                    <div className="d-inline-block border border-primary rounded-pill px-3 mb-3">
                      {product.price}
                    </div>
                    <h3 className="mb-3">{product.name}</h3>
                    <span>Size: {product.size}</span>
                  </div>
                  <div className="position-relative mt-auto">
                    <img
                      className="img-fluid"
                      src={`/static/img/${product.images.split(",")[0]}`} // Use the first image for the product card
                      alt={product.name}
                    />
                    <div className="product-overlay">
                      <button
                        className="btn btn-lg-square btn-outline-light rounded-circle"
                        onClick={() => openModal(product)}
                      >
                        <i className="fa fa-eye text-primary"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section for Cupcakes */}
        <div className="mb-5">
          <h2 className="text-primary text-center mb-4">Cupcakes</h2>
          <div className="row g-4">
            {filterByCategory("cupcakes").map((product) => (
              <div className="col-lg-4 col-md-6" key={product._id}>
                <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                  <div className="text-center p-4">
                    <div className="d-inline-block border border-primary rounded-pill px-3 mb-3">
                      {product.price}
                    </div>
                    <h3 className="mb-3">{product.name}</h3>
                    <span>Size: {product.size}</span>
                  </div>
                  <div className="position-relative mt-auto">
                    <img
                      className="img-fluid"
                      src={`/static/img/${product.images.split(",")[0]}`} // Use the first image for the product card
                      alt={product.name}
                    />
                    <div className="product-overlay">
                      <button
                        className="btn btn-lg-square btn-outline-light rounded-circle"
                        onClick={() => openModal(product)}
                      >
                        <i className="fa fa-eye text-primary"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section for Cookies */}
        <div className="mb-5">
          <h2 className="text-primary text-center mb-4">Cookies</h2>
          <div className="row g-4">
            {filterByCategory("cookies").map((product) => (
              <div className="col-lg-4 col-md-6" key={product._id}>
                <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                  <div className="text-center p-4">
                    <div className="d-inline-block border border-primary rounded-pill px-3 mb-3">
                      {product.price}
                    </div>
                    <h3 className="mb-3">{product.name}</h3>
                    <span>Size: {product.size}</span>
                  </div>
                  <div className="position-relative mt-auto">
                    <img
                      className="img-fluid"
                      src={`/static/img/${product.images.split(",")[0]}`} // Use the first image for the product card
                      alt={product.name}
                    />
                    <div className="product-overlay">
                      <button
                        className="btn btn-lg-square btn-outline-light rounded-circle"
                        onClick={() => openModal(product)}
                      >
                        <i className="fa fa-eye text-primary"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalProduct && (
          <div
            className="modal d-flex align-items-center justify-content-center"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 1050,
            }}
          >
            <div
              className="modal-content bg-white p-4"
              style={{
                width: "90%",
                maxWidth: "800px",
                maxHeight: "90%",
                overflowY: "auto",
                borderRadius: "10px",
              }}
            >
              <button
                onClick={closeModal}
                className="btn-close"
                style={{ position: "absolute", top: "10px", right: "10px" }}
              ></button>
              <h3 className="text-center mb-2">{modalProduct.name}</h3>
              <p className="text-center mb-4 text-muted">{modalProduct.description}</p>
              <div className="row g-3">
                {modalProduct.images.split(",").map((image, index) => (
                  <div className="col-6 col-md-4" key={index}>
                    <img
                      src={`/static/img/${image}`}
                      alt={`${modalProduct.name} ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Log DOM loading status and render the component
console.log("DOM fully loaded");

const productRoot = document.getElementById("product");
if (productRoot) {
  console.log("Found #product, rendering React component...");
  ReactDOM.createRoot(productRoot).render(<Product />);
} else {
  console.error("No #product div found in the DOM.");
}
