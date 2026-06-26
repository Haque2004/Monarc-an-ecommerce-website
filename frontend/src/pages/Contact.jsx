const GOLD = "#C9A961";

export default function Contact() {
  const contact = {
    email: "monarc.store@gmail.com",
    phone: "01400294469",
    facebook: "https://facebook.com/monarc",
    instagram: "https://instagram.com/monarc",
    address: "123 Main St, Suite 100, Anytown",
    hours: "Mon–Fri, 9am–5pm (local time)",
  };

  return (
    <section style={{ minHeight: "70vh", padding: "48px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", color: "#FAFAF8" }}>
        <h1 style={{ fontFamily: "Fraunces, serif" }}>Contact</h1>
        <p style={{ color: "#8A8A85" }}>Reach us via the channels below — pick whichever you prefer.</p>

        <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
          <div style={{ background: "#1a1a1a", padding: 20, borderRadius: 8, border: `1px solid ${GOLD}` }}>
            <h3 style={{ margin: 0 }}>Email</h3>
            <a href={`mailto:${contact.email}`} style={{ color: GOLD, display: "block", marginTop: 8 }}>{contact.email}</a>
          </div>

          <div style={{ background: "#1a1a1a", padding: 20, borderRadius: 8, border: `1px solid ${GOLD}` }}>
            <h3 style={{ margin: 0 }}>Phone</h3>
            <a href={`tel:${contact.phone}`} style={{ color: GOLD, display: "block", marginTop: 8 }}>{contact.phone}</a>
            <div style={{ color: "#8A8A85", marginTop: 6 }}>{contact.hours}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#1a1a1a", padding: 20, borderRadius: 8, border: `1px solid ${GOLD}` }}>
              <h3 style={{ margin: 0 }}>Facebook</h3>
              <a href={contact.facebook} target="_blank" rel="noreferrer" style={{ color: GOLD, display: "block", marginTop: 8 }}>{contact.facebook}</a>
            </div>

            <div style={{ background: "#1a1a1a", padding: 20, borderRadius: 8, border: `1px solid ${GOLD}` }}>
              <h3 style={{ margin: 0 }}>Instagram</h3>
              <a href={contact.instagram} target="_blank" rel="noreferrer" style={{ color: GOLD, display: "block", marginTop: 8 }}>{contact.instagram}</a>
            </div>
          </div>

          <div style={{ background: "#1a1a1a", padding: 20, borderRadius: 8, border: `1px solid ${GOLD}` }}>
            <h3 style={{ margin: 0 }}>Address</h3>
            <div style={{ color: GOLD, marginTop: 8 }}>{contact.address}</div>
          </div>

          <div>
            <button onClick={() => (window.location.pathname = "/")} style={{ background: GOLD, color: "#1a1a1a", padding: "10px 16px", border: "none", borderRadius: 6 }}>Back to Home</button>
          </div>
        </div>
      </div>
    </section>
  );
}
