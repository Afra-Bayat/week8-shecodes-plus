//updating date and time
function updatingTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentTime.getDay()];
  let year = currentTime.getFullYear();
  let month = currentTime.getMonth() + 1;
  let dates = currentTime.getDate();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let currentWeekday = document.querySelector("#weekday");
  currentWeekday.innerHTML = day;
  let currentDate = document.querySelector("#date");
  currentDate.innerHTML = `${year}/${month}/${dates}`;
  let currentminutes = document.querySelector("#minutes");
  if (minutes > 9) {
    currentminutes.innerHTML = minutes;
  } else {
    currentminutes.innerHTML = `0${minutes}`;
  }
  let currentHours = document.querySelector("#time");
  let currentDaytime = document.querySelector("#daytime");
  if (hours > 12 && hours - 12 > 10) {
    currentHours.innerHTML = hours - 12;
    currentDaytime.innerHTML = "pm";
  } else if (hours > 12 && hours - 12 <= 9) {
    currentHours.innerHTML = `0${hours - 12}`;
    currentDaytime.innerHTML = "pm";
  } else if (hours < 9) {
    currentHours.innerHTML = `0${hours}`;
    currentDaytime.innerHTML = "am";
  } else {
    currentHours.innerHTML = hours;
    currentDaytime.innerHTML = "am";
  }
}
let currentTime = new Date();
updatingTime(currentTime);

//updating weather
function predictCurrentweather(response) {
  let currentWeather = document.querySelector("header .current-weather");
  currentWeather.innerHTML = response.data.weather[0].description;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  let highTemp = document.querySelector("#high-temp");
  highTemp.innerHTML = Math.round(response.data.main.temp_max);
  let lowTemp = document.querySelector("#low-temp");
  lowTemp.innerHTML = Math.round(response.data.main.temp_min);
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = Math.round(response.data.main.humidity);
  let feelingTemp = document.querySelector("#feeling-temp");
  feelingTemp.innerHTML = Math.round(response.data.main.feels_like);
  let city = document.querySelector(".city-name");
  city.innerHTML = response.data.name;
  celsiusTemp = response.data.main.temp;
  let currentWeatherIcon = document.querySelector("#current-weather-img");
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIcon.setAttribute("alt", response.data.weather[0].icon);
  getForecast(response.data.coord);
}

//updating heading
function updatingHeading(event) {
  event.preventDefault();
  let cityEntry = document.querySelector("#city-entry");
  let city = document.querySelector(".city-name");
  city.innerHTML = cityEntry.value;
  let apiKey = "d84bc80a567f5fbbdba41bbd38db2736";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  let cityLocation = cityEntry.value;
  axios
    .get(`${apiEndpoint}?q=${cityLocation}&appid=${apiKey}&units=${unit}`)
    .then(predictCurrentweather);
}
let locationEntryForm = document.querySelector("#city-enquery-form");
locationEntryForm.addEventListener("submit", updatingHeading);

//predicting current location weather
function predictionCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "d84bc80a567f5fbbdba41bbd38db2736";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  axios
    .get(`${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(predictCurrentweather);
}

function showPosition(event) {
  event.preventDefault;
  navigator.geolocation.getCurrentPosition(predictionCurrentLocation);
}
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showPosition);

//changing temperature unit
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32.5;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}
let celsiusTemp = null;
let fahrenheitLink = document.querySelector("#fahrenheit-icon");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}
let celsiusLink = document.querySelector("#celsius-icon");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//receiving forecast  API data
function getForecast(coordinates) {
  let apiKey = "d84bc80a567f5fbbdba41bbd38db2736";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecat);
}

//display forecast
function formatDay(timestamp) {
  let dateTime = new Date(timestamp * 1000);
  let day = dateTime.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatDate(time) {
  let dateTime = new Date(time * 1000);
  let month = dateTime.getMonth() + 1;
  let date = dateTime.getDate();
  return month + "/" + date;
}

function displayForecat(response) {
  //update hourly forecast
  let hourForecast = response.data.hourly;
  //update timeline forecast
  let timeLineHTML = `<div class="row">`;
  let timeLineElement = document.querySelector(".timeline");
  let tempTimelineHTML = `<div class="row">`;
  let tempTimelineElement = document.querySelector(".tempTimeline");
  hourForecast.forEach(function displayHourlyForecast(timeline, index) {
    if (index < 10) {
      let newTime = new Date(timeline.dt * 1000);
      let newHour = newTime.getHours();
      let timeLineTemp = Math.round(timeline.temp);
      if (newHour > 12 && newHour - 12 >= 10) {
        newHour = `${newHour - 12} pm`;
      } else if (newHour > 12 && newHour - 12 <= 9) {
        newHour = `0${newHour - 12} pm`;
      } else if (newHour < 9) {
        newHour = `0${newHour} am`;
      } else {
        newHour = `${newHour} am`;
      }
      timeLineHTML = timeLineHTML + `<div class="col">${newHour}</div>`;
      tempTimelineHTML =
        tempTimelineHTML + `<div class="col">${timeLineTemp}</div>`;
    }
  });
  timeLineHTML = timeLineHTML + `</div>`;
  tempTimelineHTML = tempTimelineHTML + `</div>`;
  timeLineElement.innerHTML = timeLineHTML;
  tempTimelineElement.innerHTML = tempTimelineHTML;

  //update daily forecast
  let forecast = response.data.daily;
  let forcastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row" id="card">`;
  forecast.forEach(function forecast(forecastDay, index) {
    if (index >= 1 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                        <div class="card">
                            <img src="http://openweathermap.org/img/wn/${
                              forecastDay.weather[0].icon
                            }@2x.png" class="card-img-top first-prediction" alt="cloudy" />
                            <div class="card-body">
                                <p class="card-text">${Math.round(
                                  forecastDay.temp.min
                                )}°/<strong>${Math.round(
          forecastDay.temp.max
        )}</strong><br/><span id="day">${formatDay(
          forecastDay.dt
        )}</span> <br/> <span id="forecast-date">${formatDate(
          forecastDay.dt
        )} </span>
                                </p>
                            </div>
                        </div>
                    </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forcastElement.innerHTML = forecastHTML;
}
