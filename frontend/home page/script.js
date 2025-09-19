document.addEventListener("DOMContentLoaded", function () { 
  console.log("🏠 Home page script loaded");

  const navMenu = document.getElementById("navMenu");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Clear existing login/profile links if any (optional)
  [...navMenu.querySelectorAll(".login-btn, .profile-link")].forEach(el => el.remove());

  if (token && username) {
    // Show profile icon and username linked to profile page
    const profileLink = document.createElement("a");
    profileLink.href = "../profile/profile.html";
    profileLink.className = "profile-link";
    profileLink.title = "View Profile";
    profileLink.textContent = `👤 ${username}`;

    // Add logout functionality on click (optional)
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Logout?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload();
      }
    });

    navMenu.appendChild(profileLink);
  } else {
    // Show login button
    const loginLink = document.createElement("a");
    loginLink.href = "../login page/login.html";
    loginLink.className = "login-btn";
    loginLink.textContent = "Login";
    navMenu.appendChild(loginLink);
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
