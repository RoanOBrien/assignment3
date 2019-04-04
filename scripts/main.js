// Function that allows the form to be activated on Enter keypressed
(function () {
    console.log("is it working?");
    var input = document.getElementById("cityForm");
    //console.log(input);

    input.addEventListener("submit", function (event) {
        console.log("it's working!");
        document.getElementById("getWeather").click();
        event.preventDefault();
    })
}());

// Function that displays the time
function time() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    hours = checkTime(hours);

    document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;
    setTimeout(time, 1000);

}

time();

// Function that adds an extra 0 if time number is lower than 10
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function getWeatherAPIdata() {

    var url = "https://api.openweathermap.org/data/2.5/weather";
    var apiKey = "cdb0e290eb03191e1e19d501f7e6a513";
    var city = document.getElementById("city").value;

    // construct request
    var request = url + "?" + "appid=" + apiKey + "&" + "q=" + city;

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

// Function initialises when Openweathermap.org returns an OK response
function onAPISucces(response) {
    // get type of weather in string format
    var type = response.weather[0].description;

    // get temperature in Celcius
    var degC = Math.floor(response.main.temp - 273.15);

    // render weather in DOM
    var weatherBox = document.getElementById('weather');
    weatherBox.innerHTML = degC + "&#176;C <br>" + type;

    var coordinates = response.coord;
    console.log(coordinates);

    // Function that gets the elevation from the coordinates given by Openweathermap.org
    function elevation() {

        var url = "https://elevation-api.io/api/elevation?points=";
        var coordLat = response.coord.lat;
        var coordLon = response.coord.lon;
        var coordLatLon = "(" + coordLat + "," + coordLon + ")";

        // Fetch request for the API, no API key needed for this version of the API
        var request = url + coordLatLon;

        fetch(request)

            .then(function (response2) {
                return response2.json();
            })
            .then(function (response2) {
                console.log(response2);
                onElevationSuccess(response2);
                var terrainElevation = response2.elevations[0].elevation;
                checkPic(terrainElevation);
            });
    }

    elevation();

    function onElevationSuccess(response2) {
        var howHighAmI = document.getElementById("elevation");
        howHighAmI.innerHTML = "Elevation: " + response2.elevations[0].elevation + " m";
    }
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

// Function that checks the elevation and based on that, shows the terrain type. Terrain below 150 m elevation is below sea level in the future
function checkPic(elevation) {
    var terrainType = document.getElementById("show-terrain");
    if (elevation < 150) {
        terrainType.src = "./images/sea.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Sea";
    } else if (elevation >= 150 && elevation < 1000) {
        terrainType.src = "./images/forest.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Forest";
    } else if (elevation >= 1000) {
        terrainType.src = "./images/mountains.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Desert";
    }
}