import { useEffect, useState } from "react";
import API from "../services/api";
import { formatGender, formatPrice } from "../data/products";

const GOLD = "#C9A961";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [mode, setMode] = useState("list"); // "list" or "edit"
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "Fashion",
    gender: "unisex",
    price: 0,
    stock: 0,
    featured: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load products", "error");
    }
  };

  const verifyToken = async () => {
    try {
      const res = await API.get("/auth/profile");

      if (res.data && res.data.role === "admin") {
        setIsAdmin(true);
      } else {
        localStorage.removeItem("token");
        setIsAdmin(false);
      }

      fetchProducts();
    } catch (err) {
      console.warn("Token invalid", err);
      localStorage.removeItem("token");
      fetchProducts();
    }
  };

  useEffect(() => {
    const initializeAdmin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await verifyToken();
      } else {
        await fetchProducts();
      }
    };

    initializeAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFormChange = (field, value) => {
    setProductForm((p) => ({ ...p, [field]: value }));
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      category: "Fashion",
      gender: "unisex",
      price: 0,
      stock: 0,
      featured: false,
    });
    setFiles([]);
    setSelected(null);
    setMode("list");
  };

  const handleCreate = async () => {
    if (!productForm.name.trim()) return showMessage("Product name required", "error");
    const token = localStorage.getItem("token");
    try {
      const res = await API.post(
        "/products",
        { ...productForm },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );

      setProducts((prev) => [res.data, ...prev]);
      resetForm();
      showMessage("Product created successfully");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Create failed", "error");
    }
  };

  const handleUpdate = async () => {
    if (!selected) return showMessage("Select a product first", "error");
    const token = localStorage.getItem("token");
    try {
      const res = await API.put(
        `/products/${selected._id}`,
        { ...productForm },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );

      setProducts((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));
      setSelected(res.data);
      showMessage("Product updated successfully");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Update failed", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/products/${productId}`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      if (selected?._id === productId) {
        resetForm();
      }
      showMessage("Product deleted successfully");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleUpload = async () => {
    if (!selected) return showMessage("Select a product first", "error");
    if (files.length === 0) return showMessage("Choose files to upload", "error");

    setLoading(true);

    try {
      const form = new FormData();
      files.forEach((f) => form.append("images", f));

      const token = localStorage.getItem("token");

      const res = await API.post(
        `/products/${selected._id}/images`,
        form,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelected(res.data);
      setProducts((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));
      setFiles([]);
      showMessage("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthenticating(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);

        if (res.data.role === "admin") {
          setIsAdmin(true);
          showMessage("Login successful");
          await fetchProducts();
          setEmail("");
          setPassword("");
        } else {
          localStorage.removeItem("token");
          setIsAdmin(false);
          showMessage("Admin access required", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Login failed", "error");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    resetForm();
    showMessage("Logged out");
  };

  const selectProduct = (product) => {
    setSelected(product);
    const formData = {
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Fashion",
      gender: (product.gender || "unisex").toLowerCase(),
      price: product.price || 0,
      stock: product.stock || 0,
      featured: product.featured || false,
    };
    setProductForm(formData);
    setMode("edit");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    border: `1px solid ${GOLD}`,
    borderRadius: "4px",
    backgroundColor: "#1a1a1a",
    color: "#FAFAF8",
    fontSize: "14px",
    fontFamily: "inherit",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: GOLD,
    color: "#1a1a1a",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "opacity 0.2s",
  };

  const messageStyle = {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "4px",
    backgroundColor: messageType === "error" ? "#8B3B3B" : "#3B8B3B",
    color: "#FAFAF8",
    borderLeft: `4px solid ${messageType === "error" ? "#E63946" : "#06D6A0"}`,
  };

  return (
    <div style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", color: "#FAFAF8", fontFamily: "inherit" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: `2px solid ${GOLD}`, paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: 0, fontFamily: "Fraunces, serif" }}>Admin Dashboard</h1>
            <p style={{ color: "#8A8A85", marginTop: "8px", fontSize: "14px" }}>Manage your products and inventory</p>
          </div>
          {isAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ color: GOLD, fontSize: "14px" }}>✓ Admin Mode</span>
              <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: "transparent", border: `1px solid ${GOLD}`, color: GOLD }}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Login Section */}
        {!isAdmin && (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div style={{ backgroundColor: "#1a1a1a", padding: "32px", borderRadius: "8px", border: `1px solid ${GOLD}` }}>
              <h2 style={{ fontSize: "24px", marginBottom: "24px", fontFamily: "Fraunces, serif", color: "#C9A961" }}>Admin Login</h2>
              <p style={{ color: "#8A8A85", marginBottom: "20px", fontSize: "14px" }}>Enter your admin credentials to manage products</p>
              <form onSubmit={handleLogin}>
                <div>
                  <label style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>Email</label>
                  <input
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginTop: "16px" }}>
                  <label style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>Password</label>
                  <input
                    placeholder="Your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <button type="submit" disabled={authenticating} style={{ ...buttonStyle, width: "100%", marginTop: "24px" }}>
                  {authenticating ? "Signing in..." : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.pathname = "/")}
                  style={{ ...buttonStyle, marginTop: "12px", width: "100%", backgroundColor: "transparent", border: `1px solid ${GOLD}`, color: GOLD }}
                >
                  Back to Home
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <div>
            {/* Products List Section */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontFamily: "Fraunces, serif", margin: 0 }}>Products ({products.length})</h2>
                  <p style={{ color: "#8A8A85", marginTop: "8px", fontSize: "14px" }}>Click on a product to edit or manage its images</p>
                </div>
                <button onClick={() => { resetForm(); setMode("edit"); }} style={buttonStyle}>
                  + New Product
                </button>
              </div>

              {products.length === 0 ? (
                <div style={{ backgroundColor: "#1a1a1a", padding: "40px", borderRadius: "8px", textAlign: "center", border: `1px dashed ${GOLD}` }}>
                  <p style={{ color: "#8A8A85", fontSize: "16px" }}>No products yet. Create one to get started!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => selectProduct(product)}
                      style={{
                        backgroundColor: selected?._id === product._id ? GOLD : "#1a1a1a",
                        border: `2px solid ${selected?._id === product._id ? GOLD : "#333"}`,
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        color: selected?._id === product._id ? "#1a1a1a" : "#FAFAF8",
                      }}
                      onMouseOver={(e) => {
                        if (selected?._id !== product._id) {
                          e.currentTarget.style.borderColor = GOLD;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selected?._id !== product._id) {
                          e.currentTarget.style.borderColor = "#333";
                        }
                      }}
                    >
                      {product.images && product.images[0] && (
                        <div style={{ width: "100%", height: "160px", backgroundImage: `url(${product.images[0].url})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "4px", marginBottom: "12px" }} />
                      )}
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600" }}>{product.name}</h3>
                      <p style={{ margin: "4px 0", fontSize: "13px", opacity: 0.8 }}>Category: {product.category}</p>
                      <p style={{ margin: "4px 0", fontSize: "13px", opacity: 0.8 }}>Gender: {formatGender(product)}</p>
                      <p style={{ margin: "4px 0", fontSize: "13px", opacity: 0.8 }}>Price: {formatPrice(product.price)}</p>
                      <p style={{ margin: "4px 0", fontSize: "13px", opacity: 0.8 }}>Stock: {product.stock}</p>
                      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProduct(product);
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor: GOLD,
                            color: "#1a1a1a",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product._id);
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor: "#8B3B3B",
                            color: "#FAFAF8",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit/Create Form Section */}
            {mode === "edit" && (
              <div style={{ backgroundColor: "#1a1a1a", padding: "32px", borderRadius: "8px", border: `1px solid ${GOLD}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontFamily: "Fraunces, serif", margin: 0 }}>
                    {selected ? "Edit Product" : "Create New Product"}
                  </h2>
                  <button onClick={() => setMode("list")} style={{ ...buttonStyle, backgroundColor: "transparent", border: `1px solid ${GOLD}`, color: GOLD }}>
                    ← Back to List
                  </button>
                </div>

                {/* Product Form */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Product Name *</label>
                    <input
                      placeholder="e.g., Premium Cotton Shirt"
                      value={productForm.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Description</label>
                    <textarea
                      placeholder="Describe your product in detail..."
                      value={productForm.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      style={textareaStyle}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Category</label>
                      <input
                        placeholder="e.g., Fashion, Electronics"
                        value={productForm.category}
                        onChange={(e) => handleFormChange("category", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Gender</label>
                      <select
                        value={productForm.gender}
                        onChange={(e) => handleFormChange("gender", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                          border: `1px solid ${GOLD}`,
                          borderRadius: "4px",
                          backgroundColor: "#1a1a1a",
                          color: "#FAFAF8",
                          fontSize: "14px",
                          fontFamily: "inherit",
                        }}
                      >
                        <option value="unisex">Unisex</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Price (Tk)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={productForm.price}
                        onChange={(e) => handleFormChange("price", Number(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ fontSize: "14px", display: "block", marginBottom: "4px", fontWeight: "500" }}>Stock</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={productForm.stock}
                        onChange={(e) => handleFormChange("stock", Number(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => handleFormChange("featured", e.target.checked)}
                          style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <span>Featured Product</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                    <button onClick={selected ? handleUpdate : handleCreate} style={{ ...buttonStyle, flex: 1 }}>
                      {selected ? "Update Product" : "Create Product"}
                    </button>
                    <button onClick={() => setMode("list")} style={{ ...buttonStyle, backgroundColor: "transparent", border: `1px solid ${GOLD}`, color: GOLD }}>
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Image Upload Section */}
                {selected && (
                  <div style={{ borderTop: `1px solid ${GOLD}`, paddingTop: "32px" }}>
                    <h3 style={{ fontSize: "18px", fontFamily: "Fraunces, serif", marginBottom: "16px" }}>Product Images</h3>
                    <p style={{ color: "#8A8A85", fontSize: "14px", marginBottom: "16px" }}>Upload multiple images for your product gallery</p>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "14px", display: "block", marginBottom: "8px", fontWeight: "500" }}>Choose Images (JPG, PNG)</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{
                          ...inputStyle,
                          padding: "16px",
                          cursor: "pointer",
                        }}
                      />
                      {files.length > 0 && (
                        <p style={{ color: GOLD, fontSize: "14px", marginTop: "8px" }}>
                          ✓ {files.length} file(s) selected
                        </p>
                      )}
                    </div>

                    <button onClick={handleUpload} disabled={loading} style={{ ...buttonStyle, width: "100%" }}>
                      {loading ? "Uploading..." : "Upload Images"}
                    </button>

                    {/* Gallery Display */}
                    {selected.images && selected.images.length > 0 && (
                      <div style={{ marginTop: "28px" }}>
                        <h4 style={{ fontSize: "16px", marginBottom: "16px" }}>Current Gallery ({selected.images.length})</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                          {selected.images.map((img) => (
                            <div
                              key={img.public_id}
                              style={{
                                width: "100%",
                                paddingBottom: "100%",
                                position: "relative",
                                borderRadius: "4px",
                                overflow: "hidden",
                                border: `1px solid ${GOLD}`,
                              }}
                            >
                              <img
                                src={img.url}
                                alt="Product"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Message Alert */}
        {message && <div style={messageStyle}>{message}</div>}
      </div>
    </div>
  );
}

export default AdminProducts;
