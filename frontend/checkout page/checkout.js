const API_BASE = "http://localhost:5000/api";

async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    window.location.href = "../login page/login.html";
    return;
  }

  const orderItems = cart.map(item => ({
    product: item.name,  // later should be productId
    quantity: item.quantity
  }));

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * getPrice(item.name),
    0
  );

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
      localStorage.removeItem("cart");
      window.location.href = "../order-history/order-history.html";
    }
  } catch (err) {
    console.error(err);
    alert("Error placing order!");
  }
}

// (You can bind this to your "Place Order" button in checkout.html)
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

// Temporary price lookup (same as cart.js)
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
