using Microsoft.AspNetCore.Mvc;
using WeatherAPI.Models;

namespace WeatherAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;

        public WeatherController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = config["OpenWeather:ApiKey"];
        }

        [HttpGet("{location}")]
        public async Task<ActionResult<Weather>> GetWeather(string location)
        {
            //catch error for no API key
            if (string.IsNullOrEmpty(_apiKey))
                return StatusCode(500, "API key is not configured");

            var encodedLocation = Uri.EscapeDataString(location);
            var url = $"https://api.openweathermap.org/data/2.5/weather?q={encodedLocation}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return NotFound("Location not found\n" + response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<OpenWeatherResponse>();
            if (json == null) return NotFound("Failed to parse weather data\n" + response.StatusCode);
            var weather = new Weather
            {
                Location = json.Name,
                Temp = (int)json.Main.Temp,
                Condition = json.Weather[0].Condition,
                Humidity = json.Main.Humidity,
                WindSpeed = (int)json.Wind.Speed,
                Precipitation = json.Rain != null ? (int)json.Rain.OneHour : 0
            };
            return Ok(weather);
            /*var data = location.ToLower() switch
            {
                "capetown" => new Weather
                {
                    Location = "Cape Town",
                    Temp = 22,
                    Condition = "Sunny",
                    Humidity = 55,
                    WindSpeed = 10,
                    Precipitation = 0
                },
                "johannesburg" => new Weather
                {
                    Location = "Johannesburg",
                    Temp = 18,
                    Condition = "Cloudy",
                    Humidity = 65,
                    WindSpeed = 15,
                    Precipitation = 20
                },
                _ => null
            };
            if (data == null) return NotFound("Location not found");
            return Ok(data);*/
        }
    }
}