const urlBase = "http://knightsocial.space/php";
const extension = "php";


document.addEventListener('DOMContentLoaded', () => {
    const user_id = localStorage.getItem("user_id");
  

    const apiUrl = `${urlBase}/getUserRSOs.${extension}`;
  
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('RSOs:', data); // Log the data to the console
  
        const rsoSelect = document.getElementById('rso');
        if (!data || data.length === 0) {
          console.error('No RSOs found or error in the response');
          return;
        }
  
        
        rsoSelect.innerHTML = '<option value="">Select an RSO</option>';
  
        // Populate dropdown with RSOs
        data.forEach((rso) => {
          const option = document.createElement('option');
          option.value = rso.rso_id;
          option.textContent = rso.name;
          rsoSelect.appendChild(option);
        });
      })
      .catch((error) => console.error('Error fetching RSOs:', error));
  });