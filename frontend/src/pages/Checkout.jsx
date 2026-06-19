import { useMemo, useState } from "react";
import API from "../services/api";
import { formatPrice, GOLD } from "../data/products";

function Checkout() {
  const [cart] = useState(() => {
    const storedCart = window.localStorage.getItem("cart");
    if (!storedCart) return [];

    try {
      return JSON.parse(storedCart);
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
      return [];
    }
  });
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState(null);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInstructions(null);

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!customerName || !customerEmail || !address || !city || !postalCode) {
      setError("Please fill in all required shipping fields.");
      return;
    }

    const orderItems = cart.map((item) => ({
      product: item._id || item.id,
      qty: item.qty,
      image: item.image || item.images?.[0]?.url || "",
      name: item.name,
    }));

    const payload = {
      orderItems,
      shippingAddress: { address, city, postalCode, country },
      customerName,
      customerEmail,
      customerPhone,
    };

    setLoading(true);

    try {
      if (paymentMethod === "sslcommerz") {
        const res = await API.post("/orders/sslcommerz", payload);
        if (res.data?.url) {
          window.location.href = res.data.url;
          return;
        }
        setError("Unable to start payment. Please try again.");
      } else {
        const res = await API.post("/orders/bkash", payload);
        if (res.data?.success && res.data.instructions) {
          setInstructions(res.data.instructions);
          return;
        }
        setError("Unable to start bKash payment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="page-shell">
        <div className="checkout-grid">
          <div className="checkout-card">
            <h1 className="section-title">Checkout</h1>
            <p className="hero-copy">Fill in shipping details and continue to payment with SSLCommerz or bKash.</p>
            {error && <div className="notification-card">{error}</div>}
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Payment method *</label>
                <select className="input-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="sslcommerz">SSLCommerz</option>
                  <option value="bkash">bKash</option>
                </select>
              </div>
              <div className="form-row">
                <label>Name *</label>
                <input className="input-field" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="form-row">
                <label>Email *</label>
                <input className="input-field" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="form-row">
                <label>Phone</label>
                <input className="input-field" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone number" />
              </div>
              <div className="form-row">
                <label>Address *</label>
                <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
              </div>
              <div className="form-grid-2">
                <div className="form-row">
                  <label>City *</label>
                  <input className="input-field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </div>
                <div className="form-row">
                  <label>Postal Code *</label>
                  <input className="input-field" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" />
                </div>
              </div>
              <div className="form-row">
                <label>Country *</label>
                <input className="input-field" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
              </div>
              <button type="submit" className="button-primary button-full" disabled={loading}>
                {loading ? "Starting payment..." : paymentMethod === "bkash" ? "Pay with bKash" : "Pay with SSLCommerz"}
              </button>
            </form>
            {instructions && (
              <div className="notification-card notification-card--alt">
                <h3 className="modal-title">bKash Payment Instructions</h3>
                <p className="checkout-note">
                  Send <strong>BDT {instructions.amount}</strong> to <strong>{instructions.bkashNumber}</strong>.
                </p>
                <p className="checkout-note">
                  Reference: <strong>{instructions.reference}</strong>
                </p>
                <p className="checkout-note" style={{ margin: 0 }}>{instructions.note}</p>
              </div>
            )}
          </div>
          <div className="checkout-card">
            <h2 className="section-title">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="hero-copy">Your cart is empty. Add products before checkout.</p>
            ) : (
              <div className="order-summary-list">
                {cart.map((item) => (
                  <div key={item.id || item._id} className="order-summary-item">
                    <span>
                      <span>{item.name}</span>
                      <strong>{formatPrice(item.price * item.qty)}</strong>
                    </span>
                    <div className="cart-item__label">Qty: {item.qty} · {item.category || "Category"}</div>
                  </div>
                ))}
                <div className="order-total">
                  <span>Total</span>
                  <strong style={{ color: GOLD }}>{formatPrice(total)}</strong>
                </div>
              </div>
            )}
            <button type="button" className="button-secondary button-full" onClick={() => (window.location.pathname = "/")}>Back to Store</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
