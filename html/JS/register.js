

const urlBase = "http://knightsocial.space/php";
const extension = "php";


function toggleUniversityDropdown() {
  const role = document.getElementById("signupRole").value;
  const universityWrapper = document.getElementById("signupUniversity");
  if (role === "super_admin") {
    universityWrapper.style.display = "none";
  } else {
    universityWrapper.style.display = "block";
  }
}


function doRegister() {
  const name = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole").value;
  const result = document.getElementById("signupResult");

  result.textContent = "";


  let university_id;

  if (role === "super_admin") {
    university_id = 4;
  } else {
    const rawValue = document.getElementById("signupUniversity").value;
    university_id = parseInt(rawValue);
    if (isNaN(university_id)) {
      result.textContent = "Please select a university.";
      return;
    }
  }


  console.log("the university_id is:" + university_id);

  if (!name || !email || !password || !role) {
    result.textContent = "All fields are required.";
    return;
  }

  console.log("the role is:" + role);
  console.log("the university_id is:" + university_id);
  if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
    result.textContent = "Password must contain at least one uppercase letter and one number.";
    return;
  }

  const payload = JSON.stringify({
    name,
    email,
    password,
    role,
    university_id
  });

  fetch(`${urlBase}/register.${extension}`, {
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
        result.textContent = " Registration successful! You can now login.";
        document.getElementById("loginButtonWrapper").style.display = "block";
      } else {
        result.textContent = "Registration failed. Please try again.";
      }
    })
    .catch(err => {
      result.textContent = "Error: " + err.message;
    });
}