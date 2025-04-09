// createRSO.js
const urlBase = "http://knightsocial.space/php";
const extension = "php";

function createRSO() {
  const name = document.getElementById("rsoName").value.trim();
  const result = document.getElementById("createRSOResult");

  result.textContent = "";

  const admin_id = localStorage.getItem("user_id");
  const university_id = localStorage.getItem("university_id");

  if (!name || !admin_id || !university_id) {
    result.style.color = "red";
    result.textContent = "Missing required fields.";
    return;
  }

  const payload = JSON.stringify({
    name,
    admin_id,
    university_id
  });

  fetch(`${urlBase}/addRSO.${extension}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      result.style.color = "red";
      result.textContent = data.error;
    } else {
      result.style.color = "lightgreen";
      result.textContent = `✅ RSO "${name}" created successfully!`;
      document.getElementById("createRSOForm").reset();
    }
  })
  .catch(err => {
    result.style.color = "red";
    result.textContent = "Error: " + err.message;
  });
}
