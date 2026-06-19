import { formatGender, formatPrice } from "../data/products";

function ProductCard({ product, onClick, genderLabel }) {
  return (
    <article className="product-card" onClick={() => onClick(product)}>
      <div
        className="product-card__image"
        style={{
          background: product.images?.length
            ? `url(${product.images[0].url}) center/cover no-repeat`
            : "#0a0a0a",
        }}
      />
      <div className="product-card__body">
        <div className="product-card__meta">
          {product.category || "Product"} • {genderLabel || formatGender(product)}
        </div>
        <div className="product-card__title">{product.name}</div>
        <div className="product-card__price">{formatPrice(product.price)}</div>
      </div>
    </article>
  );
}

export default ProductCard;
