document.addEventListener("DOMContentLoaded", function () {
  console.log("🏠 Home page script loaded");

  // --- Check Login Status ---
  const token = localStorage.getItem("token");
  const authLink = document.getElementById("auth-link");

  if (token && authLink) {
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.username) {
          authLink.textContent = `Logout (${data.user.username})`;
          authLink.href = "#";
          authLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
          });
        } else {
          authLink.textContent = "Login";
          authLink.href = "../login page/login.html";
        }
      })
      .catch(err => {
        console.error("Token check failed", err);
        authLink.textContent = "Login";
        authLink.href = "../login page/login.html";
      });
  } else if (authLink) {
    authLink.textContent = "Login";
    authLink.href = "../login page/login.html";
  }

  // --- Search functionality ---
  const searchInput = document.getElementById("search-home");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (query) {
          window.location.href = `../product page/products.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // --- Category navigation ---
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      const path = "../product page/products.html";
      if (category === "all") {
        window.location.href = path;
      } else {
        window.location.href = `${path}?category=${category}`;
      }
    });
  });

  // --- Protect Cart button ---
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      if (!token) {
        e.preventDefault();
        alert("Please log in to access your cart.");
        window.location.href = "../login page/login.html";
      }
    });
  }
});
