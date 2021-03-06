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

    function elevation() {

        var url = "https://elevation-api.io/api/elevation?points=";
        var coordLat = response.coord.lat;
        var coordLon = response.coord.lon;
        var coordLatLon = "(" + coordLat + "," + coordLon + ")";

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

function checkPic(elevation) {
    var terrainType = document.getElementById("show-terrain");
    if (elevation < 150) {
        terrainType.src = "./images/sea.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Sea";
//        warning();
    } else if (elevation >= 150 && elevation < 1000) {
        terrainType.src = "./images/forest.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Forest";
    } else if (elevation >= 1000) {
        terrainType.src = "./images/mountains.gif";
        document.getElementById("displayTerrain").innerHTML = "Current terrain type: Desert";
    }
}

//function warning() {
//    (function () {
//        var tl1 = new TimelineMax({
//            repeat: -1
//        });
//
//        tl1.to('#warning', 0.5, {
//                ease: Power0.easeNone,
//                opacity: 1
//            })
//            .to('#warning', 0.5, {
//                ease: Power0.easeNone,
//                opacity: 0
//            })
//    }());
//}
