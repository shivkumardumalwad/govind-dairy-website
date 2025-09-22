const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

let products = [];
const quantities = {}; // Track quantity per product

// Get URL parameters
function getQueryParams() {
  const params = {};
  const query = window.location.search.substring(1);
  query.split("&").forEach(pair => {
    if (!pair) return;
    const [key, value] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  });
  return params;
}

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
    applyInitialFilters();
  } catch (err) {
    productList.innerHTML = `<p style="color: red;">Error loading products: ${err.message}</p>`;
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
        <img src="${product.image || '../assets/placeholder.jpg'}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>${product.description || ''}</p>

        <div class="quantity-controls">
          <button class="qty-btn" onclick="decreaseQty('${product._id}')">−</button>
          <span id="qty-${product._id}">${qty}</span>
          <button class="qty-btn" onclick="increaseQty('${product._id}', ${product.stock || 0})">+</button>
        </div>

        <button class="add-to-cart-btn" onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    `;
  }).join('');
}

// Filter logic
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value.toLowerCase();

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === '' || p.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

// Apply filters from URL
function applyInitialFilters() {
  const params = getQueryParams();
  if (params.search) searchInput.value = params.search;
  if (params.category) categorySelect.value = params.category;
  filterProducts();
}

// Event listeners
searchInput.addEventListener('input', filterProducts);
categorySelect.addEventListener('change', filterProducts);

// Quantity Management
function increaseQty(productId, maxStock) {
  if (!quantities[productId]) quantities[productId] = 0;

  if (quantities[productId] < maxStock) {
    quantities[productId]++;
    document.getElementById(`qty-${productId}`).textContent = quantities[productId];
  }
}

function decreaseQty(productId) {
  if (!quantities[productId]) quantities[productId] = 0;

  if (quantities[productId] > 0) {
    quantities[productId]--;
    document.getElementById(`qty-${productId}`).textContent = quantities[productId];
  }
}

// Add to cart logic (basic)
function addToCart(productId) {
  const qty = quantities[productId] || 0;
  const product = products.find(p => p._id === productId);
  if (!product || qty === 0) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item._id === productId);

  if (index !== -1) {
    cart[index].quantity += qty;
    if (cart[index].quantity > product.stock) {
      cart[index].quantity = product.stock;
    }
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: qty,
      stock: product.stock, // needed for limits
      image: product.image
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`✅ Added ${qty} × ${product.name} to cart`);
}


// Init
fetchProducts();
