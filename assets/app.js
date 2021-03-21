// -------- [ Criteria ] -------- //
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// -------- [ End Of Criteria ] -------- //

// ----------------  Variables Section  ---------------- //

//Input box to search for a city
var $searchInput = $("#search-input");

//Input submit button to search for a city
var $searchBtn = $("#search-btn");

//global variable of the search term used in Search for A City input
var searchTerm = "";

//Div to display the searched city history
var $searchCityDiv = $("#search-city");

//Div to display the Current Day's Forecast
var $resultCurrent = $("#result-current");

//Div to display the 5-Day Forecast
var $resultForecast = $("#result-forecast");

//Array for the historical cities searched
var cities = ["test"];

//current day
var currentDay = moment().format("MM-DD-YYYY");
console.log(currentDay);

//url for api
var urlForecast, urlCurrent, formatedSearchTerm;

// ----------------  End of Variables Section  ---------------- //

// ----------------  Functions Section  ---------------- //

//Function to get the city input and execute weather search
function getSearchTerm() {
  event.preventDefault();

  //if the search term is not empty and is not in the list of cities then execute
  if ($searchInput.val() != "" && !cities.includes($searchInput.val())) {
    searchTerm = $searchInput.val();
    $searchInput.val("");

    // getWeatherForecast(urlForecast);
    getWeatherCurrent(urlCurrent);
    getWeatherForecast(urlForecast);
  } else {
    alert("Please Enter A Valid City Name");
  }
}

//function to call url for 5 day forecast by city name
function getWeatherForecast(urlForecast) {
  urlForecast =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    searchTerm +
    "&appid=1d4e06b70edabe539b04ef4010633116";
  $.ajax(urlForecast, {
    success: function (data) {
      console.log(data.list);
    },
    error: function () {
      alert("An error occurred");
    },
  });
}

//function to call url for current day's weather conditions by city name
function getWeatherCurrent(urlCurrent) {
  //sets the URL and concatenate with the user's input
  urlCurrent =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchTerm +
    "&appid=1d4e06b70edabe539b04ef4010633116&units=imperial";

  //uses jquery Ajax to fetch the data from API source
  $.ajax(urlCurrent, {
    success: function (data) {
      displayCurrent(data);
    },
    error: function () {
      alert("An error occurred");
    },
    // dataType: "json",
  });
}

//function to display the current weather conditions
function displayCurrent(data) {
  //display the header
  var headertext = searchTerm + " " + currentDay;
  var $h3 = $("<h3>").html(headertext);
  $h3.addClass("display");
  $resultCurrent.append($h3);

  //display temp
  statusText = "Status: " + data.weather[0].main;
  var $status = $("<div>").html(statusText);
  $status.addClass("display");
  $resultCurrent.append($status);

  //display temp
  tempText = "Temperature: " + data.main.temp + " °F";
  var $temp = $("<div>").html(tempText);
  $temp.addClass("display");
  $resultCurrent.append($temp);

  //display humidity
  humText = "Humidity: " + data.main.humidity + " %";
  var $hum = $("<div>").html(humText);
  $hum.addClass("display");
  $resultCurrent.append($hum);

  //display wind
  windText = "Wind Speed: " + data.wind.speed + " MPH";
  var $wind = $("<div>").html(windText);
  $wind.addClass("display");
  $resultCurrent.append($wind);

  //set border
  $resultCurrent.addClass("border border-primary");
}

// function updateSearchTerm(term) {
//   formatedSearchTerm = searchTerm.split();
//   searchTerm[0].toUpperCase;
// }
// ----------------  End Of Functions Section  ---------------- //

// ----------------  Event Listeners Section  ---------------- //

//listens for the search button to be clicked and executes getSearchTerm function
$searchBtn.on("click", getSearchTerm);

// ----------------  End of Event Listeners Section  ---------------- //
