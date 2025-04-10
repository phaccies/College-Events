// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
  
    if (!name || !role) {
      // Redirect to login if info is missing
      window.location.href = "/html/pages/login/index.html";
      return;
    }
  
    const userInfo = document.getElementById("user-info");
    userInfo.textContent = `Hello, ${name}! | Role: ${role}`;

    
  
    /*const roleText = document.querySelector("main > p");
    if (role === "admin") {
      roleText.textContent = "This is your admin dashboard. You can manage users and system settings.";
    } else if (role === "super_admin") {
      roleText.textContent = "This is your super admin dashboard. You have full system access.";
    } else {
      roleText.textContent = "This is your student dashboard. You can explore events, update your profile, and more!";
    } */
  }); 
  
  function openForm()
  {
    window.location.href = "../forms/addEvent.html";
  }

  function openRSOForm()
  {
    window.location.href = "../forms/addRSO.html";
  }

  function doLogout() 
  {
    localStorage.clear();
    window.location.href = "../../index.html";
  }

  const urlBase = "http://knightsocial.space/php";
const extension = "php";

function loadAdminRSOs() {
	const result = document.getElementById("rso-list");
	result.textContent = "";

	const user_id = localStorage.getItem("user_id");

	if (!user_id) {
		result.innerHTML = "<li>Error: User not logged in.</li>";
		return;
	}

	const payload = JSON.stringify({ user_id: parseInt(user_id) });

	fetch(`${urlBase}/getUserRSOs.${extension}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: payload
	})
	.then(res => res.json())
	.then(data => {
		// If there's an error message from backend
		if (data.error) {
			result.innerHTML = `<li>${data.error}</li>`;
			return;
		}

		// If data is not an array or is empty
		if (!Array.isArray(data) || data.length === 0) {
			result.innerHTML = "<li>No RSOs found.</li>";
			return;
		}

		// Populate the list with RSO names
		data.forEach(rso => {
			const item = document.createElement("li");
			item.textContent = rso.name;
			result.appendChild(item);
		});
	})
	.catch(err => {
		result.innerHTML = `<li>Fetch error: ${err.message}</li>`;
	});
}



document.addEventListener("DOMContentLoaded", loadAdminRSOs);

/* ------------------- */

// This function fetches all events created by the user
function getUserEvents() {
    const user_id = localStorage.getItem("user_id"); // Get the user_id from localStorage
    const eventListContainer = document.getElementById("eventList"); // The container where events will be displayed



    // Create the payload with the user_id
    const payload = JSON.stringify({ user_id });

    console.log("Fetching events for user_id:", user_id); // Debugging log

    // Make the API call to fetch user events
    fetch(`${urlBase}/getEventsCreated.${extension}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    })
    .then(res => {
        console.log("Response status:", res.status); // Check the status of the response
        return res.json();
    })
	.then(data => {
		console.log("Full data received:", data);
	
		if (data.error) {
			eventListContainer.innerHTML = `<p>${data.error}</p>`;
			return;
		}
	
		// Check for a nested array of events
		if (data.events && Array.isArray(data.events)) {
			data = data.events; // Extract events if nested under 'events'
		}
	
		if (Array.isArray(data)) {
			data.forEach(event => {
				const eventCard = createEventCard(event);
				eventListContainer.appendChild(eventCard);
			});
		} else {
			eventListContainer.innerHTML = "<p>Error: Data is not an array or does not contain events.</p>";
		}
	})
	
	
    .catch(err => {
        console.error("Error during fetch:", err); // More detailed error message
        eventListContainer.innerHTML = `Error: ${err.message}`;
    });
}


function createEventCard(event) {
    const card = document.createElement("div");
    card.classList.add("card");

    const rsoName = event.rso_name || "N/A"; // If RSO name is available, display it, else "N/A"
    const eventDate = new Date(event.event_date).toLocaleDateString(); // Format the date
    
    card.innerHTML = `
        <h3>${event.event_name}</h3> <!-- Use event.event_name here -->
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Privacy:</strong> ${event.privacy}</p>
        <p><strong>Location:</strong> ${event.location_name}</p>
        <p><strong>RSO:</strong> ${rsoName}</p>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Contact Email:</strong> ${event.contact_email}</p>
        <p><strong>Contact Phone:</strong> ${event.contact_phone}</p>
        <p><strong>Description:</strong> ${event.description}</p>
    `;

    return card;
}

// Call getUserEvents when the page loads
document.addEventListener("DOMContentLoaded", getUserEvents);

