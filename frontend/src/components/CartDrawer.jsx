import { formatPrice } from "../data/products";

function CartDrawer({ open, onClose, cart, updateQty }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasStockIssue = cart.some((item) => item.qty > (item.stock ?? 0) || (item.stock ?? 0) <= 0);

  const handleCheckoutClick = () => {
    if (hasStockIssue) {
      alert("Please fix out-of-stock items before checkout.");
      return;
    }

    window.location.pathname = "/checkout";
  };

  return (
    <div className={open ? "cart-drawer open" : "cart-drawer"}>
      <div className="cart-drawer__header">
        <div>
          <h3 className="section-title cart-title">Your Cart</h3>
          <p className="cart-note">{cart.length} item{cart.length === 1 ? "" : "s"}</p>
        </div>
        <button className="button-pill" onClick={onClose}>✕</button>
      </div>

      {cart.length === 0 ? (
        <p className="cart-note">Cart is empty</p>
      ) : (
        <>
          <div className="cart-drawer__items">
            {cart.map((item) => (
              <div key={item.id || item._id} className="cart-item">
                <div className="cart-item__header">
                  <span>{item.name}</span>
                  <span className="cart-item__label">Stock: {item.stock ?? 0}</span>
                </div>
                <div className="cart-item__price">{formatPrice(item.price)}</div>
                <div className="cart-item__controls">
                  <button className="cart-item__qty-button" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button className="cart-item__qty-button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                {item.qty > (item.stock ?? 0) || (item.stock ?? 0) <= 0 ? (
                  <div className="cart-item__status">
                    {item.stock <= 0 ? "Out of stock" : "Quantity exceeds stock"}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="cart-note">Shipping and payment details are collected on the checkout page.</p>
          </div>

          <button className="button-primary button-full" onClick={handleCheckoutClick} disabled={hasStockIssue}>
            GO TO CHECKOUT
          </button>
        </>
      )}
    </div>
  );
}

export default CartDrawer;
