import {
  getWeatherByCity,
  getWeatherByCoords,
  getCitySuggestions,
} from './api.js'

const searchIcon = document.querySelector('.search-icon')
const searchInput = document.querySelector('#search')
const weatherInfo = document.querySelector('.weather-info')
const loader = document.querySelector('.loader')
const suggestions = document.querySelector('#suggestions')

// Show weather info
function ShowWeather(data) {
  loader.style.display = 'none'
  const temp = Math.round(data.main.temp)
  const name = data.name
  const weatherMain = data.weather[0].main
  const icons = {
    Clear: 'images/icon-sunny.webp',
    Clouds: 'images/icon-partly-cloudy.webp',
    Rain: 'images/icon-rain.webp',
    Snow: 'images/icon-snow.webp',
    Drizzle: 'images/icon-drizzle.webp',
    Thunderstorm: 'images/icon-storm.webp',
    Fog: 'images/icon-overcast.webp',
    Mist: 'images/icon-overcast.webp',
    Overcast: 'images/icon-overcast.webp',
  }
  const iconUrl = icons[weatherMain] || 'images/icon-sunny.webp'

  weatherInfo.innerHTML = `
        <div class="weather-info-image"><img src="${iconUrl}" alt="${weatherMain}"></div>
        <div class="weather-info-1"><h2>${temp}°C</h2><h2>${name}</h2></div>
        <div class="weather-info-2"> 
            <div>humidity <h2>${data.main.humidity}</h2><img src="images/weather.png" alt=""></div>
            <div>wind speed <h2>${data.wind.speed}</h2><img src="images/wind.png" alt=""></div>
        </div>
    `
}

// Search weather by city
function searchWeather() {
  const cityName = searchInput.value.trim()
  if (!cityName) {
    loader.style.display = 'none'
    weatherInfo.innerHTML = `<p style="color:#ffd93d; margin-top:50px; text-align:center;">Please enter the city name.</p>`
    return
  }

  loader.style.display = 'block'
  weatherInfo.innerHTML = ''

  getWeatherByCity(cityName)
    .then(ShowWeather)
    .catch((error) => {
      loader.style.display = 'none'
      weatherInfo.innerHTML = `<p style="color:#ff6b6b; margin-top:50px;">City name not found!</p>`
      console.error(error)
    })
}

// Search on icon click or Enter
searchIcon.addEventListener('click', searchWeather)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchWeather()
})

// Geolocation
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error)
  } else {
    console.log('Geolocation not supported.')
  }
}
function success(position) {
  loader.style.display = 'block'
  const lat = position.coords.latitude
  const lon = position.coords.longitude

  getWeatherByCoords(lat, lon)
    .then((data) => {
      if (!data.name || data.name === 'Cherni Gorod') data.name = 'Baku'
      ShowWeather(data)
    })
    .catch((err) => {
      loader.style.display = 'none'
      weatherInfo.innerHTML = `<p style="color:#ff6b6b; margin-top:50px;">City name not found!</p>`
      console.error(err)
    })
}
function error() {
  weatherInfo.innerHTML = `<p style="color:#ffd93d; margin-top:50px;">Location access denied. Please search manually.</p>`
}

// Suggestions
searchInput.addEventListener('input', () => {
  const value = searchInput.value.trim()
  suggestions.innerHTML = ''
  if (!value) {
    suggestions.style.display = 'none'
    return
  }

  getCitySuggestions(value).then((cities) => {
    cities.forEach((city) => {
      const div = document.createElement('div')
      div.textContent = `${city.name}, ${city.country}`
      div.classList.add('suggestion-item')
      div.addEventListener('click', () => {
        searchInput.value = city.name
        suggestions.innerHTML = ''
        suggestions.style.display = 'none'
        searchWeather()
      })
      suggestions.appendChild(div)
    })
    suggestions.style.display = cities.length ? 'block' : 'none'
  })
})

// Hide suggestions on click outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.innerHTML = ''
    suggestions.style.display = 'none'
  }
})
function test() {
  console.log('salam')
}
test()
