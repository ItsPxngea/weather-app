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

  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const[jhb]=await Promise.all([
          //cities.map(city=>fetch(`http://localhost:5128/api/weather/${encodeURIComponent(city)}`).then(r=>r.json())),
          //fetch(`http://localhost:5128/api/weather/${encodeURIComponent('Cape Town, Western Cape')}`).then(r=>r.json()),
          fetch(`http://localhost:5128/api/weather/${encodeURIComponent('Johannesburg, Western Cape')}`).then(r=>r.json())
        ]);
        //setCapeTownWeather(ct);
        setJohannesburgWeather(jhb);
        
      }catch(e){
        setError("Failed to fetch city weather");
        
      }finally{
        setLoading(false);
      }
    };
  
      fetchWeather();
  },[]);

  const handleSearch = async () => {
    if(!searchCity.trim())return;
    setSearchResult(null);
  
    try{
      const res=await fetch(`http://localhost:5128/api/weather/${encodeURIComponent(searchCity)}`);
      if (!res.ok) throw new Error("City not found during search");
      const data=await res.json();
      setSearchResult(data);
    }
     catch(e){
      setError("Please enter a valid city name");
     }finally{
      setLoading(false);
     }
  };

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
  if(error) return <p className="error">{error}</p>

  return (
    <>
    <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

    <h1 className="weather-title">Local Weather</h1>
    {searchResult && (
      <div className="weather-container">
        <div className="weather-card">
          <h2>{searchResult?.location}</h2>
          <p className="temp">{searchResult?.temp}°C</p>
          <p>{searchResult?.condition}</p>
          <p>Humidity: {searchResult?.humidity}%</p>
          <p>Wind: {searchResult?.windSpeed} km/h</p>
          <p>Precipitation: {searchResult?.precipitation}%</p>
        </div>
    </div>
    )}
    <div className="weather-container">
      <div className="weather-card">
        <h2>{johannesburgWeather?.location}</h2>
        <p className="temp">{johannesburgWeather?.temp}°C</p>
        <p>{johannesburgWeather?.condition}</p>
        <p>Humidity: {johannesburgWeather?.humidity}%</p>
        <p>Wind: {johannesburgWeather?.windSpeed} km/h</p>
        <p>Precipitation: {johannesburgWeather?.precipitation}%</p>
      </div>
    </div>
    
    
    </>
  );
}


export default WeatherApp;
