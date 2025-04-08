const urlBase = "http://knightsocial.space/php";
const extension = "php";

console.log("addEvent.js loaded");
const user_id = localStorage.getItem("user_id");
const university_id = localStorage.getItem("university_id");

document.addEventListener('DOMContentLoaded', () => 
  {

    const apiUrl = `${urlBase}/getUserRSOs.${extension}`;
    
    // Fetch the RSOs available to the user
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



        
        data.forEach((rso) => {
          const option = document.createElement('option');
          option.value = rso.rso_id;
          option.textContent = rso.name;
          rsoSelect.appendChild(option);
        });
        
      })
      .catch((error) => console.error('Error fetching RSOs:', error));

    });


    function handleFormSubmit() {
      const eventName = document.getElementById("eventName").value;
      const eventCategory = document.getElementById("eventCategory").value;
      const rso = document.getElementById("rso").value;
      const description = document.getElementById("description").value;
      const eventDate = document.getElementById("eventDate").value;
      const eventTime = document.getElementById("eventTime").value;
      const locationName = document.getElementById("locationName").value;
      const latitude = document.getElementById("latitude").value;
      const longitude = document.getElementById("longitude").value;
      const contactPhone = document.getElementById("contactPhone").value;
      const contactEmail = document.getElementById("contactEmail").value;
      const address = document.getElementById("address").value; // Get address value
      
      // Get the selected privacy value from radio buttons
      const privacy = document.querySelector('input[name="privacy"]:checked').value; // 'public' or 'private'
      
      // Keep privacy as 'private' or 'public', no conversion to 'rso'
      const privacyValue = privacy; 
      
      // Call the addLocation function first
      addLocation(locationName, latitude, longitude, address) // Pass address
          .then(() => {
              // After adding the location successfully, call addEvent
              addEvent(eventName, eventCategory, privacyValue, description, eventDate, eventTime, locationName, rso, university_id, user_id, contactPhone, contactEmail);
          })
          .catch((error) => {
              alert("Error: " + error);
          });
  }
  
  // Function to add a location
  function addLocation(locationName, latitude, longitude, address) {
      return new Promise((resolve, reject) => {
          // Send a POST request to add the location
          fetch(`${urlBase}/location.${extension}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  lname: locationName,
                  latitude: latitude,
                  longitude: longitude,
                  address: address, // Add address here
              }),
          })
          .then((response) => response.json())
          .then((data) => {
              if (data.error) {
                  reject("Failed to add location: " + data.error);
              } else {
                  resolve();
              }
          })
          .catch((error) => reject("Network error: " + error));
      });
  }
  
  function addEvent(eventName, eventCategory, privacy, description, eventDate, eventTime, locationName, rso, university_id, user_id, contactPhone, contactEmail) {
      const eventData = {
          name: eventName,
          category: eventCategory,
          privacy: privacy,  // This will be 'private' or 'public' as selected
          description: description,
          event_date: eventDate,
          event_time: eventTime,
          location_name: locationName,
          rso_id: rso, 
          university_id: university_id, 
          created_by: user_id, 
          contact_phone: contactPhone,
          contact_email: contactEmail,
      };
  
      fetch(`${urlBase}/addEvent.${extension}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
      })
      .then((response) => {
          // Log the raw response text to see what is being returned
          return response.text().then((text) => {
              console.log('Response Text:', text); // Log the text response
              return JSON.parse(text);  // Try to parse it as JSON
          });
      })
      .then((data) => {
          if (data.error) {
              alert("Error adding event: " + data.error);
          } else {
              alert("Event added successfully!");
          }
      })
      .catch((error) => alert("Network error: " + error));
  }
  
