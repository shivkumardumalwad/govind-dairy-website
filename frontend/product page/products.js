const products = [
  { name: "Full Cream Milk", price: 60, category: "milk" },
  { name: "Paneer (250g)", price: 90, category: "paneer" },
  { name: "Curd (500g)", price: 40, category: "curd" },
  { name: "Desi Ghee (500g)", price: 220, category: "ghee" },
  { name: "Organic Paneer", price: 120, category: "paneer" },
  { name: "Buffalo Ghee", price: 250, category: "ghee" },
  { name: "Toned Milk", price: 55, category: "milk" },
  { name: "Greek Yogurt", price: 80, category: "curd" }
];

const list = document.getElementById("productList");
const search = document.getElementById("search");
const category = document.getElementById("category");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQuantity(name, change) {
  const cart = getCart();
  const index = cart.findIndex(item => item.name === name);
  if (index > -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (change > 0) {
    cart.push({ name, quantity: 1 });
  }
  saveCart(cart);
  updateDisplayCount(name);
}

function getProductQuantity(name) {
  const cart = getCart();
  const item = cart.find(p => p.name === name);
  return item ? item.quantity : 0;
}

function updateDisplayCount(name) {
  const countSpan = document.getElementById(`count-${name.replace(/\s/g, '')}`);
  if (countSpan) {
    countSpan.innerText = getProductQuantity(name);
  }
}

function renderProducts() {
  const searchTerm = search.value.toLowerCase();
  const cat = category.value;
  list.innerHTML = "";

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) &&
    (cat === "" || p.category === cat)
  );

  filtered.forEach(p => {
    const qty = getProductQuantity(p.name);
    const idName = p.name.replace(/\s/g, '');
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <div class="quantity-controls">
        <button onclick="updateQuantity('${p.name}', -1)">-</button>
        <span id="count-${idName}">${qty}</span>
        <button onclick="updateQuantity('${p.name}', 1)">+</button>
      </div>
    `;
    list.appendChild(div);
  });
}

// Initial filter from URL
const urlParams = new URLSearchParams(window.location.search);
const initSearch = urlParams.get('search') || '';
const initCategory = urlParams.get('category') || '';
search.value = initSearch;
category.value = initCategory;

search.addEventListener("input", renderProducts);
category.addEventListener("change", renderProducts);

renderProducts();
