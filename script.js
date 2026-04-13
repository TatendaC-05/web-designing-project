// Convert city → coordinates using Open-Meteo geocoding
async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Enter a city name");
        return;
    }

    try {
        // Step 1: Get coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            document.getElementById("weatherResult").innerHTML =
                `<p style="color:red;">City not found</p>`;
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const name = geoData.results[0].name;

        // Step 2: Get weather
        fetchWeather(lat, lon, name);

    } catch (error) {
        document.getElementById("weatherResult").innerHTML =
            `<p style="color:red;">Error loading data</p>`;
    }
}

//  Auto location
function getWeatherAuto() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetchWeather(lat, lon, "Your Location");
    }, () => {
        alert("Location permission denied");
    });
}

// Fetch weather
async function fetchWeather(lat, lon, locationName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const response = await fetch(url);
    const data = await response.json();

    const weather = data.current_weather;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${locationName}</h2>
        <p> Temperature: ${weather.temperature}°C</p>
        <p> Wind Speed: ${weather.windspeed} km/h</p>
        <p> Wind Direction: ${weather.winddirection}°</p>
    `;
}
