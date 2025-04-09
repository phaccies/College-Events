document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('profile-form').addEventListener('submit', function(e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirm-password").value.trim();
      const userId = localStorage.getItem("user_id");
  
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }
  
      if (password && password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      const payload = { user_id: parseInt(userId), name, email };
      if (password) payload.password = password;
  
      fetch("http://knightsocial.space/php/updateProfile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Profile updated successfully!");
          document.getElementById("password").value = "";
          document.getElementById("confirm-password").value = "";
        } else {
          alert("Update failed: " + data.error);
        }
      })
      .catch(err => {
        alert("Error: " + err.message);
      });
    });
  });