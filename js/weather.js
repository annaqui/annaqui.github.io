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
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f8d9912dca4764faaafe918d616b7a9c&units=metric";    
    $.ajax( {
          url: apiUrl,
          success: function(data) {
            //Once api call has succeeded, set location, temperature, icon and weather
            $('#location').html(data.name);
            $('#weather').html(data.weather[0].description);
            /*xxx Set background gradient according to min and max temperatures (with alpha value variation in case they are too close together to be noticably different)
            HSLA values - avoid muddy colours 
            To Do - Change lightness and darkness according to time of day
            */ 
            var gradientMinMax = "linear-gradient(0deg, hsla(" + chooseColor(data.main.temp_max) + ",100%,50%,0.7), hsla(" + chooseColor(data.main.temp_min) + ",100%,50%,0.5))";
            $(".wrapper").css("background", gradientMinMax);
            //End background setting bit

            $('#icon').addClass('wi-owm-' + data.weather[0].id);
            $('#temperature').html(Math.round( data.main.temp ));
               if (currentUnit == 'f'){
              currentUnit = 'c';
              convertTemp();
            }
            $('#unit').html('&deg;' + currentUnit);
            var date = new Date();
            $('#updatedtime').html(date.toLocaleTimeString() + ', ' + date.toLocaleDateString());                       
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











