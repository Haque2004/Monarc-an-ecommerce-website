import ProductCard from "./ProductCard";

function ShopSection({ products, categories, activeCategory, onCategoryChange, onProductSelect }) {
  return (
    <section className="section">
      <div className="page-shell">
        <h2 className="section-title">Collection</h2>

        <div className="filter-group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onClick={onProductSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopSection;
