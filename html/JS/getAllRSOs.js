
const urlBase = "http://knightsocial.space/php";
const extension = "php";


function fetchRSOs(userId) {
    fetch(`${urlBase}/getAllRSOs.${extension}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.rsos) {
        console.log("RSOs:", data.rsos);
        // You can now render these to the dashboard
      } else {
        console.error("Error:", data.error);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
  }