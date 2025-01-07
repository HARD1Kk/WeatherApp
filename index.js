import express from 'express'
import axios from 'axios'
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Static background for the home page
const staticBackground = '/images/default.jpg'; // Path to your static background image

// Home route
app.get('/', (req, res) => {
  res.render('index', { weather: null, forecast: null, error: null, backgroundImage: staticBackground });
});

// Weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = '38478ff22f9f2660a7c1bedbd6a9d38b'; // Replace with your OpenWeatherMap API key
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    const weather = weatherResponse.data;
    const forecast = forecastResponse.data.list.filter((item, index) => index % 8 === 0); // Get daily forecast

    // Set dynamic background based on weather condition
    const weatherCondition = weather.weather[0].main.toLowerCase();
    const backgroundImage = getBackgroundImage(weatherCondition);

    res.render('index', { weather, forecast, error: null, backgroundImage });
  } catch (error) {
    res.render('index', { weather: null, forecast: null, error: 'Error fetching weather data', backgroundImage: staticBackground });
  }
});

// Function to get background image based on weather condition
function getBackgroundImage(weatherCondition) {
  switch (weatherCondition) {
    case 'clear':
      return '/images/clear.jpg'; // Path to clear weather image
    case 'clouds':
      return '/images/cloudy.jpg'; // Path to cloudy weather image
    case 'rain':
      return '/images/rainy.jpg'; // Path to rainy weather image
    case 'snow':
      return '/images/snowy.jpg'; // Path to snowy weather image
    case 'thunderstorm':
      return '/images/thunderstorm.jpg'; // Path to thunderstorm image
    default:
      return '/images/default.jpg'; // Fallback static image
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});