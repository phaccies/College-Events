document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("user_id");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
  
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
  
    if (name) nameInput.value = name;
    if (email) emailInput.value = email;

    const role = localStorage.getItem("role") || "Student";

    document.getElementById("user-name").textContent = name;
    document.getElementById("user-role").textContent = role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');

    if (!userId) {
      alert("User not logged in.");
      window.location.href = "../login/";
      return;
    }
  
    fetch("http://knightsocial.space/php/updateProfile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: parseInt(userId) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          document.getElementById("name").value = data.name;
          document.getElementById("email").value = data.email;
        } else {
          alert("Failed to load profile.");
        }
      });


document.getElementById("profile-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user_id = localStorage.getItem("user_id");
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!user_id || !name || !email) {
    alert("Name and email are required.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const payload = {
    user_id,
    name,
    email
  };

  if (password) payload.password = password;

  const res = await fetch("http://knightsocial.space/php/updateProfile.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (data.success) {
    alert("Profile updated successfully!");
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  } else {
    alert("Failed to update: " + data.error);
  }
}); 
  });