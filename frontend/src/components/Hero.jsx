import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function Hero() {
  const [products, setProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products");
        const featuredProducts = (res.data || []).filter((product) => product.featured);
        setProducts(featuredProducts);
      } catch (err) {
        console.error("Failed to load hero products", err);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    const timer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [products.length]);

  const slide = useMemo(() => {
    if (!products.length) return null;
    return products[slideIndex];
  }, [products, slideIndex]);

  return (
    <section className="hero-section section">
      <div className="page-shell">
        <div className="glass-panel hero-panel hero-grid">
          <div className="hero-copy-panel">
            <h1 className="hero-title hero-title--gold">Modern Luxury.<br/>Timeless Identity.</h1>
            <p className="hero-copy">Crafted garments for those who value restraint, quality and enduring design.</p>

            <div className="hero-cta hero-cta--stacked">
              <button className="button-primary" onClick={() => (window.location.pathname = "/collections")}>Explore Collection</button>
            </div>
          </div>

          <div className="hero-decor hero-slideshow">
            <span className="hero-label">New Season Launch</span>
            {slide ? (
              <button className="slide-card" onClick={() => (window.location.pathname = "/collections")}> 
                <div
                  className="slide-image"
                  style={{
                    backgroundImage: slide.images?.[0]?.url ? `url(${slide.images[0].url})` : "none",
                  }}
                />
                <div className="slide-meta">
                  <span className="slide-tag">Featured</span>
                  <h2 className="slide-title">{slide.name}</h2>
                  <div className="slide-price">Tk {Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(slide.price)}</div>
                </div>
              </button>
            ) : (
              <div className="slide-empty">Shop the latest collection</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
