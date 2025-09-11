document.addEventListener("DOMContentLoaded", function () {
  console.log("🏠 Home page script loaded");

  // Search bar Enter key redirects to products with query
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

  // Category navigation
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
});
