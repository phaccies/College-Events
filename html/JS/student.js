


//RENDERING LOOP
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

  //loads the event comments
  loadEventComments(event.event_id);
 
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
        <span>📞 ${event.contact_phone || "N/A"} | 📧 ${event.contact_email || "N/A"}</span><br />

        <button class="toggle-comments-btn" onclick="toggleComments(${event.event_id}, this)">View Comments</button>

        <div class="comments-section" id="comments-for-${event.event_id}" style="display: none;">
          <h5>Comments</h5>
          <ul class="comments-list"></ul>

          <div class="add-comment">
            <textarea id="comment-${event.event_id}" placeholder="Write a comment..."></textarea>
            <select id="rating-${event.event_id}">
              <option value="">Rate the event</option>
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
            <button onclick="submitComment(${event.event_id})">Submit</button>
          </div>
        </div>
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


function toggleComments(eventId, btn) {
  const section = document.getElementById(`comments-for-${eventId}`);
  const isHidden = section.style.display === "none";

  section.style.display = isHidden ? "block" : "none";
  btn.textContent = isHidden ? "Hide Comments" : "View Comments";

  if (isHidden) {
    loadEventComments(eventId); // Only load when showing
  }
}


function loadEventComments(eventId) {
  const user_id = parseInt(localStorage.getItem("user_id"));

  fetch("http://knightsocial.space/php/getEventComments.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId })
  })
    .then(res => res.json())
    .then(data => {
      const list = document.querySelector(`#comments-for-${eventId} .comments-list`);
      list.innerHTML = "";

      if (!data.comments || data.comments.length === 0) {
        list.innerHTML = "<li><em>No comments yet.</em></li>";
        return;
      }

      data.comments.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${comment.user_name}</strong> rated ${comment.rating}/5<br />
          <span class="comment-text">${comment.comment}</span><br />
          <small>${new Date(comment.created_at).toLocaleString()}</small>
          ${
            comment.user_id == user_id
              ? `
            <br>
            <button  class="edit-btn" onclick="startEditComment(${comment.comment_id}, '${comment.comment}', ${comment.rating}, ${eventId})">✏️ Edit</button>
            <button onclick="deleteComment(${comment.comment_id}, ${eventId})">🗑 Delete</button>
            `
              : ""
          }
        `;
        list.appendChild(li);
      });
    })
    .catch(err => console.error("Error loading comments:", err));
}

function submitComment(eventId) {
  const comment = document.getElementById(`comment-${eventId}`).value.trim();
  const rating = document.getElementById(`rating-${eventId}`).value;

  if (!comment || !rating) {
    alert("Please enter a comment and a rating.");
    return;
  }

  const user_id = parseInt(localStorage.getItem("user_id")); // or session logic
  if (!user_id) {
    alert("You must be logged in to comment.");
    return;
  }

  const payload = {
    event_id: eventId,
    user_id: user_id,
    comment: comment,
    rating: parseInt(rating)
  };

  fetch("http://knightsocial.space/php/addEventComment.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Comment added!");
      // reload the comments
      loadEventComments(eventId, `public-comments-for-${eventId}`); 
    } else {
      alert("Failed to add comment.");
    }
  })
  .catch(err => {
    console.error(err);
    alert("An error occurred.");
  });
}

function deleteComment(commentId, eventId) {
  const user_id = parseInt(localStorage.getItem("user_id"));

  if (!confirm("Are you sure you want to delete this comment?")) return;

  fetch("http://knightsocial.space/php/deleteEventComment.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment_id: commentId, user_id: user_id })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Comment deleted.");
        loadEventComments(eventId); // reload list
      } else {
        alert("Error deleting comment.");
      }
    })
    .catch(err => console.error("Error:", err));
}

function startEditComment(commentId, commentText, rating, eventId) {
  const list = document.querySelector(`#comments-for-${eventId} .comments-list`);
  const li = [...list.children].find(li => li.innerHTML.includes(`startEditComment(${commentId}`));
  
  if (!li) return;

  li.innerHTML = `
  <div class="edit-comment-form">
    <textarea id="edit-comment-${commentId}">${commentText}</textarea><br/>
    <select id="edit-rating-${commentId}">
      <option value="1" ${rating == 1 ? "selected" : ""}>⭐ 1</option>
      <option value="2" ${rating == 2 ? "selected" : ""}>⭐⭐ 2</option>
      <option value="3" ${rating == 3 ? "selected" : ""}>⭐⭐⭐ 3</option>
      <option value="4" ${rating == 4 ? "selected" : ""}>⭐⭐⭐⭐ 4</option>
      <option value="5" ${rating == 5 ? "selected" : ""}>⭐⭐⭐⭐⭐ 5</option>
    </select><br/>
    <button onclick="submitEditComment(${commentId}, ${eventId})">💾 Save</button>
    <button class="cancel-btn" onclick="loadEventComments(${eventId})">❌ Cancel</button>
  </div>
`;
}

function submitEditComment(commentId, eventId) {
  const comment = document.getElementById(`edit-comment-${commentId}`).value.trim();
  const rating = document.getElementById(`edit-rating-${commentId}`).value;
  const user_id = parseInt(localStorage.getItem("user_id"));

  if (!comment || !rating) {
    alert("Please enter both comment and rating.");
    return;
  }

  fetch("http://knightsocial.space/php/editEventComment.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment_id: commentId, user_id: user_id, comment: comment, rating: parseInt(rating) })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Comment updated.");
        loadEventComments(eventId);
      } else {
        alert("Failed to update comment.");
      }
    })
    .catch(err => console.error("Edit error:", err));
}

function doLogout() 
{
  localStorage.clear();
  window.location.href = "../../index.html";
} 
