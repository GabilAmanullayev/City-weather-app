const apiKey = import.meta.env.VITE_API_KEY

export function getWeatherByCity(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    return fetch(apiUrl).then(res => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
    });
}

export function getWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return fetch(apiUrl).then(res => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
    });
}

export function getCitySuggestions(value, limit = 3) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=${limit}&appid=${apiKey}`)
        .then(res => res.json());
}