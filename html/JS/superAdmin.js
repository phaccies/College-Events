document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("university-form");
    
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      addUniversity();
    });
  
    loadUniversities(); // 🔥 New: fetch existing universities
  });
  
  function addUniversity() {
    const name = document.getElementById("universityName").value;
    const location = document.getElementById("universityLocation").value;
    const description = document.getElementById("universityDescription").value;
    const numStudents = document.getElementById("universityStudents").value;

  
    fetch("http://knightsocial.space/php/addUniversity.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location,
        description,
        num_students: parseInt(numStudents)
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("University added successfully!");
        loadUniversities(); // 🔄 Reload list
        document.getElementById("university-form").reset();
      } else {
        alert("Failed to add university: " + data.error);
      }
    })
    .catch(err => alert("Error: " + err));
  }
  
  function loadUniversities() {
    fetch("http://knightsocial.space/php/getUniversities.php")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data); // Add this
        const container = document.getElementById("universities-list");
        container.innerHTML = "";
  
        if (data.success && data.universities.length > 0) {
          data.universities.forEach(uni => {

            if (uni.name === "Super_Admin") return;
            
            const card = document.createElement("div");
            card.className = "university-card";
            card.innerHTML = `
            <h4>${uni.name}</h4>
            <p><strong>Location:</strong> ${uni.location}</p>
            <p><strong>Description:</strong> ${uni.description}</p>
            <p><strong>Students:</strong> ${uni.num_students}</p>
            <button class="delete-btn" onclick="deleteUniversity(${uni.university_id})">Delete</button>
          `;
            container.appendChild(card);
          });
        } else {
          container.innerHTML = "<p><em>No universities found.</em></p>";
        }
      })
      .catch(err => {
        console.error("Failed to load universities:", err);
        document.getElementById("universities-list").innerHTML = "<p><em>Error loading universities.</em></p>";
      });
  }
  

  function deleteUniversity(universityId) {
    if (!confirm("Are you sure you want to delete this university?")) return;
  
    fetch("http://knightsocial.space/php/deleteUniversity.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ university_id: universityId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("University deleted successfully!");
          loadUniversities();
        } else {
          alert("Failed to delete university: " + data.error);
        }
      })
      .catch(err => alert("Error: " + err));
  }