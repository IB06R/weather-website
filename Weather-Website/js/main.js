document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('countrySelect');
  const getWeatherButton = document.getElementById('getWeatherButton');
  const clearButton = document.getElementById('clearButton');
  const weatherDataContainer = document.getElementById('weatherData');

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
// const currentWeatherItemsEl = document.getElementById('current-weather-items');
// const timezone = document.getElementById('time-zone');
// const countryEl = document.getElementById('country');
// const weatherForecastEl = document.getElementById(weather=forecast);

const days = ['Sunady', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday']
  const months = ['January', 'Febraury', 'March', 'April', 'May', 'June',
    'July', 'August', 'Sepetember', 'October', 'November', 'December']
setInterval(() =>{
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn24HrFormat = hour >= 13 ? hour %24: hour
  const minutes = time.getMinutes();
  const ampm = hour >=12 ? 'PM' : 'AM'

  timeEl.innerHTML = hoursIn24HrFormat + ':' + minutes+ ' ' + `<span
  id="am-pm">${ampm}</span>`

  dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

// Fetch and load the country coordinates from CSV
fetch('city_coordinates.csv')
  .then(response => response.text())
  .then(data => {
    // Parse CSV using PapaParse library
    Papa.parse(data, {
      header: true, // First row is treated as headers
      skipEmptyLines: true, // Skip any empty lines
      complete: function(results) {
        populateCountryDropdown(results.data);
      }
    });
  })
  .catch(error => {
    console.error("Error loading the CSV file:", error);
  });

// Populate dropdown with cities and countries from CSV
function populateCountryDropdown(locations) {
  const countrySelect = document.getElementById("countrySelect");

  locations.forEach(location => {
    const option = document.createElement("option");
    option.value = `${location.latitude},${location.longitude}`;  // Access latitude and longitude
    option.text = `${location.city}, ${location.country}`; // Access city and country
    countrySelect.appendChild(option);
  });
}

function getWeather() {
    // Get selected location coordinates
    const selectedLocation = document.getElementById("countrySelect").value;
  
    if (!selectedLocation) {
      alert("Please select a location.");
      return;
    }
  
    const [lat, lon] = selectedLocation.split(',');
  
    // Show loader while fetching weather data
    const loader = document.getElementById("loader");
    loader.style.display = "block";
  
    // 7Timer API URL using the "civil" product with dynamic coordinates
    const apiUrl = `http://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&lang=en&unit=metric&output=json&tzshift=0`;
    ;
    
    // Fetch weather data from the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        loader.style.display = "none";  // Hide loader once data is ready
        console.log(data); // For debugging purposes
        displayWeather(data); // Display weather data
      })
      .catch(error => {
        loader.style.display = "none";  // Hide loader even if there's an error
        console.error("Error fetching data:", error);
        document.getElementById("weatherData").innerHTML = "<p>Failed to retrieve weather data. Please try again.</p>";
      });
  }
  

function displayWeather(data) {
  const weatherDiv = document.getElementById("weatherData");
  weatherDiv.innerHTML = "";

  if (data.dataseries && data.dataseries.length > 0) {
    data.dataseries.slice(0, 7).forEach((weather, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

      const highTemp = weather.temp2m.max;
      const lowTemp = weather.temp2m.min;
      const weatherCondition = weather.weather;

      // Determine the appropriate weather icon based on the weather condition
      let weatherIcon = '';
      switch (weatherCondition) {
        case 'clear':
          weatherIcon = 'images/clear.png';
          break;
        case 'cloudy':
          weatherIcon = 'images/cloudy.png';
          break;
        case 'fog':
          weatherIcon = 'images/fog.png';
          break;
          case 'humid':
          weatherIcon = 'images/humid.png';
          break;
          case 'ishower':
          weatherIcon = 'images/ishower.png';
          break;
          case 'lightrain':
          weatherIcon = 'images/lightrain.png';
          break;
          case 'lightsnow':
          weatherIcon = 'images/lightsnow.png';
          break;
          case 'mcloudy':
          weatherIcon = 'images/mcloudy.png';
          break;
          case 'oshower':
          weatherIcon = 'images/oshower.png';
          break;
          case 'pcloudy':
          weatherIcon = 'images/pcloudy.png';
          break;
          case 'rain':
          weatherIcon = 'images/rain.png';
          break;
          case 'rainsnow':
          weatherIcon = 'images/rainsnow.png';
          break;
          case 'snow':
          weatherIcon = 'images/snow.png';
          break;
          case 'tsrain':
          weatherIcon = 'images/tsrain.png';
          break;
          case 'tstorm':
          weatherIcon = 'images/tstorm.png';
          break;
          case 'windy':
          weatherIcon = 'images/windy.png';
          break;
        // Add more cases as needed   
        default:
          weatherIcon = '❓';
      }

      // Log the weather icon path for debugging
      console.log(`Weather icon path: ${weatherIcon}`);

 
      // Append each weather data point to the weatherDiv
      weatherDiv.innerHTML += `
        <div class="weather-day">
          <h4>${day}</h4>
          <p>${dateString}</p>
           <img src="${weatherIcon}" alt="${weatherCondition}" class="weather-icon">
           <div class="weather-condition">${weatherCondition}</div>
          <p><strong>High:</strong> ${highTemp !== undefined ? highTemp : 'N/A'} °C</p>
          <p><strong>Low:</strong> ${lowTemp !== undefined ? lowTemp : 'N/A'} °C</p>
          
        </div>
      `;
    });


    weatherDiv.classList.add('show'); // Add show class to fade in
    weatherDiv.style.display = 'flex'; // Show the weather container
  } else {
    weatherDiv.innerHTML = "<p>No weather data available for this location.</p>";
    weatherDiv.classList.add('show');
    weatherDiv.style.display = 'flex'; // Show the weather containe
  }
}

function clearWeather() {
  countrySelect.value = ""; // Reset the selector
  weatherDataContainer.innerHTML = ""; // Clear the weather data
  weatherDataContainer.style.display = "none"; // Hide the weather container
}

getWeatherButton.addEventListener("click", getWeather);
    clearButton.addEventListener("click", clearWeather); // Add event listener for the Clear button
});


// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("getWeatherButton").addEventListener("click", getWeather);
//   document.getElementById("clearButton").addEventListener("click", clearWeather);
// });

