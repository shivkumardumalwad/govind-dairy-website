const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render cart UI
function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty 🥲</p>";
    cartTotalEl.textContent = "0";
    return;
  }

  let total = 0;

  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item">
        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price} × ${item.quantity} = ₹${itemTotal.toFixed(2)}</p>
        </div>
        <div class="qty">
          <button onclick="decreaseQty(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>
        <button style="background: #dc3545;" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  }).join("");

  cartTotalEl.textContent = total.toFixed(2);
}

// Increase quantity
function increaseQty(index) {
  const product = cart[index];
  if (product.quantity < product.stock) {
    product.quantity++;
    saveCart();
  }
}

// Decrease quantity
function decreaseQty(index) {
  const product = cart[index];
  if (product.quantity > 1) {
    product.quantity--;
    saveCart();
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// Save to localStorage and re-render
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Init
renderCart();
