



document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const universityId = localStorage.getItem("university_id");

  if (!name || !role) {
    // Redirect to login if info is missing
    window.location.href = "/html/pages/login/index.html";
    return;
  }

  const userInfo = document.getElementById("user-info");
  userInfo.textContent = `Hello, ${name}! | Role: ${role}`;



  if (!userId || !universityId) return;

  fetch("http://www.knightsocial.space/php/getAllRSOs.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_id: parseInt(userId) })
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("rso-list");
    if (data.rsos && data.rsos.length > 0) {
      data.rsos.forEach(rso => {
        const li = document.createElement("li");
        li.classList.add("rso-item");
      
        const span = document.createElement("span");
        span.textContent = `${rso.name} (${rso.status})`;
      
        const button = document.createElement("button");
      
        if (rso.joined) {
          button.textContent = "Joined";
          button.disabled = true;
          button.className = "join-btn joined-btn";
        } else {
          button.textContent = "Join";
          button.className = "join-btn";
          button.onclick = () => joinRSO(rso.rso_id, button);
        }
      
        li.appendChild(span);
        li.appendChild(button);
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No RSOs found for your university.</li>";
    }
  })
  .catch(err => {
    console.error("Failed to fetch RSOs:", err);
  });


  if (userId) {
    fetchAndDisplayEvents(userId);
  }
 
});


function joinRSO(rsoId, button) {
  const userId = localStorage.getItem("user_id");

  fetch("http://knightsocial.space/php/joinRSO.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: parseInt(userId),
      rso_id: parseInt(rsoId)
    })
  })
  .then(res => res.json())
  .then(data => {
    
    if (data.success) {
      button.textContent = "Joined";
      button.disabled = true;
      button.classList.add("joined-btn");
      window.location.reload();
    } else {
      alert(data.error || "Could not join.");
    }
  })
  .catch(err => {
    console.error("Join RSO failed:", err);
  });
}


function fetchAndDisplayEvents(userId) {
  fetch("http://knightsocial.space/php/getEvents.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: parseInt(userId) })
  })
  .then(res => res.json())
  .then(data => {

    console.log("Public Events:", data.public);
    console.log("RSO Events:", data.rso);

    displayEvents("public-events-list", data.public, "No public events.");
    displayEvents("rso-events-list", data.rso, "No RSO events.");
  })
  .catch(err => {
    console.error("Failed to load events:", err);
  });
}

function displayEvents(containerId, events, emptyMessage) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (events && events.length > 0) {
    events.forEach(event => {
      const div = document.createElement("div");
      div.className = "event-item";
      div.innerHTML = `
        <strong>${event.name}</strong><br />
        <span>${event.event_date} @ ${event.event_time}</span><br />
        <small><em>${event.description}</em></small><br />
        <span>📞 ${event.contact_phone || "N/A"} | 📧 ${event.contact_email || "N/A"}</span>
      `;
      container.appendChild(div);
    });
  } else {
    const div = document.createElement("div");
    div.className = "event-item";
    div.textContent = emptyMessage;
    container.appendChild(div);
  }
}


function doLogout() 
{
  localStorage.clear();
  window.location.href = "../../index.html";
} 