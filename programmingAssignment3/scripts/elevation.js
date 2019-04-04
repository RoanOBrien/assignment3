function getWeatherAPIdata() {

    var url = "https://elevation-api.io/api/elevation?points=";
    var coordLat;
    var coordLon;
    var coordLatLon = "(" + coordLat + coordLon + ")";

    // construct request
    var request = url + coordLatLon;

    // get current weather
    fetch(request)

        // parse to JSON format
        .then(function (response) {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })

        // render weather per day
        .then(function (response) {
            // render weatherCondition
            onAPISucces(response);
        })

        // catch error
        .catch(function (error) {
            onAPIError(error);
        });
}

function onAPISucces(response) {
    // get type of weather in string format
    //console.log(response);
    var type = response.weather[0].description;

    // get temperature in Celcius
    var degC = Math.floor(response.main.temp - 273.15);

    // render weather in DOM
    var weatherBox = document.getElementById('weather');
    weatherBox.innerHTML = degC + "&#176;C <br>" + type;
    
    var coordinates = response.coord;
    //console.log(coordinates);
}


function onAPIError(error) {
    console.error('Fetch request failed', error);
    var weatherBox = document.getElementById('weather');
    weatherBox.innerHTML = 'No weather data available <br /> Did you enter a valid city?';
}

// init data stream
document.getElementById("getWeather").onclick = function () {
    getWeatherAPIdata();
};

