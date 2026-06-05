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
  //const [weather,setWeather]=useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading]=useState(true);
  const [capetownWeather,setCapeTownWeather]=useState(null);
  const [johannesburgWeather,setJohannesburgWeather]=useState(null);

  /*useEffect(()=> {
    fetch("http://localhost:5128/api/weather")
    .then((res)=>{
      if(!res.ok)throw new Error("Failed to fetch weather");
      return res.json();
    })
    .then((data)=>{
      setWeather(data);
      setLoading(false);
    })
    .catch((err)=>{
      setError(err.message);
      setLoading(false);
    });
  });
  */

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const[ct,jhb]=await Promise.all([
          fetch("http://localhost:5128/api/weather/Cape Town, ZA").then(r=>r.json()),
          fetch("http://localhost:5128/api/weather/Johannesburg").then(r=>r.json())
        ]);
        setCapeTownWeather(ct);
        setJohannesburgWeather(jhb);
        
      }catch(e){
        setError("Failed to fetch city weather");
        //setLoading(false);
      }finally{
        setLoading(false);
      }
    };
  
      fetchWeather();
  },[]);

  //if(loading) return <p className="loadingscreen">Loading...</p>;
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
    <h1 className="weather-title">Local Weather</h1>
    <div className="weather-container">
      <div className="weather-card">
        <h2>{capetownWeather.location}</h2>
        <p className="temp">{capetownWeather.temp}°C</p>
        <p>{capetownWeather.condition}</p>
        <p>Humidity: {capetownWeather.humidity}%</p>
        <p>Wind: {capetownWeather.windSpeed} km/h</p>
        <p>Precipitation: {capetownWeather.precipitation}%</p>
      </div>
    

    
      <div className="weather-card">
        <h2>{johannesburgWeather.location}</h2>
        <p className="temp">{johannesburgWeather.temp}°C</p>
        <p>{johannesburgWeather.condition}</p>
        <p>Humidity: {johannesburgWeather.humidity}%</p>
        <p>Wind: {johannesburgWeather.windSpeed} km/h</p>
        <p>Precipitation: {johannesburgWeather.precipitation}%</p>
      </div>
    </div>
    
    </>
  );
}

export default WeatherApp;
