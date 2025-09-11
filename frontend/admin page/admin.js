const API_BASE = "http://localhost:5000/api";
const productListEl = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const productMsg = document.getElementById("productMsg");

// fetch & render products
async function loadProducts() {
  productListEl.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) {
      productListEl.innerHTML = "<tr><td colspan='5'>No products found</td></tr>";
      return;
    }

    productListEl.innerHTML = "";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>₹${Number(p.price).toFixed(2)}</td>
        <td>${escapeHtml(p.category || "")}</td>
        <td>${p.stock ?? 0}</td>
        <td>
          <button class="action-btn delete" data-id="${p._id}">Delete</button>
        </td>`;
      productListEl.appendChild(tr);
    });
  } catch (err) {
    productListEl.innerHTML = `<tr><td colspan='5'>Error loading products</td></tr>`;
    console.error(err);
  }
}

// create product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  productMsg.textContent = "";

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value.trim();
  const description = document.getElementById("productDesc").value.trim();

  if (!name || isNaN(price)) {
    productMsg.textContent = "Please enter valid product name and price.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, category, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Failed to add product");
    productMsg.textContent = "Product added successfully.";
    productForm.reset();
    loadProducts();
  } catch (err) {
    productMsg.textContent = err.message || "Error adding product";
    console.error(err);
  }
});

// delete product (event delegation)
productListEl.addEventListener("click", async (e) => {
  if (!e.target.matches(".delete")) return;
  const id = e.target.dataset.id;
  if (!id) return;

  if (!confirm("Delete this product?")) return;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Delete failed");
    loadProducts();
  } catch (err) {
    alert("Error deleting product");
    console.error(err);
  }
});

// small helper to avoid XSS
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// initial load
loadProducts();
