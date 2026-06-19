export default function Manifesto() {
  return (
    <section className="section">
      <div className="page-shell">
        <div className="page-actions">
          <div>
            <h1 className="section-title">Manifesto</h1>
            <p className="hero-copy">A story of craft, care, and intention. MONARC celebrates materials, makers, and lasting design.</p>
          </div>

          <button className="button-secondary" type="button" onClick={() => (window.location.pathname = "/")}>Back to Home</button>
        </div>

        <div className="glass-panel" style={{ padding: 32, maxWidth: 900, color: "#FAFAF8" }}>
          <p style={{ color: "#8A8A85", fontSize: 16, marginBottom: 24 }}>
            MONARC is a modern atelier devoted to craft, sustainability and thoughtful design. We create pieces that last — crafted with respect for materials and the people who make them.
          </p>

          <h3>Our Principles</h3>
          <ul style={{ color: "#FAFAF8", lineHeight: 1.8, marginTop: 16 }}>
            <li>Quality over quantity — timeless pieces, responsibly made.</li>
            <li>Materials with integrity — natural fibers and low-impact processing.</li>
            <li>Local collaboration — working with makers and artisans.</li>
            <li>Long-lasting design — pieces that age gracefully.</li>
          </ul>

          <h3 style={{ marginTop: 32 }}>Join Us</h3>
          <p style={{ color: "#8A8A85", lineHeight: 1.8 }}>
            Sign up to receive occasional notes about new collections and limited drops.
          </p>
        </div>
      </div>
    </section>
  );
}
