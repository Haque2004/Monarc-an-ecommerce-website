import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ShopSection from "../components/ShopSection";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";

function Home({ cart, addToCart, updateQty }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        const data = res.data || [];
        setProducts(data);

        const uniqueCategories = [
          "All",
          ...new Set(data.map((product) => product.category || "Uncategorized")),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const productId = product._id || product.id;
    const existing = cart.find((item) => item.id === productId);

    if (existing && existing.qty >= (product.stock || 0)) {
      alert("You have reached the maximum available stock for this item.");
      return;
    }

    addToCart({ ...product, id: productId });
    setSelectedProduct(null);
  };

  const handleGenderClick = (gender) => {
    window.location.href = `/collections?gender=${gender}`;
  };

  return (
    <>
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero />

      <section className="gender-category-row">
        <button className="gender-card gender-card--women" onClick={() => handleGenderClick("women")}>Shop Women</button>
        <button className="gender-card gender-card--men" onClick={() => handleGenderClick("men")}>Shop Men</button>
      </section>

      <ShopSection
        products={filteredProducts}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onProductSelect={(p) => setSelectedProduct(p)}
      />

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={() => handleAddToCart(selectedProduct)}
        />
      )}

      {/* CART DRAWER */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
      />
    </>
  );
}

export default Home;
