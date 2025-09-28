const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const addMsg = document.getElementById("addMsg");
const productMsg = document.getElementById("productMsg");

const API_URL = "http://localhost:5000/api/products";

let currentEditId = null;

// Load all products
window.addEventListener("DOMContentLoaded", fetchProducts);

// Add Product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("name").value.trim(),
    price: document.getElementById("price").value,
    category: document.getElementById("category").value.trim(),
    description: document.getElementById("description").value.trim(),
    image: document.getElementById("image").value.trim(), // must be valid URL
    stock: document.getElementById("stock").value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      addMsg.textContent = "✅ Product added!";
      productForm.reset();
      fetchProducts();
    } else {
      addMsg.textContent = `❌ ${data.msg}`;
    }
  } catch (err) {
    console.error("Error adding product:", err);
    addMsg.textContent = "❌ Server error while adding product.";
  }
});

// Fetch Products
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const products = data.products || [];

    productList.innerHTML = "";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.category}</td>
        <td>${p.stock || 0}</td>
        <td>
          <button onclick="editProduct('${p._id}')">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  } catch (err) {
    productMsg.textContent = "❌ Error loading products.";
    console.error("Fetch error:", err);
  }
}

// Delete Product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    if (res.ok) fetchProducts();
    else alert(data.msg || "Error deleting");
  } catch (err) { console.error("Delete error:", err); }
}

// Edit Product
function editProduct(id) {
  currentEditId = id;
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("editName").value = p.name;
      document.getElementById("editPrice").value = p.price;
      document.getElementById("editCategory").value = p.category;
      document.getElementById("editDescription").value = p.description || "";
      document.getElementById("editImage").value = p.image || "";
      document.getElementById("editStock").value = p.stock || 0;
      document.getElementById("editModal").style.display = "block";
    })
    .catch(err => console.error("Fetch single product error:", err));
}

// Close modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditId = null;
}

// Update Product
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("editName").value,
    price: document.getElementById("editPrice").value,
    category: document.getElementById("editCategory").value,
    description: document.getElementById("editDescription").value,
    image: document.getElementById("editImage").value,
    stock: document.getElementById("editStock").value,
  };

  try {
    const res = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) { closeModal(); fetchProducts(); }
    else alert(data.msg || "Error updating");
  } catch (err) { console.error("Update error:", err); }
});
