// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  if (!name || !role) {
    // Redirect to login if info is missing
    window.location.href = "/html/pages/login/index.html";
    return;
  }

  const userInfo = document.getElementById("user-info");
  userInfo.textContent = `Hello, ${name}! | Role: ${role}`;

  const roleText = document.querySelector("main > p");
  if (role === "admin") {
    roleText.textContent = "This is your admin dashboard. You can manage users and system settings.";
  } else if (role === "super_admin") {
    roleText.textContent = "This is your super admin dashboard. You have full system access.";
  } else {
    roleText.textContent = "This is your student dashboard. You can explore events, update your profile, and more!";
  }
});

function doLogout() 
{
  localStorage.clear();

  window.location.href = "../../index.html";
}