//login.js
const urlBase = "http://knightsocial.space/php";
const extension = "php";

function doLogin() {
	const email = document.getElementById("loginEmail").value.trim();
	const password = document.getElementById("loginPassword").value.trim();
	const result = document.getElementById("loginResult");

	result.textContent = "";

	const payload = JSON.stringify({ email, password });

	fetch(`${urlBase}/login.${extension}`, {
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
			localStorage.setItem("user_id", data.user_id);
			localStorage.setItem("email", data.email);
			localStorage.setItem("name", data.name);
			localStorage.setItem("role", data.role);
			localStorage.setItem("university_id", data.university_id);
			
			if (data.role === "student") {
				window.location.href = "../dashboard/student.html";
			} else if (data.role === "admin") {
				window.location.href = "../dashboard/admin.html";
			} else if (data.role === "super_admin") {
				window.location.href = "../dashboard/superadmin.html";
			} 
			console.log("Hello I'm here!");
		}
	})
	.catch(err => {
		result.textContent = "Error: " + err.message;
	});
}

/*
  function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
} */