const Product = () => {
  return (
    <div className="container-xxl bg-light my-6 py-6 pt-0">
      <div className="container">
        <div className="bg-primary text-light rounded-bottom p-5 my-6 mt-0">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 text-light mb-0">The Best Bakery In Your City</h1>
            </div>
            <div className="col-lg-6 text-lg-end">
              <div className="d-inline-flex align-items-center text-start">
                <i className="fa fa-phone-alt fa-4x flex-shrink-0"></i>
                <div className="ms-4">
                  <p className="fs-5 fw-bold mb-0">Call Us</p>
                  <p className="fs-1 fw-bold mb-0">+012 345 6789</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "500px" }}>
          <p className="text-primary text-uppercase mb-2">// Bakery Products</p>
          <h1 className="display-6 mb-4">Explore The Categories Of Our Bakery Products</h1>
        </div>
        <div className="row g-4">
          {/* Product Cards */}
          {["Cake", "Bread", "Cookies"].map((product, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                <div className="text-center p-4">
                  <div className="d-inline-block border border-primary rounded-pill px-3 mb-3">$11 - $99</div>
                  <h3 className="mb-3">{product}</h3>
                  <span>Description of {product} here.</span>
                </div>
                <div className="position-relative mt-auto">
                  <img className="img-fluid" src={`img/product-${index + 1}.jpg`} alt={product} />
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

  console.log("DOM fully loaded");

  const productRoot = document.getElementById("product");
  if (productRoot) {
    console.log("Found #product, rendering React component...");
    ReactDOM.createRoot(productRoot).render(
      <Product />
    );
  } else {
    console.error("No #product div found in the DOM.");
  }
