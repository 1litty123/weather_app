// API Stuff
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '17a7589edef23c504b52f238553c2848';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
var GOOGLE_MAPS_API_KEY = 'AIzaSyDVd1uF2pm61WZ-25kiLN0-JzIJZWLxbYA';
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
var moreInfo = app.querySelector('.more-info')
cityInput.value = "Pick a City."


cityInput.addEventListener('click', function() {
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
    if (cityInput.value == "Pick a City.") {
        cityInput.value = ''
        cityInput.style.textTransform = "capitalize";
    } else {
        cityInput.value = '';
        cityWeather.innerHTML = '';
        cityInfo.innerHTML = '';
        moreInfo.innerHTML = '';
    }
})

var moreInfoClick = moreInfo.addEventListener('click', function() {
    var city = cityInput.value;
    var avgTemperature;
    var i;
    var avgArray = [];
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
        for (i = 1; i < weather.daily.data.length; i++) {
            avgArray = avgArray + [averages[i]];
            var averages = (average(weather.daily.data[i].temperatureHigh,weather.daily.data[i].temperatureLow)).toPrecision(3);
            console.log(averages);
            moreInfo.innerHTML = averages;
        }
    }
)
})

function average(x,y) {
    return (x + y) / 2;
}


cityForm.addEventListener('submit', function(event) { // this line changes
    event.preventDefault(); // prevent the form from submitting
    // This code doesn't change!
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
        console.log(weather.daily.data);
        });
    cityInput.blur(); 
  });


