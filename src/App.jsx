import { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import './App.css'
import clearIcon from './assets/clear.png'
import searchIcon from './assets/search.png'
import cloudIcon from './assets/cloud.png'
import drizzleIcon from './assets/drizzle.png'
import humidityIcon from './assets/humidity.png'
import rainIcon from './assets/rain.png'
import snowIcon from './assets/snow.png'
import windIcon from './assets/wind.png'


const WeatherDetails = ({ icon, temp, city, country, lat, log, wind, humidity }) => {
  return(
    <>
      <div className='image'>
        <img src={icon} alt="Image"/>
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='city'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className="element">
          <img src={humidityIcon} 
          alt="humidity"
          className='icon' 
          />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} 
          alt="Wind"
          className='icon' 
          />
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

WeatherDetails.propTypes = {
  icon: PropTypes.string,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
};

function App() {
  let api_key = 'bdf15d98dd8c2f19f84c405fcc41204f';

  const [text, setText] = useState('Chennai')

  const [icon, setIcon] = useState();
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoanding] = useState(false);
  const [error, setError] = useState(false);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon, 
    "02d": cloudIcon, 
    "02n": cloudIcon,
    "03d": drizzleIcon, 
    "03n": drizzleIcon, 
    "04d": drizzleIcon, 
    "04n": drizzleIcon,
    "09d": rainIcon, 
    "09n": rainIcon,
    "10d": rainIcon, 
    "10n": rainIcon, 
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    setLoanding(true);
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=matric`
    
    try{
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data)
      if (data.cod === "404"){
        console.log("City Not Found");
        setCityNotFound(true);
        setLoanding(false);
        return;
      }

      else if (data.cod === "400"){
        setError('Please fill out the city reloading...!');
        setTimeout(function(){ window. location. reload();
          setLoanding(true);
        }, 2000); 
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false)
    }catch(error) {
      console.error("An error occurred:", error.message);
      setError("An unforunate error is occured")
      setTimeout(function(){ window. location. reload();
        setLoanding(true);
      }, 2000); 
      return;
    }finally {
      setLoanding(false)
    }
  }


  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function () {
    search();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input 
          type='text'
          className='city-input'
          placeholder='Search City'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
          required/>
          <div className="search-icon" onClick={()=> search()}>
            <img src={searchIcon} alt='searchicon'/>
          </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City Not Found</div>}

        {!loading && !cityNotFound && !error && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} wind={wind} humidity={humidity}/>}

        <p className='copyrights'>&copy; Copyrights 2024</p>
      </div>
    </>
  )
}

export default App
