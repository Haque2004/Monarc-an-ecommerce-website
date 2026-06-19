import { useEffect, useState } from "react";
import Home from "./pages/Home";
import AdminProducts from "./pages/AdminProducts";
import Contact from "./pages/Contact";
import Collections from "./pages/Collections";
import Checkout from "./pages/Checkout";
import Manifesto from "./pages/Manifesto";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";

function App() {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("cart")) || [];
    } catch (error) {
      console.error("Failed to read cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {
    const productId = product._id || product.id;

    setCart((prev) => {
      const existing = prev.find((p) => p.id === productId);

      if (existing) {
        return prev.map((p) =>
          p.id === productId
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, id: productId, qty: 1 }];
    });
  };

  // UPDATE QTY
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty } : p
      )
    );
  };

  // Simple path-based routing: /admin -> AdminProducts
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return <AdminProducts />;
  }

  if (path.startsWith("/contact")) {
    return <Contact />;
  }

  if (path.startsWith("/collections")) {
    return <Collections addToCart={addToCart} />;
  }

  if (path.startsWith("/manifesto")) {
    return <Manifesto />;
  }

  if (path.startsWith("/checkout")) {
    return <Checkout />;
  }

  if (path.startsWith("/payment-success")) {
    return <PaymentSuccess />;
  }

  if (path.startsWith("/payment-fail")) {
    return <PaymentFail />;
  }

  return (
    <Home
      cart={cart}
      addToCart={addToCart}
      updateQty={updateQty}
    />
  );
}

export default App;