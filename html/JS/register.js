function doRegister() {
    const name = document.getElementById("signupFullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const result = document.getElementById("signupResult");
  
    result.textContent = "";
  
    if (!name || !email || !password) {
      result.textContent = "All fields are required.";
      return;
    }
  
    if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
      result.textContent = "Password must contain at least one uppercase letter and one number.";
      return;
    }
  
    const payload = JSON.stringify({
      name,
      email,
      password,
      role: "student",
      university_id: 1
    });
  
    fetch("/php/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload
    })
      .then(res => res.json())
      .then(data => {
        if (data.id === -1) {
          result.textContent = "Email already registered.";
        } else if (data.id > 0) {
          result.textContent = "Registration successful! You can now login.";
          document.getElementById("loginButtonWrapper").style.display = "block";
        } else {
          result.textContent = "Registration failed. Please try again.";
        }
      })
      .catch(err => {
        result.textContent = "Error: " + err.message;
      });
  }