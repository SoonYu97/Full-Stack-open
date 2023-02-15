import { useState, useEffect } from "react";
import weatherServices from "../services/weather";
const Country = ({ country }) => {
  const {
    capital,
    area,
    languages,
    name: { common },
    flags,
    latlng: [lat, lon],
  } = country;

  const [weather, setWeather] = useState(null);
  useEffect(() => {
    weatherServices
      .getWeather({ lat, lon })
      .then((weather) => {
        console.log(weather);
        setWeather(weather);
      })
      .catch(() => setWeather(null));
  }, [lat, lon]);

  const roundToTenth = (num) => Math.floor(num * 100) / 100;

  return (
    <>
      <h2>{common}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>
      <h3>language{Object.keys(languages).length > 1 && "s"}:</h3>
      <ul>
        {Object.entries(languages).map(([key, language]) => (
          <li key={key}>{language}</li>
        ))}
      </ul>
      <img alt={flags.alt} src={flags.png} />
      <h2>Weather in {capital}</h2>
      {weather ? (
        <>
          <p>{`temperature ${roundToTenth(
            weather.main.temp - 273
          )} Celsius`}</p>
          <p>{`wind ${weather.wind.speed} m/s`}</p>
        </>
      ) : (
        <p>cannot get weather currently</p>
      )}
    </>
  );
};

export default Country;
