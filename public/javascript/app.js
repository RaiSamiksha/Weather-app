// const { response } = require("express");

let weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const windElement = document.querySelector(".wind-speed");
const humidityElement = document.querySelector(".humidity");
const time = document.querySelector(".time");
const place = document.querySelector(".place");
const date = document.querySelector(".date");

const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);

date.textContent = currentDate.getDate() + ", " + monthName;

if ("geolocation" in navigator) {
  place.textContent = "Loading...";
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state;

            if (city) {
              showData(city);
            } else {
              console.error(
                "City, town, or village not found in location data."
              );
              place.textContent = "City not found";
            }
          } else {
            console.error("Address not found in location data.");
            place.textContent = "Location not found";
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          place.textContent = "Error fetching location";
        });
    },
    function (error) {
      console.error("Error getting location:", error.message);
      place.textContent = "Error getting location";
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
  place.textContent = "Geolocation not available";
}

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(search.value);
  place.textContent = "Loading....";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";
  showData(search.value);
});

function showData(city) {
  getweatherData(city, (result) => {
    console.log(result);
    if (result.cod == 200) {
      if (
        result.weather[0].description === "Rain" ||
        result.weather[0].description === "fog"
      ) {
        weatherIcon.className =
          "wi wi-day-" + result.weather[0].description.toLowerCase();
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      place.textContent = result?.name;
      tempElement.textContent =
        (result?.main?.temp - 273.5).toFixed(2) +
        String.fromCharCode(176) +
        "C";
      weatherCondition.textContent =
        result.weather[0]?.description?.toUpperCase();
      windElement.innerHTML = `<i class="wi wi-strong-wind"></i> Wind: ${result.wind.speed} m/s`;
      humidityElement.innerHTML = `<i class="wi wi-humidity"></i> Humidity: ${result.main.humidity} %`;
      const timezoneOffsetInSeconds = result.timezone;
      const localTime = new Date(Date.now() + timezoneOffsetInSeconds * 1000);
      let hours = localTime.getUTCHours().toString().padStart(2, "0");
      const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;

      const currentTime = `${hours}:${minutes} ${ampm}`;
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = daysOfWeek[localTime.getUTCDay()];
      if (time) {
        time.textContent = `${currentTime}, ${dayName}`;
      } else {
        console.warn("Time element not found.");
      }
    } else {
      place.textContent = "City not found";
    }
  });
}

function getweatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + city;
  fetch(locationApi).then((response) => {
    response.json().then((response) => {
      callback(response);
    });
  });
}
