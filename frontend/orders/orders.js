document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("ordersTable");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    tableBody.innerHTML =
      "<tr><td colspan='8'>Unauthorized. Please login as admin.</td></tr>";
    return;
  }

  try {
    console.log("Orders.js loaded");

    const res = await fetch("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log("Fetched data:", data);

    const ordersArray = data.orders || [];
    if (ordersArray.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='8'>No orders found</td></tr>";
      return;
    }

    tableBody.innerHTML = "";
    ordersArray.forEach((order, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${order.customerName || "N/A"}</td>
          <td>${order.address || "N/A"}, ${order.city || ""} ${order.postalCode || ""}</td>
          <td>${order.phoneNumber || "N/A"}</td>
          <td>${
            Array.isArray(order.items)
              ? order.items.map(i => `${i.product || i.name} x${i.quantity} (${i.price}₹)`).join(", ")
              : "N/A"
          }</td>
          <td>${order.totalPrice || "N/A"}₹</td>
          <td>${order.status || "Pending"}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    tableBody.innerHTML = "<tr><td colspan='8'>Server error</td></tr>";
  }
});
