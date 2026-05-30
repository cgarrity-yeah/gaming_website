// API Configuration
const API_BASE = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';

// Weather icon mapping
const weatherIcons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '⛈️',
    71: '🌨️',
    73: '🌨️',
    75: '🌨️',
    77: '🌨️',
    80: '🌧️',
    81: '⛈️',
    82: '⛈️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
};

const weatherConditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail'
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const hourlySection = document.getElementById('hourlySection');
const recentSearchesList = document.getElementById('recentSearches');

// Event Listeners
searchBtn.addEventListener('click', () => searchWeather());
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchWeather());
locationBtn.addEventListener('click', getUserLocation);

// Load recent searches on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});

// Show Error
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    setTimeout(() => error.classList.add('hidden'), 5000);
}

// Show Loading
function showLoading(show = true) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Geocode City Name
async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `${API_BASE}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError(`City "${cityName}" not found. Please try again.`);
            return null;
        }

        return data.results[0];
    } catch (err) {
        showError('Error searching for city. Please try again.');
        console.error(err);
        return null;
    }
}

// Get User Location
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
        },
        (err) => {
            showLoading(false);
            showError('Unable to get your location. Please allow location access.');
            console.error(err);
        }
    );
}

// Search Weather
async function searchWeather() {
    const cityName = searchInput.value.trim();
    if (!cityName) {
        showError('Please enter a city name.');
        return;
    }

    showLoading(true);
    const location = await geocodeCity(cityName);

    if (location) {
        fetchWeather(location.latitude, location.longitude, location.name, location.country);
        saveRecentSearch(location.name, location.country);
        searchInput.value = '';
    } else {
        showLoading(false);
    }
}

// Fetch Weather Data
async function fetchWeather(lat, lon, cityName, country) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`
        );
        const data = await response.json();
        showLoading(false);
        displayWeather(data, lat, lon, cityName, country);
    } catch (err) {
        showLoading(false);
        showError('Error fetching weather data. Please try again.');
        console.error(err);
    }
}

// Display Current Weather
function displayWeather(data, lat, lon, cityName, country) {
    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    // Update current weather
    document.getElementById('cityName').textContent = cityName || 'Unknown Location';
    document.getElementById('coordinates').textContent = `${country || ''} (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('condition').textContent = weatherConditions[current.weather_code] || 'Unknown';
    document.getElementById('weatherIcon').textContent = weatherIcons[current.weather_code] || '🌡️';
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_msl} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('uvIndex').textContent = current.uv_index.toFixed(1);

    currentWeatherSection.classList.remove('hidden');

    // Display 7-day forecast
    displayForecast(daily);

    // Display 24-hour forecast
    displayHourly(hourly);
}

// Display 7-Day Forecast
function displayForecast(daily) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    for (let i = 1; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${weatherIcons[daily.weather_code[i]] || '🌡️'}</div>
            <div class="forecast-temp">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</div>
            <div class="forecast-condition">${weatherConditions[daily.weather_code[i]] || 'Unknown'}</div>
        `;
        forecastContainer.appendChild(card);
    }

    forecastSection.classList.remove('hidden');
}

// Display 24-Hour Forecast
function displayHourly(hourly) {
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';

    // Show next 24 hours
    for (let i = 0; i < 24; i++) {
        const time = new Date(hourly.time[i]);
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="hourly-time">${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="hourly-icon">${weatherIcons[hourly.weather_code[i]] || '🌡️'}</div>
            <div class="hourly-temp">${Math.round(hourly.temperature_2m[i])}°C</div>
            <div class="hourly-condition">${hourly.precipitation_probability[i]}% 💧</div>
        `;
        hourlyContainer.appendChild(card);
    }

    hourlySection.classList.remove('hidden');
}

// Recent Searches
function saveRecentSearch(city, country) {
    let searches = JSON.parse(localStorage.getItem('weatherSearches')) || [];
    const search = `${city}, ${country}`;
    
    // Remove if already exists
    searches = searches.filter(s => s !== search);
    
    // Add to beginning
    searches.unshift(search);
    
    // Keep only 5 recent searches
    searches = searches.slice(0, 5);
    
    localStorage.setItem('weatherSearches', JSON.stringify(searches));
    loadRecentSearches();
}

function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('weatherSearches')) || [];
    recentSearchesList.innerHTML = '';

    if (searches.length === 0) {
        recentSearchesList.innerHTML = '<p class="no-searches">No recent searches yet</p>';
        return;
    }

    searches.forEach(search => {
        const btn = document.createElement('button');
        btn.className = 'recent-search-btn';
        btn.textContent = search;
        btn.addEventListener('click', () => {
            searchInput.value = search.split(',')[0];
            searchWeather();
        });
        recentSearchesList.appendChild(btn);
    });
}
