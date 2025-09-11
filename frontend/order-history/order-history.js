const API_BASE = "http://localhost:5000/api";
const orderContainer = document.getElementById("orderList");

async function fetchOrders() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    window.location.href = "../login page/login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders/${userId}`);
    const orders = await res.json();

    if (orders.length === 0) {
      orderContainer.innerHTML = "<p>No past orders found.</p>";
      return;
    }

    orders.forEach(order => {
      const div = document.createElement("div");
      div.className = "order-card";

      let itemsHtml = "";
      order.items.forEach(i => {
        itemsHtml += `<li>${i.product?.name || i.product} - Qty: ${i.quantity}</li>`;
      });

      div.innerHTML = `
        <h3>Order #${order._id}</h3>
        <ul>${itemsHtml}</ul>
        <p>Total: ₹${order.total}</p>
        <p>Status: ${order.status}</p>
        <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
      `;
      orderContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    orderContainer.innerHTML = "<p>Error loading orders</p>";
  }
}

fetchOrders();
