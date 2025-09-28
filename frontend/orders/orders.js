document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("ordersTable");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    tableBody.innerHTML = `<tr><td colspan="6">❌ Unauthorized. Please log in as admin.</td></tr>`;
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/admin/orders", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      tableBody.innerHTML = `<tr><td colspan="6">❌ Error: ${data.msg}</td></tr>`;
      return;
    }

    if (!data.orders || data.orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No orders found</td></tr>`;
      return;
    }

    data.orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.customerName}</td>
        <td>${order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</td>
        <td>₹${order.totalPrice}</td>
        <td>${order.status || "Pending"}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="6">❌ Failed to load orders</td></tr>`;
  }
});
