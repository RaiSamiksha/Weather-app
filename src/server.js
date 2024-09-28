const express = require('express');
const path = require('path');
const weatherData = require('../utils/weatherData'); 
const app = express();
const port = process.env.PORT || 9000;

// Set 'views' directory for templates
app.set('views', path.join(__dirname, '../templates/views'));
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    const data = { title: 'Weather App' };
    res.render('index', data); 
});

app.get('/weather', (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.status(400).json({ error: "You must provide an address" });
    }

    weatherData(address, (error, data) => {
        if (error) {
            return res.status(500).json({ error: "Unable to fetch weather data" });
        }
        res.json(data);
    });
});

app.get('*', (req, res) => {
    const data = { title: 'Page not found' };
    res.render('404', data); 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
