const userBtn = document.getElementById('userBtn');
const adminBtn = document.getElementById('adminBtn');
const loginTitle = document.getElementById('loginTitle');
const loginForm = document.getElementById('loginForm');

let currentRole = 'user';  // default role

userBtn.addEventListener('click', () => {
  currentRole = 'user';
  loginTitle.textContent = 'User Login';
  userBtn.classList.add('active');
  adminBtn.classList.remove('active');
  loginForm.username.placeholder = "Username";
});

adminBtn.addEventListener('click', () => {
  currentRole = 'admin';
  loginTitle.textContent = 'Admin Login';
  adminBtn.classList.add('active');
  userBtn.classList.remove('active');
  loginForm.username.placeholder = "Admin Username";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  // Payload including role
  const payload = { username, password, role: currentRole };

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", username);
  localStorage.setItem("role", currentRole);
  alert("Login successful!");

  if (currentRole === "admin") {
    window.location.href = "../admin page/admin.html";  // Redirect admin to admin panel
  } else {
    window.location.href = "../home page/index.html";    // Redirect user to home page
  }
}

  } catch (error) {
    alert("Error connecting to server. Please try again.");
    console.error(error);
  }
});
