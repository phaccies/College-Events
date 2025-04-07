document.addEventListener("DOMContentLoaded", () => {
    fetch("/php/getUserInfo.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          window.location.href = "/pages/login/index.html";
          return;
        }
  
        const userInfo = document.getElementById("user-info");
        userInfo.textContent = `Hello, ${data.name}! | Role: ${data.role}`;
  
        const roleText = document.querySelector("main > p");
        if (data.role === "admin") {
          roleText.textContent = "This is your admin dashboard. You can manage users and system settings.";
        } else if (data.role === "super_admin") {
          roleText.textContent = "This is your super admin dashboard. You have full system access.";
        } else {
          roleText.textContent = "This is your student dashboard. You can explore events, update your profile, and more!";
        }
      })
      .catch((err) => {
        console.error("Error loading user info:", err);
      });
  });


  function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "../../index.html";
}