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
function retrieveWeather(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f8d9912dca4764faaafe918d616b7a9c";    
    $.ajax( {
          url: apiUrl,
          success: function(data) {
            $('#location').html(post.name);
            $('#temperature').html(post.main.temp);
           }  

      }); 
   });
  }
};

  $(document).ready(function() {
  retrieveWeather();

});

