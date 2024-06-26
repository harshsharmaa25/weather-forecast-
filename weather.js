
// This API key is presumably used to authenticate requests to the OpenWeatherMap API

const myAPIKey = "ebdb3695b905d0fc969627b569f11f36";

// This line declares a constant named apiUrl and assigns it a string value representing the base URL of the OpenWeatherMap API. This URL will be used to construct specific API endpoints for different weather data requests

const apiUrl = "https://api.openweathermap.org/data/2.5";

// This element is presumably a form element used for city search.

const form = document.querySelector("#search-form");

// This element is presumably a button used for submitting the city search form.


const button = document.querySelector("#search-button");

form.addEventListener("submit", handleCitySearch);
button.addEventListener("click", handleCitySearch);

// this function handles a city search event by preventing default behavior, extracting the city name from the input field, retrieving its coordinates, and then clearing the input field.

function handleCitySearch(event) {
  event.preventDefault();
  const input = document.querySelector("#search-input");
  // trims whitespaces from the input value and assigns it to cityName variable
  const cityName = input.value.trim();
  if (cityName.length > 0) {
    getCoordinates(cityName);
    // sets the value of the input element to an empty string
    input.value = "";
  }
}

// Function to handle the click event on the "Use Current Location" button
document.getElementById("use-current-location").addEventListener("click", function() {
  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {
      // If supported, get the current position
      navigator.geolocation.getCurrentPosition(function(position) {
          // Extract latitude and longitude from the position object
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // Call the function to fetch weather data by coordinates
          getWeatherDataByCoordinates(lat, lon);
      });
  } else {
      // If geolocation is not supported, display an alert to the user
      alert("Geolocation is not supported by this browser.");
  }
});

// Function to fetch weather data by coordinates
function getWeatherDataByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myAPIKey}`;
  $.ajax({
      method: "GET",
      url: url,
  }).then(function(response) {
      if (response.cod == 200) {
          const cityName = response.name;
          // Call the function to get weather data and update UI
          getWeatherData(lat, lon, cityName);
      } else {
          console.log("Unable to get weather data!");
      }
  });
}


// this function dynamically generates buttons for each city in the search history and displays them on the webpage, allowing users to easily revisit previous searches by clicking on these buttons.

function loadCityHistory() {
  let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
  let historyDropdown = document.querySelector("#history");
  let dropdownContent = `<select class="form-select mb-3" onchange="searchCity(this.value)">`;

  for (let i = 0; i < cityHistory.length; i++) {
    const city = cityHistory[i];
    dropdownContent += `<option value="${city}">${city}</option>`;
  }
  dropdownContent += `</select>`;
  historyDropdown.innerHTML = dropdownContent;
}

loadCityHistory();




// function that constructs the URL for the OpenWeatherMap API request
function searchCity(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myAPIKey}`;
  $.ajax({
    method: "GET",
    url: url,
    // checks if the "code" is equal to 200 (success)
  }).then(function (response) {
    if (response.cod == 200) {
      // if the city was found, extracts the lat and lon from the response object
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      getWeatherData(lat, lon, cityName);
    } else {
      console.log("City not found");
    }
  });
}





// function that gets the weather data
function getWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myAPIKey}`;

  $.ajax({
    method: "GET",
    url: url,
  }).then(function (response) {
    if (response.cod == 200) {
      updateCityWeather(response);
      loadCityHistory();
    } else {
      console.log("Unable to get weather data!");
    }
  });
}

// function that updates the 5 days forecast for the searched cities
function updateCityWeather(data) {
  console.log(data);
  const cityName = data.city.name;
  // creates an object to get the current date and time
  const date = new Date();
  const iconUrl = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
  // gets the temperature from the object and converts it to Celsius
  const temp = (data.list[0].main.temp - 273.15).toFixed(2);
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  const todayForecast = document.querySelector("#today");

  // updates dinamically the HTML content  with the weather data
  todayForecast.innerHTML = `
        <div class="w-100 border p-2" >
          <h2>${cityName} (${date.toLocaleDateString()})</h2>
          <img src = "${iconUrl}" alt = "${cityName}" style="width: 150px; height: auto; float: right">
          <p>Temperature: ${temp} &#8451;</p>
          <p>Wind Speed: ${windSpeed} KPH </p>
          <p>Humidity: ${humidity} %</p>
        </div>
      `;

  const daysForecast = document.querySelector("#forecast");
  daysForecast.innerHTML = `
    <div class="w-100 p-3">
      <h2 class="">5-Day Forecast:</h2>
    </div>

    <div class="col text-white ">
      <div class="bg-dark me-3 p-3">
        <h3>${moment(data.list[5].dt_txt).format("DD/MM/YYYY")}</h3>
        <img src = "https://openweathermap.org/img/w/${
          data.list[5].weather[0].icon
        }.png" alt="${moment(data.list[5].dt_txt).format("DD/MM/YYYY")}">
        <p>Temp: ${(data.list[5].main.temp - 273.15).toFixed(2)} &#8451;</p>
        <p>Wind: ${data.list[5].wind.speed} KPH </p>
        <p>Humidity: ${data.list[5].main.humidity} %</p>
      </div>
    </div>
    
     

    <div class="col text-white ">
      <div class="bg-dark me-3 p-3">
        <h3>${moment(data.list[13].dt_txt).format("DD/MM/YYYY")}</h3>
        <img src = "https://openweathermap.org/img/w/${
          data.list[13].weather[0].icon
        }.png" alt="${moment(data.list[13].dt_txt).format("DD/MM/YYYY")}">
        <p>Temp: ${(data.list[13].main.temp - 273.15).toFixed(2)} &#8451;</p>
        <p>Wind: ${data.list[13].wind.speed} KPH </p>
        <p>Humidity: ${data.list[13].main.humidity} %</p>
      </div>
    </div>

    <div class="col text-white ">
      <div class="bg-dark me-3 p-3">
        <h3>${moment(data.list[21].dt_txt).format("DD/MM/YYYY")}</h3>
        <img src = "https://openweathermap.org/img/w/${
          data.list[21].weather[0].icon
        }.png" alt="${moment(data.list[21].dt_txt).format("DD/MM/YYYY")}">
        <p>Temp: ${(data.list[21].main.temp - 273.15).toFixed(2)} &#8451;</p>
        <p>Wind: ${data.list[21].wind.speed} KPH </p>
        <p>Humidity: ${data.list[21].main.humidity} %</p>
      </div>
    </div>

    <div class="col text-white ">
      <div class="bg-dark me-3 p-3">
        <h3>${moment(data.list[29].dt_txt).format("DD/MM/YYYY")}</h3>
        <img src = "https://openweathermap.org/img/w/${
          data.list[29].weather[0].icon
        }.png" alt="${moment(data.list[29].dt_txt).format("DD/MM/YYYY")}">
        <p>Temp: ${(data.list[29].main.temp - 273.15).toFixed(2)} &#8451;</p>
        <p>Wind: ${data.list[29].wind.speed} KPH </p>
        <p>Humidity: ${data.list[29].main.humidity} %</p>
      </div>
    </div>
      
    <div class="col text-white ">
      <div class="bg-dark me-3 p-3">
        <h3>${moment(data.list[37].dt_txt).format("DD/MM/YYYY")}</h3>
        <img src = "https://openweathermap.org/img/w/${
          data.list[37].weather[0].icon
        }.png" alt="${moment(data.list[37].dt_txt).format("DD/MM/YYYY")}">
        <p>Temp: ${(data.list[37].main.temp - 273.15).toFixed(2)} &#8451;</p>
        <p>Wind: ${data.list[37].wind.speed} KPH </p>
        <p>Humidity: ${data.list[37].main.humidity} %</p>
      </div>
    </div>
  `;

  // updates the city history in local storage by adding the new city name to the start of the array
  let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

  //checks if the city searched is not found in the searched cities array
  if (cityHistory.indexOf(cityName) == -1) {
    cityHistory.unshift(cityName);

    // checks that only 5 most recent city names are stored
    if (cityHistory.length > 6) {
      cityHistory.pop();
    }
    // stores the updated city history in localStorage
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  }
}

// function that gets the coordinates from the api
function getCoordinates(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}`;
  $.ajax({
    method: "GET",
    url: url,
  }).then(function (response) {
    if (response.cod === 200) {
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      getWeatherData(lat, lon, city);
    } else {
      console.log("City not found");
    }
  });
}

function handleCitySearch(event) {
  event.preventDefault();
  const input = document.querySelector("#search-input");
  const cityName = input.value.trim();

  // Check if the input is empty
  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  // Check if the city name contains only letters and spaces
  if (!/^[a-zA-Z\s]+$/.test(cityName)) {
    alert("City name should contain only letters and spaces");
    return;
  }

  // Proceed with the search if input is valid
  getCoordinates(cityName);
  input.value = "";
}