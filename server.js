const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');  

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: 'https://alexrweather.netlify.app',  
}));

app.get('/', (req, res) => {
    res.send('Weather API is working!');
});

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.error('API Key is missing!');
        return res.status(500).json({ error: 'API key is missing' });
    }

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: 'imperial'
            }
        });

        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: 'imperial'
            }
        });

        if (weatherResponse.data && forecastResponse.data) {
            console.log('Weather Response:', weatherResponse.data);
            console.log('Forecast Response:', forecastResponse.data);

            res.json({
                ...weatherResponse.data,
                forecast: forecastResponse.data.list
            });
        } else {
            throw new Error('Invalid response from OpenWeather API');
        }
    } catch (error) {
        console.error('Error fetching data from OpenWeather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
