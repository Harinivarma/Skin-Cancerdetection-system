document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.getElementById("navLinks");
  const loggedIn = localStorage.getItem("loggedIn");

  if (!navLinks) return;

  if (loggedIn === "true") {
    navLinks.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="upload.html">Upload</a></li>
      <li><a href="complete-profile.html">👤</a></li>
      <li><a href="#" onclick="logout()">Logout</a></li>
    `;
  } else {
    navLinks.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="login.html">Login</a></li>
      <li><a href="register.html">Register</a></li>
    `;
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
