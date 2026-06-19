import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { getProductGender } from "../data/products";

const normalizeGender = (value) => (value || "unisex").toString().trim().toLowerCase();
const normalizeCategory = (value) => value || "Uncategorized";

export default function Collections({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const gender = searchParams.get("gender") || "";
  const genderLabel = gender ? normalizeGender(gender).replace(/^\w/, (letter) => letter.toUpperCase()) : "";

  const filterByGender = (product, genderValue) => {
    return getProductGender(product) === normalizeGender(genderValue);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        const data = res.data || [];
        const genderProducts = gender
          ? data.filter((product) => filterByGender(product, gender))
          : data;
        const cats = Array.from(new Set(genderProducts.map((p) => normalizeCategory(p.category))));

        setProducts(data);
        setCategories(["All", ...cats]);
        setActive("All");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [gender]);

  const filtered = useMemo(() => {
    const genderProducts = gender
      ? products.filter((product) => filterByGender(product, gender))
      : products;

    return genderProducts.filter((p) => active === "All" || normalizeCategory(p.category) === active);
  }, [products, active, gender]);

  const handleAddToCart = () => {
    if (!selected) return;
    addToCart(selected);
    setSelected(null);
  };

  return (
    <section className="section">
      <div className="page-shell">
        <div className="page-actions">
          <div>
            <h1 className="section-title">Collections</h1>
            <p className="hero-copy">
              {gender
                ? `Showing ${gender === "women" ? "Women" : "Men"} collections.`
                : "Explore the latest pieces in the MONARC collection and add your favorites to the cart."}
            </p>
          </div>

          <button className="button-secondary" type="button" onClick={() => (window.location.pathname = "/")}>Back to Home</button>
        </div>

        <div className="filter-group">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-pill ${active === c ? "active" : ""}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              genderLabel={genderLabel}
              onClick={(prod) => setSelected(prod)}
            />
          ))}
        </div>

        {selected && (
          <ProductModal product={selected} onAdd={handleAddToCart} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}
