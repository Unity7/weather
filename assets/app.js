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
//Div to display the 5-Day Forecast
var $resultForecastCard = $("#result-forecast-card");
var $resultForecastRow = $("#result-forecast-row");
//Array for the historical cities searched
var cities = [];

//current day
var currentDay = moment().format("MM-DD-YYYY");
var forecastDay = [];

//url for api
var urlForecast, urlCurrent, formatedSearchTerm, searchLat, searchLong;

// ----------------  End of Variables Section  ---------------- //

// ----------------  Functions Section  ---------------- //

//Function to get the city input and execute weather search // ****** GET USER INPUT & EXECUTE SEARCH ******
function getSearchTerm() {
  event.preventDefault();
  searchTerm = $searchInput.val();
  capitalString(searchTerm);
  //if the search term is not empty and is not in the list of cities then execute
  if ($searchInput.val() != "" && !cities.includes(formatedSearchTerm)) {
    cities.push(formatedSearchTerm);
    $searchInput.val("");

    getCoordinates(formatedSearchTerm);
    setLS();
    clearHistory();
    $removeAll();
    displayHistory(cities);
  } else {
    alert("Please Enter A Valid City Name");
  }
}

//Function to capitalize the first letter of a string
function capitalString(string) {
  formatedSearchTerm = string.charAt(0).toUpperCase() + string.slice(1);
}

//function to get city coordinates based on searchTerm // ******FUNCTION: GET COORDINATES ******
function getCoordinates(formatedSearchTerm) {
  urlCoordinates =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    formatedSearchTerm +
    ",US&limit=1&appid=1d4e06b70edabe539b04ef4010633116";
  $.ajax(urlCoordinates, {
    success: function (data) {
      if (data[0] === null || data[0] === undefined) {
        alert("Please enter a valid city name");
      } else {
        searchLat = data[0].lat;
        searchLong = data[0].lon;
        getWeatherCurrent(searchLat, searchLong);
      }
    },
    error: function () {
      alert("An error occurred");
    },
  });
}

//function to set the current search history variable: cities to equal to the local storage// **FUNCTION** SET LOCAL STORAGE
function setLS() {
  localStorage.setItem("cities", cities);
}

function getLS() {
  if (
    localStorage.getItem("cities") === null ||
    localStorage.getItem("cities") === ""
  ) {
    cities = [];
  } else {
    var ls = localStorage.getItem("cities");
    newLS = ls.split(",");
    cities = newLS;
  }
}

//function to display the search history of cities entered into input
function displayHistory(city) {
  for (var i = 0; i < cities.length; i++) {
    $city = $("<div>").addClass("card history col-lg-12");
    $city.html(cities[i]);
    $searchCityDiv.append($city);
  }
}

//function clear history
function clearHistory() {
  $(".history").remove();
}

//api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely,alerts&appid=1d4e06b70edabe539b04ef4010633116&units=imperial
//function to call url for current day's weather conditions by city name // ****** AJAX ** GET CURRENT WEATHER ******
function getWeatherCurrent(lat, long) {
  //sets the URL and concatenate with the user's input
  urlCurrent =
    "http://api.openweathermap.org/data/2.5/onecall?lat=" +
    searchLat +
    "&lon=" +
    searchLong +
    "&exclude=hourly,minutely,alerts&appid=1d4e06b70edabe539b04ef4010633116&units=imperial";

  //uses jquery Ajax to fetch the data from API source
  $.ajax(urlCurrent, {
    success: function (data) {
      displayCurrent(data);
      displayForecast(data);
    },
    error: function () {
      alert("An error occurred");
    },
  });
}

//function to display the current weather conditions // ****** DISPLAY CURRENT WEATHER ******
function displayCurrent(data) {
  //display the header
  //grab icon information and create the url + img & append to header
  var iconcode = data.current.weather[0].icon;
  var headertext = formatedSearchTerm + " " + currentDay;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  var $h3 = $("<h3>").html(headertext);
  var $img = $("<img>");
  $img.attr("src", iconurl);
  $h3.append($img);
  $h3.addClass("display");
  $resultCurrent.append($h3);

  //display temp
  statusText = "Status: " + data.current.weather[0].description;
  var $status = $("<div>").html(statusText);
  $status.addClass("display");
  $resultCurrent.append($status);

  //display temp
  tempText = "Temperature: " + data.current.temp + " °F";
  var $temp = $("<div>").html(tempText);
  $temp.addClass("display");
  $resultCurrent.append($temp);

  //display humidity
  humText = "Humidity: " + data.current.humidity + " %";
  var $hum = $("<div>").html(humText);
  $hum.addClass("display");
  $resultCurrent.append($hum);

  //display wind
  windText = "Wind Speed: " + data.current.wind_speed + " MPH";
  var $wind = $("<div>").html(windText);
  $wind.addClass("display");
  $resultCurrent.append($wind);

  //display UV index
  var uvText = "UV Index: ";
  var $uv = $("<div>");
  $uv.addClass("display");
  $uv.html(uvText);
  var $span = $("<span>").html(data.current.uvi);
  if (data.current.uvi < 5) {
    $span.addClass("badge badge-success");
  } else if (data.current.uvi > 5 && data.current.uvi <= 7) {
    $span.addClass("badge badge-warning display");
  } else {
    $span.addClass("badge badge-danger display");
  }
  $uv.append($span);

  $resultCurrent.append($uv);

  //set border
  $resultCurrent.addClass("border border-primary");
}

//function to display the current weather conditions // ****** DISPLAY CURRENT WEATHER ******
function displayForecast(data) {
  //display the header

  //grab icon information and create the url + img & append to header
  // var iconcode = data.current.weather[0].icon;
  // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

  var headertext = "5-Day Forecast";
  var $h3 = $("<h3>").html(headertext);
  $h3.addClass("display text-center");
  $resultForecast.prepend($h3);
  getDays();
  // var $cardDiv = $("<div>");
  // $cardDiv.addClass("display");
  // $resultForecast.append($cardDiv);

  for (var i = 0; i < 5; i++) {
    //create the card div
    var $card = $("<div>");
    $card.addClass(
      "col-lg-2 col-md-4 col-sm-6 cardPadding bg-primary text-white border border-dark display"
    );
    //create a div for the header
    var $header = $("<div>").html(forecastDay[i]);

    $card.append($header);
    //create the img and div for the icon
    var $img = $("<img>");
    var icon = data.daily[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    $img.attr("src", iconUrl);

    $card.append($img);

    //create tempature
    tempText = "Temp: " + data.daily[i].temp.day + " °F";
    var $temp = $("<div>").html(tempText);
    $temp.addClass("display");
    $card.append($temp);

    //create humidity
    humText = "Humidity: " + data.daily[i].humidity + " %";
    var $hum = $("<div>").html(humText);
    $hum.addClass("display");
    $card.append($hum);

    $resultForecastRow.append($card);
  }
}

//function that gets the next 5 dates from the current date // **FUNCTION** GET THE NEXT 5 DAYS FROM THE CURRENT DATE
function getDays() {
  for (var i = 1; i < 6; i++) {
    var newDay = moment().add(i, "days").format("MM-DD-YYYY");
    forecastDay.push(newDay);
  }
}
// function updateSearchTerm(term) {
//   formatedSearchTerm = searchTerm.split();
//   searchTerm[0].toUpperCase;
// }

//click to search function
function clickSearchTerm(e) {
  var term = e.target;
  formatedSearchTerm = term.textContent;
  $removeAll();
  getCoordinates(formatedSearchTerm);
}

function $removeAll() {
  $(".display").remove();
}

// ----------------  End Of Functions Section  ---------------- //

// ----------------  Event Listeners Section  ---------------- //

//listens for the search button to be clicked and executes getSearchTerm function
$searchBtn.on("click", getSearchTerm);
$searchCityDiv.on("click", ".history", clickSearchTerm);
// ----------------  End of Event Listeners Section  ---------------- //
clearHistory();
getLS();
displayHistory(cities);
