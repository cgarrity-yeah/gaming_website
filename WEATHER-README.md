# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data using the free Open-Meteo API.

## Features

✨ **Real-Time Weather Data** - Current temperature, humidity, wind speed, and more

🌍 **City Search** - Search for any city worldwide

📍 **Geolocation** - Get weather for your current location

📅 **7-Day Forecast** - Plan ahead with a weekly forecast

⏰ **24-Hour Forecast** - Hour-by-hour weather breakdown

💾 **Recent Searches** - Quick access to your previously searched cities

📱 **Fully Responsive** - Works perfectly on all devices

## Files

```
weather-dashboard/
├── weather-dashboard.html  # Main HTML file
├── weather-styles.css      # All styling
├── weather-script.js       # JavaScript functionality
└── WEATHER-README.md       # This file
```

## Getting Started

1. Open `weather-dashboard.html` in your web browser
2. No API key required! Uses the free Open-Meteo API
3. Search for a city or click the location button to use your current location

## How It Works

### APIs Used

- **Open-Meteo Geocoding API** - Convert city names to coordinates
- **Open-Meteo Weather API** - Fetch weather data for given coordinates

Both APIs are completely free and require no authentication.

### Data Provided

**Current Weather:**
- Temperature
- "Feels Like" temperature
- Weather condition
- Humidity
- Wind speed
- Atmospheric pressure
- Visibility
- UV Index

**Forecasts:**
- 7-day daily forecast (high/low temps, conditions)
- 24-hour hourly forecast (temperature, precipitation chance)

## Customization

### Change Temperature Units

Edit the API URL in `weather-script.js` to add `&temperature_unit=fahrenheit`:

```javascript
const response = await fetch(
    `${WEATHER_API_BASE}/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=fahrenheit&...`
);
```

Then update the display to show "°F" instead of "°C".

### Change Timezone

The dashboard automatically uses the local timezone of the searched location. To force a specific timezone, add:

```
&timezone=America/New_York
```

to the API URL.

### Customize Colors

Edit the gradient colors in `weather-styles.css`:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with Flexbox & Grid
- **Vanilla JavaScript** - No frameworks or dependencies
- **Open-Meteo API** - Free weather data
- **LocalStorage** - Recent searches persistence
- **Geolocation API** - User location detection

## Features in Detail

### Search
- Type any city name and press Enter or click Search
- Automatically finds the best match
- Saves to recent searches automatically

### Location Button
- Click 📍 to use your current location
- Requires browser permission
- Instant weather data for your area

### Recent Searches
- Automatically saves up to 5 recent searches
- Click any to quickly view that weather again
- Data persists even after closing the browser

### Weather Icons
- Dynamic emoji icons based on weather condition
- Visual representation of current and forecast weather

## API Response Example

```json
{
  "current": {
    "temperature_2m": 22.5,
    "relative_humidity_2m": 65,
    "weather_code": 2,
    "wind_speed_10m": 15.3
  },
  "daily": {
    "time": ["2025-05-30", ...],
    "temperature_2m_max": [25.5, ...],
    "temperature_2m_min": [18.2, ...]
  }
}
```

## Error Handling

- Handles missing cities gracefully
- Shows user-friendly error messages
- Handles geolocation permission denial
- Network error handling with retry hints

## Performance

- Lightweight (no external dependencies)
- Fast load times
- Efficient data parsing
- Smooth animations

## Future Enhancements

- [ ] Air quality index (AQI)
- [ ] Sunrise/sunset times
- [ ] Pollen forecasts
- [ ] Weather alerts
- [ ] Multiple location comparison
- [ ] Weather history graphs
- [ ] Push notifications
- [ ] Dark/Light theme toggle

## API Rate Limits

Open-Meteo offers:
- **Free tier:** 10,000 requests/month
- **No authentication required**
- **No credit card needed**

For heavier usage, see their [pricing page](https://open-meteo.com/en/pricing).

## Troubleshooting

### "City not found"
- Check spelling
- Try with country name: "London, UK"
- Use major cities for better results

### Geolocation not working
- Check browser permissions
- Make sure you're on HTTPS (required for geolocation)
- Try allowing location access in browser settings

### Weather data not showing
- Check internet connection
- Refresh the page
- Try a different city

## License

Free to use and modify. The Open-Meteo API is free for non-commercial use.

## Resources

- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [Weather Code Reference](https://open-meteo.com/en/docs#weather_code)
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

**Stay informed about the weather! 🌤️**
