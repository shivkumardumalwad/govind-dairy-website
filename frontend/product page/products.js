const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

let products = [];
const quantities = {};

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    products = data.products || [];
    filterProducts();
  } catch (err) {
    productList.innerHTML = `<p style="color:red;">Error loading products</p>`;
    console.error(err);
  }
}

// Display products
function displayProducts(items) {
  if (items.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.innerHTML = items.map(product => {
    const qty = quantities[product._id] ?? 0;
    return `
      <div class="product-card">
        <img src="${product.image || '../assets/placeholder.jpg'}" alt="${product.name}" onerror="this.src='../assets/placeholder.jpg'" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>${product.description || ''}</p>
        <div class="quantity-controls">
          <button onclick="decreaseQty('${product._id}')">−</button>
          <span id="qty-${product._id}">${qty}</span>
          <button onclick="increaseQty('${product._id}', ${product.stock || 0})">+</button>
        </div>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    `;
  }).join('');
}

// Filter products
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value.toLowerCase();
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) &&
    (selectedCategory === '' || p.category.toLowerCase() === selectedCategory)
  );
  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

// Quantity controls
function increaseQty(id, max) {
  if (!quantities[id]) quantities[id] = 0;
  if (quantities[id] < max) {
    quantities[id]++;
    document.getElementById(`qty-${id}`).textContent = quantities[id];
  }
}

function decreaseQty(id) {
  if (!quantities[id]) quantities[id] = 0;
  if (quantities[id] > 0) {
    quantities[id]--;
    document.getElementById(`qty-${id}`).textContent = quantities[id];
  }
}

// Add to cart
function addToCart(id) {
  const qty = quantities[id] || 0;
  if (qty === 0) return alert("Select quantity first");
  const product = products.find(p => p._id === id);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(i => i._id === id);

  if (index !== -1) cart[index].quantity = Math.min(cart[index].quantity + qty, product.stock);
  else cart.push({ ...product, quantity: qty });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Added ${qty} × ${product.name} to cart`);
}

window.addEventListener("DOMContentLoaded", fetchProducts);
