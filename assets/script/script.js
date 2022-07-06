/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city ✅
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index ===✅
WHEN I view the UV index ✅
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe ✅
WHEN I view future weather conditions for that city ✅
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity ✅
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/
//Declare variables
const apiKey = 'dab6c26050c6340b4ec6ae2e98ef076c';
var todayWeather = $('.weather-today');
var today = moment().format('MM/DD/YY');
var fiveDayEl = $('.five-day-container');
var searchListEl = $('.list-group');
var cityArr = [];

$(document).ready(function () {
  var storedCities = JSON.parse(localStorage.getItem('cities'));

  if (storedCities.length > 0) {
    var prevCity = storedCities.length[storedCities.length - 1];
    getToday(prevCity);
    //cityArr = storedCities;

  }
})

function getToday(city) {
  //Display today's weather
  // event.preventDefault();
  const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
  fetch(queryURL, {
    method: 'GET',
  })
    .then(function (response) {
      //console.log(response)
      return response.json();
    })
    .then(function (data) {
      //console.log(data);

      var currentCityInfo = `
      <h2>${data.name} (${today}) <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt='weather icon'></h2>
      <p>🌡 Temperature: ${Math.round(((data.main.temp - 273.15) * 9 / 5) + 32)} ºF</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind speed: ${data.wind.speed} mph</p>`;

      //changed from .append to .html so that info would not keep occuring on the page every time search entry is submitted. 
      todayWeather.html(currentCityInfo);
      var latitude = data.coord.lat;
      var longitude = data.coord.lon;

      //Passing coordinates into api url for getting 5 cay forecast
      getForecast(latitude, longitude);

      //Getting the UV Index information for current day
      var uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

      fetch(uvURL, {
        method: 'GET',
      })
        .then(function (response) {
          //console.log(response)
          return response.json();
        })
        .then(function (data) {
          //console.log(data);
          var uvIndex = data.current.uvi
          //console.log(uvIndex)

          if (uvIndex < 3) {
            todayWeather.append(`<p>☀ UV Index: <span class='bg-green'>${uvIndex} Low risk </span></p>`)
          } else if (uvIndex < 6) {
            todayWeather.append(`<p>☀ UV Index: <span class='bg-yellow'>${uvIndex} Moderate risk</span></p>`)
          } else if (uvIndex < 8) {
            todayWeather.append(`<p>☀ UV Index: <span class='bg-orange'>${uvIndex} High risk</span></p>`)
          } else if (uvIndex < 11) {
            todayWeather.append(`<p>☀ UV Index: <span class='bg-red'>${uvIndex} Very High risk</span></p>`)
          } else {
            todayWeather.append(`<p>☀ UV Index: <span class='bg-purple'>${uvIndex} Extreme risk</span></p>`)
          }
        })
    })
}

function getForecast(latitude, longitude) {
  // event.preventDefault();

  //Five day forecast
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`

  fetch(fiveDayUrl, {
    method: 'GET',
  })
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      fiveDayEl.html(`<h3>5 Day Forecast</h3>`);

      for (var i = 1; i < data.daily.length - 2; i++) {
        var dayForecast = `
            <div class="card card-body forecast-card col-2">
              <h5 class="card-title">${moment.unix(data.daily[i].dt).format('MM/DD/YY')}</h5>
              <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt='weather icon'>
              <p class="card-text">Temperature: ${Math.round(data.daily[i].temp.day)} ºF</p>
              <p class="card-text">Wind speed: ${data.daily[i].wind_speed} mph</p>
              <p class="card-text">Humidity: ${data.daily[i].humidity} %</p>
            </div>`

        fiveDayEl.append(dayForecast);
        console.log(fiveDayEl)
      }
    })
}

//first loading document, check local storage (getItem); document.ready function()...

//Add city search to list and save to local storage
var citySearch = (e) => {
  e.preventDefault()

  // cityArr.push(city);
  // console.log(searchHistory);
  let city = $('.city-input').val().trim();

  getToday(city);

  if (!cityArr.includes(city)) {

    cityArr.push(city);
    var cityList = `
    <button type="button" class="list-group-item prev-cities"
      aria-current="true">
      ${city}
    </button>`;
    searchListEl.append(cityList);
  }
  localStorage.setItem('cities', JSON.stringify(cityArr))
}

//Loads current weather and five day forecast when user clicks on saved city
$(document).on("click", ".prev-cities", function () {
  var listCity = $(this).text();
  getToday(listCity);
});


//Event Listener for search button
var searchBtn = $('.search-btn');
searchBtn.click(citySearch);