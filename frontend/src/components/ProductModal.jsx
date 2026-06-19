import { useState } from "react";
import { formatPrice } from "../data/products";

function ProductModal({ product, onClose, onAdd }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!product) return null;

  const mainImage = product.images?.[activeIndex]?.url;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image" style={{ background: mainImage ? `url(${mainImage}) center/cover no-repeat` : "#0a0a0a" }} />
        <div className="modal-body">
          {product.images?.length > 1 && (
            <div className="modal-thumbnails">
              {product.images.map((img, index) => (
                <button
                  key={img.public_id || index}
                  type="button"
                  className={`modal-thumb ${activeIndex === index ? "active" : ""}`}
                  style={{ backgroundImage: `url(${img.url})` }}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          )}
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-description">{product.description || "No description available."}</p>
          <div style={{ color: "var(--accent)", marginTop: 10 }}>{formatPrice(product.price)}</div>
          <button className="button-primary" type="button" onClick={onAdd} style={{ marginTop: 18, width: "100%" }}>
            ADD TO CART
          </button>
          <button className="button-secondary" type="button" onClick={onClose} style={{ marginTop: 12, width: "100%" }}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
