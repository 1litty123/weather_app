// API Stuff
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '4b6ab3c7b05fca302f52fa13bf194434';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
var GOOGLE_MAPS_API_KEY = 'AIzaSyAGhCIRgqzi6x7dSd-h26ukxen1Qg5ViMk';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
  
    return (
      fetch(url) // Returns a promise for a Response
      .then(response => response.json()) // Returns a promise for the parsed JSON
      .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
  }

function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,alerts,flags`;
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data)
    );
  }
// Design and everything else.

var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var getWeatherButton = cityForm.querySelector('.get-weather-button');
var cityWeather = app.querySelector('.city-weather');
var cityInfo = app.querySelector('.city-info')
var d = new Date
var numberOfMonth = d.getMonth();
var months = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December'];
var month = months[numberOfMonth];
var numberOfWeek = d.getDay();
var daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var dayOfWeek = daysOfTheWeek[numberOfWeek];
var year = d.getFullYear();
var moreInfo = app.querySelector('.more-info');
cityInput.value = "Pick a City."
var backInfo = app.querySelector('.back-info')


cityInput.addEventListener('click', function() {
    var city = cityInput.value;
    var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));
    var options = {
        bounds: defaultBounds,
        types: ['(cities)']
      };
    autocomplete = new google.maps.places.Autocomplete(cityInput, options); 
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
    cityWeather.innerHTML = "<img src=\loading.gif\></img>";
    var city = cityInput.value;
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
        var condition;
        if (weather.currently.icon === "clear-day") {
            condition = "<i class='wi wi-day-sunny' style='color:#FFFEA6'></i>";
        } else if (weather.currently.icon === "clear-night") {
            condition = "<i class='wi wi-night-clear' style='color:#0042AD;'></i>";
        } else if (weather.currently.icon === "rain") {
            condition = "<i class='wi wi-day-rain'></i>";
        } else if (weather.currently.icon === "snow") {
            condition = "<i class='wi wi-snow'></i>";
        } else if (weather.currently.icon === "sleet") {
            condition = "<i class='wi wi-sleet'></i>";
        } else if (weather.currently.icon === "wind") {
            condition =  "<i class='wi wi-strong-wind'></i>";
        } else if (weather.currently.icon === "fog") {
            condition = "<i class='wi wi-fog'></i>";
        } else if (weather.currently.icon === "cloudy") {
            condition = "<i class='wi wi-cloudy'></i>";
        } else if (weather.currently.icon === "partly-cloudy-day") {
            condition = "<i class='wi wi-day-cloudy'></i>";
        } else { // partly cloudy night
            condition = "<i class='wi wi-night-alt-partly-cloudy'></i>";
        }
        cityWeather.innerHTML = condition + ' ' + weather.currently.temperature.toPrecision(3) + '°C'; 
        cityInfo.innerHTML = '<br><span>' + dayOfWeek +'</span></b><br><b>Precipitation:</b> ' + weather.currently.precipIntensity.toFixed(2) * 100 + 'mm/h' + '<br><b>Humidity:</b> ' + weather.currently.humidity.toFixed(2) * 100 + '%' + '<br><b>Wind:</b> ' + weather.currently.windSpeed.toFixed(2) + 'm/s <br>';
        moreInfo.innerHTML = ">";
        moreInfoClick;
        console.log(weather.daily.data);
          });
          cityInput.blur();
        });
    if (cityInput.value == "Pick a City.") {
        cityInput.value = ''
        cityInput.style.textTransform = "capitalize";
    } else {
        cityInput.value = '';
        cityWeather.innerHTML = '';
        cityInfo.innerHTML = '';
        backInfo.innerHTML = '';
        moreInfo.innerHTML = '';
     
    }
})

var addition = 0;
var moreInfoClick = moreInfo.addEventListener('click', function() {
    backInfo.innerHTML = "<";
    cityWeather.innerHTML = "<img src=\loading.gif\></img>";
    cityInfo.innerHTML = "";
    addition++;
    if (addition === 6) {
        moreInfo.innerHTML = '';
    }
    var city = cityInput.value;
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
        var condition;
        if (weather.daily.data[addition].icon === "clear-day") {
            condition = "<i class='wi wi-day-sunny' style='color:#FFFEA6'></i>";
        } else if (weather.daily.data[addition].icon === "clear-night") {
            condition = "<i class='wi wi-night-clear' style='color:#0042AD;'></i>";
        } else if (weather.daily.data[addition].icon === "rain") {
            condition = "<i class='wi wi-day-rain'></i>";
        } else if (weather.daily.data[addition].icon === "snow") {
            condition = "<i class='wi wi-snow'></i>";
        } else if (weather.daily.data[addition].icon === "sleet") {
            condition = "<i class='wi wi-sleet'></i>";
        } else if (weather.daily.data[addition].icon === "wind") {
            condition =  "<i class='wi wi-strong-wind'></i>";
        } else if (weather.daily.data[addition].icon === "fog") {
            condition = "<i class='wi wi-fog'></i>";
        } else if (weather.daily.data[addition].icon === "cloudy") {
            condition = "<i class='wi wi-cloudy'></i>";
        } else if (weather.daily.data[addition].icon === "partly-cloudy-day") {
            condition = "<i class='wi wi-day-cloudy'></i>";
        } else { // partly cloudy night
            condition = "<i class='wi wi-night-alt-partly-cloudy'></i>";
        } if (numberOfWeek + 1 === 7) {
            numberOfWeek = 0
        } else {
            numberOfWeek++
        }
        cityWeather.innerHTML = condition + '<span class="lowHigh">' + weather.daily.data[addition].temperatureHigh.toPrecision(3) + '°C ' + weather.daily.data[addition].temperatureLow.toPrecision(3) + '°C </span>'; 
        cityInfo.innerHTML = '<br><span>' + daysOfTheWeek[numberOfWeek] + '</span></b><br><b>Precipitation:</b> ' + weather.daily.data[addition].precipIntensity.toFixed(2) * 100 + 'mm/h' + '<br><b>Humidity:</b> ' + weather.daily.data[addition].humidity.toFixed(2) * 100 + '%' + '<br><b>Wind:</b> ' + weather.daily.data[addition].windSpeed.toFixed(2) + 'm/s<br>';
    
        console.log(addition);
        })
    });


backInfo.addEventListener('click', function() {
    moreInfo.innerHTML = ">";
    cityWeather.innerHTML = "<img src=\loading.gif\></img>";
    cityInfo.innerHTML = "";
    addition--;
    if (addition > 0) {
        backInfo.innerHTML = "<";
    } else {
        backInfo.innerHTML = '';
    }
    var city = cityInput.value;
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
        var condition;
        if (weather.daily.data[addition].icon === "clear-day") {
            condition = "<i class='wi wi-day-sunny' style='color:#FFFEA6'></i>";
        } else if (weather.daily.data[addition].icon === "clear-night") {
            condition = "<i class='wi wi-night-clear' style='color:#0042AD;'></i>";
        } else if (weather.daily.data[addition].icon === "rain") {
            condition = "<i class='wi wi-day-rain'></i>";
        } else if (weather.daily.data[addition].icon === "snow") {
            condition = "<i class='wi wi-snow'></i>";
        } else if (weather.daily.data[addition].icon === "sleet") {
            condition = "<i class='wi wi-sleet'></i>";
        } else if (weather.daily.data[addition].icon === "wind") {
            condition =  "<i class='wi wi-strong-wind'></i>";
        } else if (weather.daily.data[addition].icon === "fog") {
            condition = "<i class='wi wi-fog'></i>";
        } else if (weather.daily.data[addition].icon === "cloudy") {
            condition = "<i class='wi wi-cloudy'></i>";
        } else if (weather.daily.data[addition].icon === "partly-cloudy-day") {
            condition = "<i class='wi wi-day-cloudy'></i>";
        } else { // partly cloudy night
            condition = "<i class='wi wi-night-alt-partly-cloudy'></i>";
        } if (numberOfWeek - 1 === -1) {
            numberOfWeek = 6
        } else {
            numberOfWeek--
        } if (addition === 0) {
            var condition;
            if (weather.currently.icon === "clear-day") {
                condition = "<i class='wi wi-day-sunny' style='color:#FFFEA6'></i>";
            } else if (weather.currently.icon === "clear-night") {
                condition = "<i class='wi wi-night-clear' style='color:#0042AD;'></i>";
            } else if (weather.currently.icon === "rain") {
                condition = "<i class='wi wi-day-rain'></i>";
            } else if (weather.currently.icon === "snow") {
                condition = "<i class='wi wi-snow'></i>";
            } else if (weather.currently.icon === "sleet") {
                condition = "<i class='wi wi-sleet'></i>";
            } else if (weather.currently.icon === "wind") {
                condition =  "<i class='wi wi-strong-wind'></i>";
            } else if (weather.currently.icon === "fog") {
                condition = "<i class='wi wi-fog'></i>";
            } else if (weather.currently.icon === "cloudy") {
                condition = "<i class='wi wi-cloudy'></i>";
            } else if (weather.currently.icon === "partly-cloudy-day") {
                condition = "<i class='wi wi-day-cloudy'></i>";
            } else { // partly cloudy night
                condition = "<i class='wi wi-night-alt-partly-cloudy'></i>";
            }
            cityWeather.innerHTML = condition + ' ' + weather.currently.temperature.toPrecision(3) + '°C'; 
            cityInfo.innerHTML = '<br><span>' + dayOfWeek +'</span></b><br><b>Precipitation:</b> ' + weather.currently.precipIntensity.toFixed(2) * 100 + 'mm/h' + '<br><b>Humidity:</b> ' + weather.currently.humidity.toFixed(2) * 100 + '%' + '<br><b>Wind:</b> ' + weather.currently.windSpeed.toFixed(2) + 'm/s <br>';
            
        } else {
        cityWeather.innerHTML = condition + '<span class="lowHigh">' + weather.daily.data[addition].temperatureHigh.toPrecision(3) + '°C ' + weather.daily.data[addition].temperatureLow.toPrecision(3) + '°C </span>'; 
        cityInfo.innerHTML = '<br><span>' + daysOfTheWeek[numberOfWeek] + '</span></b><br><b>Precipitation:</b> ' + weather.daily.data[addition].precipIntensity.toFixed(2) * 100 + 'mm/h' + '<br><b>Humidity:</b> ' + weather.daily.data[addition].humidity.toFixed(2) * 100 + '%' + '<br><b>Wind:</b> ' + weather.daily.data[addition].windSpeed.toFixed(2) + 'm/s<br>';
        }
        console.log(addition);
        })
    });
    


cityForm.addEventListener('submit', function(event) { // this line changes
    event.preventDefault();
    cityWeather.innerHTML = "<img src=\loading.gif\></img>";

    var city = cityInput.value;
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
        var condition;
        if (weather.currently.icon === "clear-day") {
            condition = "<i class='wi wi-day-sunny' style='color:#FFFEA6'></i>";
        } else if (weather.currently.icon === "clear-night") {
            condition = "<i class='wi wi-night-clear' style='color:#0042AD;'></i>";
        } else if (weather.currently.icon === "rain") {
            condition = "<i class='wi wi-day-rain'></i>";
        } else if (weather.currently.icon === "snow") {
            condition = "<i class='wi wi-snow'></i>";
        } else if (weather.currently.icon === "sleet") {
            condition = "<i class='wi wi-sleet'></i>";
        } else if (weather.currently.icon === "wind") {
            condition =  "<i class='wi wi-strong-wind'></i>";
        } else if (weather.currently.icon === "fog") {
            condition = "<i class='wi wi-fog'></i>";
        } else if (weather.currently.icon === "cloudy") {
            condition = "<i class='wi wi-cloudy'></i>";
        } else if (weather.currently.icon === "partly-cloudy-day") {
            condition = "<i class='wi wi-day-cloudy'></i>";
        } else { // partly cloudy night
            condition = "<i class='wi wi-night-alt-partly-cloudy'></i>";
        }
        cityWeather.innerHTML = condition + ' ' + weather.currently.temperature.toPrecision(3) + '°C'; 
        cityInfo.innerHTML = '<br><span>' + dayOfWeek + ', ' + month + ' ' + numberOfMonth + ' ' + year + '</span></b><br><b>Precipitation:</b> ' + weather.currently.precipIntensity.toFixed(2) * 100 + 'mm/h' + '<br><b>Humidity:</b> ' + weather.currently.humidity.toFixed(2) * 100 + '%' + '<br><b>Wind:</b> ' + weather.currently.windSpeed.toFixed(2) + 'm/s <br>';
        moreInfo.innerHTML = '';
        moreInfoClick;
        console.log(weather.daily.data);
        });
        cityInput.blur(); 
  });

