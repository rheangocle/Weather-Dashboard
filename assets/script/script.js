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
let city = $('.city-input').val().trim();
const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
var todayWeather = $('.weather-today');
var today = moment().format('MM/DD/YY');
var fiveDayEl = $('.five-day-container');
var searchListEl = $('.city-searches');

function getToday() {
  //Display today's weather
  // event.preventDefault();
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
      <h2>${data.name} (${today}) <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt='weather icon' width='70' height='70'></h2>
      <p>🌡 Temperature: ${Math.round(((data.main.temp - 273.15) * 9 / 5) + 32)} ºF</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind speed: ${data.wind.speed} mph</p>`;

      //changed from .append to .html so that info would not keep occuring on the page every time search entry is submitted. 
      todayWeather.html(currentCityInfo);
      var latitude = data.coord.lat;
      var longitude = data.coord.lon;

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

function getForecast() {
  // event.preventDefault();
  var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${apiKey}`;
  var latLon = [];

  fetch(geoURL, {
    method: 'GET',
  })
    .then(function (response) {
      //console.log(response)
      return response.json();
    })
    .then(function (latLonData) {
      //console.log(latLonData);
      var arr = latLonData
      latLon.push(arr[0].lat);
      latLon.push(arr[0].lon);
      //console.log(latLon)

      //Five day forecast
      var fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLon[0]}&lon=${latLon[1]}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`
      // `https://api.openweathermap.org/data/2.5/forecast?lat=${latLon[0]}&lon=${latLon[1]}&units=imperial&appid=${apiKey}`

      fetch(fiveDayUrl, {
        method: 'GET',
      })
        .then(function (response) {
          console.log(response)
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          //changed from append to html so that the info would not repopulate on page after every submit button
          fiveDayEl.html(`<h3>5 Day Forecast</h3>`);

          for (var i = 1; i < data.daily.length - 2; i++) {
            var dayForecast = `
            <div class="card card-body forecast-card col-2">
              <h5 class="card-title">${moment.unix(data.daily[i].dt).format('MM/DD/YY')}</h5>
              <img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt='weather icon' width='90' height='90'>
              <p class="card-text">Temperature: ${Math.round(data.daily[i].temp.day)} ºF</p>
              <p class="card-text">Wind speed: ${data.daily[i].wind_speed} mph</p>
              <p class="card-text">Humidity: ${data.daily[i].humidity} %</p>
            </div>`

            fiveDayEl.append(dayForecast);
            console.log(fiveDayEl)
          }

          // var firstDayForecast = `
          //   <div class="card card-body forecast-card col-2">
          //     <h5 class="card-title">${moment.unix(data.daily[1].dt).format('MM/DD/YY')}</h5>
          //     <img src="https://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}.png" alt='weather icon' width='80' height='80'>
          //     <p class="card-text">Temperature: ${Math.round(data.daily[1].temp.day)} ºF</p>
          //     <p class="card-text">Wind speed: ${data.daily[1].wind_speed} mph</p>
          //     <p class="card-text">Humidity: ${data.daily[1].humidity} %</p>
          //   </div>`
          // //console.log(`${moment.unix(data.daily[1].dt).format('MM/DD/YY')}`);

          // fiveDayEl.append(firstDayForecast);
          // var secondDayForecast = `
          //   <div class="card card-body forecast-card col-2">
          //     <h5 class="card-title">${moment.unix(data.daily[2].dt).format('MM/DD/YY')}</h5>
          //     <img src="https://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}.png" alt='weather icon' width='80' height='80'>
          //     <p class="card-text">Temperature: ${Math.round(data.daily[2].temp.day)} ºF</p>
          //     <p class="card-text">Wind speed: ${data.daily[2].wind_speed} mph</p>
          //     <p class="card-text">Humidity: ${data.daily[2].humidity} %</p>
          //   </div>`

          // fiveDayEl.append(secondDayForecast);

          // var thirdDayForecast = `
          //   <div class="card card-body forecast-card col-2">
          //     <h5 class="card-title">${moment.unix(data.daily[3].dt).format('MM/DD/YY')}</h5>
          //     <img src="https://openweathermap.org/img/wn/${data.daily[3].weather[0].icon}.png" alt='weather icon' width='80' height='80'>
          //     <p class="card-text">Temperature: ${Math.round(data.daily[3].temp.day)} ºF</p>
          //     <p class="card-text">Wind speed: ${data.daily[3].wind_speed} mph</p>
          //     <p class="card-text">Humidity: ${data.daily[3].humidity} %</p>
          //   </div>`

          // fiveDayEl.append(thirdDayForecast);
          // var fourDayForecast = `
          //   <div class="card card-body forecast-card col-2">
          //     <h5 class="card-title">${moment.unix(data.daily[4].dt).format('MM/DD/YY')}</h5>
          //     <img src="https://openweathermap.org/img/wn/${data.daily[4].weather[0].icon}.png" alt='weather icon' width='80' height='80'>
          //     <p class="card-text">Temperature: ${Math.round(data.daily[4].temp.day)} ºF</p>
          //     <p class="card-text">Wind speed: ${data.daily[4].wind_speed} mph</p>
          //     <p class="card-text">Humidity: ${data.daily[4].humidity} %</p>
          //   </div>`

          // fiveDayEl.append(fourDayForecast);
          // var fiveDayForecast = `
          //   <div class="card card-body forecast-card col-2">
          //     <h5 class="card-title">${moment.unix(data.daily[5].dt).format('MM/DD/YY')}</h5>
          //     <img src="https://openweathermap.org/img/wn/${data.daily[5].weather[0].icon}.png" alt='weather icon' width='80' height='80'>
          //     <p class="card-text">Temperature: ${Math.round(data.daily[5].temp.day)} ºF</p>
          //     <p class="card-text">Wind speed: ${data.daily[5].wind_speed} mph</p>
          //     <p class="card-text">Humidity: ${data.daily[5].humidity} %</p>
          //   </div>`

          // fiveDayEl.append(fiveDayForecast);
        })

    })
}

//Set up local storage


//Add city search to list
function citySearch(e) {
  e.preventDefault

  var cityArr = [];
  // cityArr.push(city);
  // console.log(searchHistory);
  getToday();
  getForecast();
  if (!cityArr.includes(city)) {
    var cityList = `
    <div class="list-group">
      <button type="button" class="list-group-item list-group-item-action active prev-cities"
        aria-current="true">
        ${city}
      </button>
    </div>`
    searchListEl.append(cityList);
    cityArr.push(city);
  }
  //need to add code to check if city is duplicate and remove it, need to add list of searched cities to local storage

  localStorage.setItem('city', JSON.stringify(cityArr))
  console.log(cityArr)
}

//Event Listener for submit button
var searchBtn = $('.search-btn');
// searchBtn.click(getToday);
// searchBtn.click(getForecast);
searchBtn.click(citySearch);