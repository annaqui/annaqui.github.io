/*
//User Story: I can see the weather in my current location.
  1. Get user location:
  We did this in FCC JSON, APIs & Ajax section:
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
   });
  }
  2. Use Open Weather Map API to return weather according to co-ordinates: https://openweathermap.org/current#geo
   - This is the call by latitude/longitude: api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
     e.g. api.openweathermap.org/data/2.5/weather?lat=35&lon=139 responds with
     {"coord":{"lon":139,"lat":35},
      "sys":{"country":"JP","sunrise":1369769524,"sunset":1369821049},
      "weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],
      "main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
      "wind":{"speed":7.31,"deg":187.002},
      "rain":{"3h":0},
      "clouds":{"all":92},
      "dt":1369824698,
      "id":1851632,
      "name":"Shuzenji",
      "cod":200}

  My API key for Open Weather Map is f8d9912dca4764faaafe918d616b7a9c - append this to any query with &appid={mykey}

// NEW API - Dark Sky - to avoid Cross origin issues:
https://api.darksky.net/[API KEY]/[LAT],[LONG],[Time in Seconds]?Things to exclude[minutely, hourly, alerts flags]

Here is the example response:
{
"latitude":37.8267,
"longitude":-122.4233,
"timezone":"America/Los_Angeles",
"offset":-8,
"currently":{
  "time":1481379188,
  "summary":"Foggy",
  "icon":"fog",
  "precipIntensity":0,
  "precipProbability":0,
  "temperature":14.54,
  "apparentTemperature":14.54,
  "dewPoint":13.31,
  "humidity":0.92,
  "windSpeed":4.37,
  "windBearing":236,
  "visibility":1.96,
  "cloudCover":1,
  "pressure":1019.87,
  "ozone":244.86
  },
"daily":{
  "data":[{
    "time":1481356800,
    "summary":"Rain until evening.",
    "icon":"rain",
    "sunriseTime":1481382976,
    "sunsetTime":1481417530,
    "moonPhase":0.38,
    "precipIntensity":0.5232,
    "precipIntensityMax":2.4232,
    "precipIntensityMaxTime":1481400000,
    "precipProbability":0.81,
    "precipType":"rain",
    "temperatureMin":10.39,
    "temperatureMinTime":1481439600,
    "temperatureMax":15.09,
    "temperatureMaxTime":1481360400,
    "apparentTemperatureMin":10.39,
    "apparentTemperatureMinTime":1481439600,
    "apparentTemperatureMax":15.09,
    "apparentTemperatureMaxTime":1481360400,
    "dewPoint":12.19,"humidity":0.92,
    "windSpeed":3.29,
    "windBearing":245,
    "visibility":8.24,
    "cloudCover":0.95,
    "pressure":1019.01,
    "ozone":254.53
    }]
  }
}


//User Story: I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
  I'd like to set different background colours according to temperature plus an icon for the weather.
  Use this colour scale http://web-tech.ga-usa.com/2012/05/creating-a-custom-hot-to-cold-temperature-color-gradient-for-use-with-rrdtool/
  with min and max temperatures to create a gradient background, then put the weather icon on top of this.
  Weather Icons https://erikflowers.github.io/weather-icons/

//User Story: I can push a button to toggle between Fahrenheit and Celsius.
  temperature.unit Unit of measurements. Possilbe value is Celsius, Kelvin, Fahrenheit.
  Is it better to make another API call to toggle temperature or is it better to do the calucation myself?
  - Open Weather Map request only one API call every 10 minutes, so better to calculate?

*/

var currentUnit = 'c';
var date = new Date();

function chooseColor(temp){
//This chooses a background colour, on a log scale - to be used for background gradients to represent min & max temps
//https://jsfiddle.net/t1gdhokg/
// Temperature will be between -60 and  60
//Hues 240 to 180 are temps between -60 and 0
//Hues 180 to 0 are temps between 0 and 60     
    var mint = 0;
    var maxt = 60;    
   
    if (temp > 0 ) {
      var minh = Math.log(180);
      var maxh = Math.log(1);
      var scale = (maxh-minh) / (maxt-mint);
      return Math.exp(minh + scale*(temp-mint));
    }
    else {
     temp = temp *-1;
     var minh = Math.log(60);
     var maxh = Math.log(1);
     var scale = (maxh-minh) / (maxt-mint);
     return 240 - Math.exp(minh + scale*(temp-mint));
    }
 };


function convertTemp(){ 
var oldTemp = parseInt($('#temperature').text());
$('#buttonUnit').html(currentUnit);
  
  if (currentUnit == 'c'){    
    var newTemp = (oldTemp * 9/5) +32;
    currentUnit = 'f';
    $('#temperature').html(Math.round( newTemp ));    
  }

  else if (currentUnit == 'f'){
    var newTemp = (oldTemp -32) * 5/9;
    currentUnit = 'c';
    $('#temperature').html(Math.round( newTemp ));       
  }

  $('#unit').html('&deg;' + currentUnit);
};




function retrieveWeather(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    /* Switch to using Dark Sky API - 1000 calls a day, but over https to avoid crossorigin issues*/  

    //var apiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f8d9912dca4764faaafe918d616b7a9c&units=metric";    
    var apiUrl = "https://api.darksky.net/forecast/91a4eb6f34d0070d01e2d6c69fa35825/" 
                + position.coords.latitude + "," + position.coords.longitude + "," + (Math.floor(Date.now() / 1000)) 
                + "?units=si&exclude=minutely,hourly,alerts,flags";
    $.ajax( {
          url: apiUrl,
          success: function(data) {
            //Once api call has succeeded, set location, temperature, icon and weather
            $('#location').html('London');
            $('#weather').html(data.currently.summary);
            /*xxx Set background gradient according to min and max temperatures (with alpha value variation in case they are too close together to be noticably different)
            HSLA values - avoid muddy colours 
            To Do - Change lightness and darkness according to time of day*/
            console.log(data.daily.data[0].temperatureMax);
            console.log(data.daily.data[0].temperatureMin);
            
            var gradientMinMax = "linear-gradient(0deg, hsla(" + chooseColor(data.daily.data.temperatureMax) + ",100%,50%,0.7), hsla(" + chooseColor(data.daily.data.temperatureMin) + ",100%,50%,0.5))";
            $(".wrapper").css("background", gradientMinMax);
            //End background setting bit

            //$('#icon').addClass('wi-owm-' + data.weather[0].id);
            //Set Temperature
            $('#temperature').html(Math.round( data.currently.temperature ));
               if (currentUnit == 'f'){
              currentUnit = 'c';
              convertTemp();
            }
            $('#unit').html('&deg;' + currentUnit);
            $('#updatedtime').html(date);
                                   
                                  
           } 
      }); 
   });
  }
};

  $(document).ready(function() {
  retrieveWeather();

  $( "#changeunits" ).click(function() {
  convertTemp();
  });
  $( "#refresh" ).click(function() {
  retrieveWeather();
  });
});











