import axios from "axios";

const api_key = process.env.REACT_APP_OPEN_WEATHER_API_KEY
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

const getWeather = ({ lat, lon }) => {
  const request = axios.get(`${weatherUrl}?lat=${lat}&lon=${lon}&appid=${api_key}`);
  return request.then((response) => response.data);
};

const weatherServices = { getWeather };

export default weatherServices;
