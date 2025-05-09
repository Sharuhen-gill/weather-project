import React, { useState } from 'react';
import axios from 'axios';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError('City not found or API request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData();
    }
  };

  const getDailyForecast = () => {
    if (!forecastData) return [];

    const dailyForecast = {};
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    });

    return Object.entries(dailyForecast).slice(0, 3).map(([date, data]) => ({
      date,
      ...data,
    }));
  };

  return (
    <div className="weather-forecast">
      <h1>Weather Forecast</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-details">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      )}
      {forecastData && (
        <div className="forecast-details">
          <h2>3-Day Forecast</h2>
          <div className="forecast-list">
            {getDailyForecast().map((day, index) => (
              <div key={index} className="forecast-item">
                <h3>{day.date}</h3>
                <p>Temperature: {day.temp}°C</p>
                <p>Condition: {day.description}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
