const axios = require('axios');
const https = require('https');

const openWeathermapKey = {
    base_url: "https://api.openweathermap.org/data/2.5/weather?q=", 
    secret_key: "3c5a70250777445167a82eac341570d4"
};

const weatherData = (address, callback) => {
    const url = openWeathermapKey.base_url + encodeURIComponent(address) + "&APPID=" + openWeathermapKey.secret_key;

    const agent = new https.Agent({
        rejectUnauthorized: false 
    });

    axios.get(url, { httpsAgent: agent })
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            callback(true, "Unable to fetch data, please try again.. " + error.message);
        });
};

module.exports = weatherData;
