/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

const apiKey = 'dab6c26050c6340b4ec6ae2e98ef076c';
let city = $('.city-input').val().trim();
const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
var todayWeather = $('.weather-today');
var today = moment().format('MM/DD/YY');

function getApi() {
  //Display today's weather
  fetch(queryURL, {
    method: 'GET',
  })
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var currentCityInfo = `
      <h2>${data.name} (${today}) <span><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt='weather icon' width='70' height='70'></span></h2>
      <p>🌡 Temperature: ${Math.round(((data.main.temp - 273.15) * 9 / 5) + 32)} ºF</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind speed: ${data.wind.speed} mph</p>`;

      todayWeather.append(currentCityInfo);

      uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&appid=${apiKey}`;
      
      fetch(uvURL, {
        method: 'GET',
      })
        .then(function (response) {
          console.log(response)
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          
          todayWeather.append(`<p>☀ UV Index: ${data.current.uvi}</p>`);
        })


    })

  



}
// $.ajax({
//   url: queryURL,
//   method: 'GET',
// }).then(function (response) {
//   console.log('Ajax Reponse \n-------------');
//   console.log(response);
//   // success: function( result ) {
//   //   $( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );
//   // }
// });


//Event Listener for submit button
var searchBtn = $('.search-btn');
searchBtn.click(getApi);