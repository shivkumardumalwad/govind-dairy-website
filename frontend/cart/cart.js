const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const API_BASE = "http://localhost:5000/api"; // backend API base URL

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQuantity(name, change) {
  const cart = getCart();
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }
}

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    document.getElementById("cartSummary").style.display = "none";
    return;
  }

  cart.forEach(item => {
    const price = getPrice(item.name);
    const subtotal = item.quantity * price;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>₹${price} x ${item.quantity} = ₹${subtotal}</p>
      </div>
      <div class="qty">
        <button onclick="updateQuantity('${item.name}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.name}', 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.innerText = total;
  document.getElementById("cartSummary").style.display = "block";
}

// Price lookup (can also be fetched from backend later)
function getPrice(name) {
  const allProducts = {
    "Full Cream Milk": 60,
    "Paneer (250g)": 90,
    "Curd (500g)": 40,
    "Desi Ghee (500g)": 220,
    "Organic Paneer": 120,
    "Buffalo Ghee": 250,
    "Toned Milk": 55,
    "Greek Yogurt": 80
  };
  return allProducts[name] || 0;
}

// Checkout → Send order to backend (MongoDB)
async function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  // Assume logged-in user ID stored in localStorage
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    window.location.href = "../login page/login.html";
    return;
  }

  // Prepare order payload
  const orderItems = cart.map(item => ({
    product: item.name,  // later replace with productId from backend
    quantity: item.quantity
  }));

  const total = cart.reduce((sum, item) => sum + item.quantity * getPrice(item.name), 0);

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userId,
        items: orderItems,
        total: total
      })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      localStorage.removeItem("cart"); // clear cart after placing order
      window.location.href = "../order-history/order-history.html";
    }
  } catch (err) {
    console.error(err);
    alert("Error placing order!");
  }
}

renderCart();
