export default function PaymentFail() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "40px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#111", border: "1px solid #333", borderRadius: 12, padding: 32 }}>
        <h1 style={{ marginBottom: 16, fontFamily: "Fraunces, serif" }}>Payment Failed</h1>
        <p style={{ lineHeight: 1.7, color: "#ccc" }}>
          We could not complete your payment. Please try again or contact support if the issue continues.
        </p>
        <button
          onClick={() => (window.location.pathname = "/")}
          style={{
            marginTop: 24,
            padding: "12px 18px",
            border: "none",
            borderRadius: 8,
            background: "#E63946",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}
