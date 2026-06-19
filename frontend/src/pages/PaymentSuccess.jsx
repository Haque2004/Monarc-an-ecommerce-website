export default function PaymentSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#111", border: "1px solid #333", borderRadius: 12, padding: 32 }}>
        <h1 style={{ marginBottom: 16, fontFamily: "Fraunces, serif" }}>Payment Successful</h1>
        <p style={{ lineHeight: 1.7, color: "#ccc" }}>
          Thank you for your purchase. Your payment has been completed successfully.
        </p>
        <p style={{ marginTop: 24, color: "#ccc" }}>
          You may now return to the store to continue shopping.
        </p>
        <button
          onClick={() => (window.location.pathname = "/")}
          style={{
            marginTop: 24,
            padding: "12px 18px",
            border: "none",
            borderRadius: 8,
            background: "#C9A961",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}
