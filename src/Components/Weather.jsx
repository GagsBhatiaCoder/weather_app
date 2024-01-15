import React, { useState } from 'react';
import '../App.css'
import { IoMdSearch } from "react-icons/io";
import { RiMistLine } from "react-icons/ri";
import { TiWeatherCloudy } from "react-icons/ti";
import { IoIosSunny } from "react-icons/io";
import { BsCloudHaze2Fill } from "react-icons/bs";


const Api = {
  key: "957f734895e5b563416f286fe00db01a",
  base: "https://api.openweathermap.org/data/2.5/",
  units: "imperial",
}

export default function Weather() {
  const [query, setQuery] = useState("Delhi");
  const [weather, setWeather] = useState({});
  const [weatherIcon, setWeatherIcon] = useState(null);



  const handleInvalidCity = () => {
    setWeather({
      main: {
        temp: "",
      },
      name: "City Not Found",
      sys: {
        country: "",
      },
      weather: [
        {
          main: "",
        },
      ],
      wind: {
        speed: "",
      },
      coord: {
        lon: "",
        lat: "",
      },
    });
  };
  const fetchWeatherData = () => {
    if (query.trim() === '') {
      return alert("Please Type A City Name")
    }
    fetch(`${Api.base}weather?q=${query}&appid=${Api.key}&units=${Api.units}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod === "404") {
          handleInvalidCity()
        } else {
          setWeather(result);
          const mainWeather = result.weather[0]?.main;
          setWeatherIcon(iconMappings[mainWeather] || null);
        }

        setQuery("");
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        handleInvalidCity();
      });
  }
  const handleButtonClick = () => {
    fetchWeatherData();
  };
  const search = (evt) => {
    if (evt.key === "Enter") {
      fetchWeatherData()
    }
  }
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`
  }
  const iconStyles = {
    fontSize: 100,
  };

  const iconMappings = {
    Haze: <BsCloudHaze2Fill />,
    Clouds: <TiWeatherCloudy />,
    Clear: <IoIosSunny />,
    Mist: <RiMistLine />,
    default: <BsCloudHaze2Fill style={iconStyles} />

  };

  const weatherBackgrounds = {
    Clouds: "cloudy-bg",
    Haze: "haze-bg",
    Clear: "sunny-bg",
    Rain: "rain-bg",
    default: "cloudy-bg",
  };
  const colorStyles = {
    color: "#F2BB13"
  }

  return (
    <div className={`container-box ${weatherBackgrounds[weather?.weather?.[0]?.main] || weatherBackgrounds.default}`}>

      <div className='col-md-3'>
        <div className='input-group col-md-3'>
        
          <input className="form-control bg-transparent text-dark" type="text" placeholder="Type City" aria-label="default input example"
            onChange={e => setQuery(e.target.value)} value={query}
            onKeyDown={search} />
            <button className="btn btn-outline-light" type="button" id="button-addon2"
            onClick={handleButtonClick} ><IoMdSearch /></button>
        </div>
      </div>

      {(typeof weather.main != "undefined") ? (
        <div >
          <div >
            <h2>{weather.name},{weather.sys?.country}</h2>
          </div>
          <div className='date'>
            {dateBuilder(new Date())}
          </div>
          <div className='temp-container'>
            <div className='tempreture'>
              {Math.round((weather.main.temp - 32) * 5 / 9)}°C
            </div>
            <div className='weather-icons'>
              {weatherIcon ? (
                React.cloneElement(weatherIcon, { style: iconStyles })
              ) : (
                iconMappings.default
              )}
              <div className="weather">
                {weather.weather[0].main}
              </div>

            </div>
          </div>
          <div className="wind">
            <div style={{ fontSize: "2rem" }}>Wind <hr /></div>
            <div className="d-sm-flex justify-content-around">
              <div> <h5 style={colorStyles}>Speed:</h5> {Math.round(weather.wind.speed)} km/h</div>
              <div> <h5 style={colorStyles}>Deg:</h5> {weather.wind.deg}</div>
              <div> <h5 style={colorStyles}>Gust:</h5> {weather.wind.gust}</div>
            </div>
          </div>
          <hr />
          <div className='d-sm-flex justify-content-around'>
            <div className="lon">
              <h5 style={colorStyles}>Lon:</h5>  {Math.round(weather.coord.lon)}
            </div>
            <div className="lat">
              <h5 style={colorStyles}>Lat:</h5> {Math.round(weather.coord.lat)}
            </div>
          </div>
        </div>
      ) : " "}

    </div>
  )
}
