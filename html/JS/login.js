function doLogin() {
	const email = document.getElementById("loginEmail").value.trim();
	const password = document.getElementById("loginPassword").value.trim();
	const result = document.getElementById("loginResult");
  
	result.textContent = "";
  
	const payload = JSON.stringify({ email, password });
  
	fetch("/php/login.php", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: payload
	})
	  .then(res => res.json())
	  .then(data => {
		if (data.error) {
		  result.textContent = data.error;
		} else {
		  // You could save the data if needed: localStorage.setItem("email", data.email);
		  window.location.href = "/pages/dashboard";
		}
	  })
	  .catch(err => {
		result.textContent = "Error: " + err.message;
	  });
  }

  function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}