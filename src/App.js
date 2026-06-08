import React, { useState, useEffect } from "react";
import "./Weather.css"; // optional styling

function WeatherApp() {
  /*(const [weather, setWeather] = useState({
    location: "Cape Town",
    temperature: 22,
    condition: "Sunny",
    humidity: 55,
    wind: 10,
    precipitation: 20,
})*/
  
  const [error, setError] = useState(null);
  const [loading, setLoading]=useState(true);
  //const [capetownWeather,setCapeTownWeather]=useState(null);
  const [johannesburgWeather,setJohannesburgWeather]=useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [localWeather, setLocalWeather] = useState(null);
  const[forecast, setForecast]=useState([]);
  const [defaultCity, setDefaultCity] = useState(null);

  //useEffect to fetch weather data for predefined cities and user location on component mount, with error handling and loading state management
  useEffect(() => {
    //const fetchWeather = async () => {
      //try {
      //Method to fetch user location and weather data based on coordinates, with error handling for geolocation issues and fetch failures
      const fetchUserLocation = () => {
      if(!navigator.geolocation) {
        setError("Geolocation not supported by your browser");
        setLoading(false);
        return;
      }
      
    }
        //Prompt user for location access and fetch weather data based on coordinates, with error handling for denied access or fetch failures
        navigator.geolocation.getCurrentPosition(
          (position)=> {
            const {latitude, longitude} = position.coords;
            fetch(`http://localhost:5128/api/weather/coords?lat=${latitude}&lon=${longitude}`)
            .then(r => r.json())
            .then(data => {setLocalWeather(data); setDefaultCity(data.location); return fetch(`http://localhost:5128/api/weather/forecast/${encodeURIComponent(data.location)}`); })
            .then(r => r.json())
            .then(forecastData => setForecast(forecastData))
            .catch(() => setError("Failed to fetch weather for your location"))
            .finally(() => setLoading(false));
          },
          () => {setError("Location access denied. Please allow location access to see weather."); setLoading(false); }

    );
    fetchUserLocation();
  },[]);
    

       /* //URI for forecast data for Cape Town, with error handling for fetch failures
        const forecastRes = await fetch(`http://localhost:5128/api/weather/forecast/${encodeURIComponent(setDefaultCity)}`);

        const[jhb]=await Promise.all([
          //cities.map(city=>fetch(`http://localhost:5128/api/weather/${encodeURIComponent(city)}`).then(r=>r.json())),
          //fetch(`http://localhost:5128/api/weather/${encodeURIComponent('Cape Town, Western Cape')}`).then(r=>r.json()),
          fetch(`http://localhost:5128/api/weather/${encodeURIComponent('Johannesburg, Western Cape')}`).then(r=>r.json())
        ]);
        //setCapeTownWeather(ct);
        setJohannesburgWeather(jhb);
        const forecastData = await forecastRes.json();
        //set forecast data to state
        setForecast(forecastData);
        
      }catch(e){
        setError("Failed to fetch city weather");
        
      }finally{
        setLoading(false);
      }
    };
  
      fetchWeather();
      */

    
    

  //},[]);
//Calling the API to search for weather data based on user input, with error handling and loading state management
  const handleSearch = async () => {
    if(!searchCity.trim())return;
    setSearchResult(null);
  
    try{
      const [weatherRes, forecastRes] = await Promise.all([
      fetch(`http://localhost:5128/api/weather/${encodeURIComponent(searchCity)}`),
      fetch(`http://localhost:5128/api/weather/forecast/${encodeURIComponent(searchCity)}`)
      ]);
       if (!weatherRes.ok) throw new Error("City not found during search");
      
      
      const weatherData=await weatherRes.json();
      const forecastData=await forecastRes.json();
      setForecast(forecastData);
      setSearchResult(weatherData);
    }
     catch(e){
      setSearchError("Please enter a valid city name");
     }finally{
      setLoading(false);
     }
  };
//loading state with loading bar
  if (loading) return (
    <div className="loading-container">
        <div className="spinner"></div>
    </div>
    
);
/*
if (loading) return (
    <div className="loading-container">
        <p className="pulse">⛅</p>
        <p>Fetching weather...</p>
    </div>
);*/
//catch amd throw errors
  if(error) return <p className="error">{error}</p>
  //if(searchError) return <p className="error">{searchError}</p>

  return (
    /*root container for the weather app */
    <div className="app-container">
      {/*Weather Container*/}
    <h1 className="weather-title">Local Weather</h1>
    {/* Search bar */}
    <div className="search-container">
        <input
          type="text"
          id="city-search"
          name="city-search"
          className="search-input"
          placeholder="Search city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />{/*search button*/}
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>{/*clear search button*/}
        {searchResult && (
        <button className="search-button" onClick={async() => { setSearchResult(null); setSearchCity(""); 
          const forecastRes = await fetch(`http://localhost:5128/api/weather/forecast/${encodeURIComponent(setDefaultCity)}`);
          const forecastData = await forecastRes.json();
          setForecast(forecastData);
        }}>
          Clear
        </button>
      )}
      </div>{/*Error banner to help from blocking the page*/}
      {searchError && (
      <div className="error-banner">
        <p>{searchError}</p>
        <button onClick={() => { setSearchError(null); setSearchCity(""); }}>✕</button>
      </div>
    )}

    <div className="weather-container">
      {/*Search Result*/}
    {searchResult && (
      //<div className="weather-container">
        <div className="weather-card">
          <h2>{searchResult?.location}</h2>
          <p className="temp">{searchResult?.temp}°C</p>
          <h3>{searchResult?.condition}</h3>
          <p>Humidity: {searchResult?.humidity}%</p>
          <p>Wind: {searchResult?.windSpeed} km/h</p>
          <p>Precipitation: {searchResult?.precipitation}%</p>
        </div>

     )} {/*: (
      localWeather && (
        <div className="weather-card">
          <h2>{localWeather?.location}</h2>
          <p className="temp">{localWeather?.temp}°C</p>
          <h3>{localWeather?.condition}</h3>
          <p>Humidity: {localWeather?.humidity}%</p>
          <p>Wind: {localWeather?.windSpeed} km/h</p>
          <p>Precipitation: {localWeather?.precipitation}%</p>
        </div>
      ))
    */}
        
    
      {forecast.length > 0 && (
        <div className="forecast-container">
          <h2 className="forecast-title">7 Day Forecast</h2>
          <div className="forecast-row">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p className="forecast-date">{day.date}</p>
                <p className="forecast-temp">{day.temp}°C</p>
                <p className="forecast-condition">{day.condition}</p>
                <p>💧 {day.humidity}%</p>
                <p>💨 {day.windSpeed} km/h</p>
              </div>
            ))}
          </div>
        </div>
)}

    {/*Control container -- NB DELETE*/}
     {/* <div className="weather-card">
        <h2>{johannesburgWeather?.location}</h2>
        <p className="temp">{johannesburgWeather?.temp}°C</p>
        <h3>{johannesburgWeather?.condition}</h3>
        <p>Humidity: {johannesburgWeather?.humidity}%</p>
        <p>Wind: {johannesburgWeather?.windSpeed} km/h</p>
        <p>Precipitation: {johannesburgWeather?.precipitation}%</p>
      </div>
     */}
    
    </div>
    
    </div>
    
  );
}

//Running the app and exporting the WeatherApp component for use in index.js
export default WeatherApp;
