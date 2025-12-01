const apiKey = "8489e45d4dd5537c5ce1862716269412";
const searchIcon = document.querySelector(".search-icon")
const searchInput = document.querySelector("#search")
const weatherInfo = document.querySelector(".weather-info")

const loader = document.querySelector(".loader");
const suggestions = document.querySelector("#suggestions");


function searchWeather() {
    const cityName = searchInput.value.trim()
    if (!cityName) {
        loader.style.display = "none";
        weatherInfo.innerHTML = `<p style="color:#ffd93d; margin-top:50px; text-align:center;">Please enter the city name.</p>`;
        return;
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    // Loader-i göstər
    loader.style.display = "block";
    weatherInfo.innerHTML = "";

    fetch(apiUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error`)
            }
            return res.json()
        })
        .then(data => {
            ShowWeather(data)

        })
        .catch(error => {
            loader.style.display = "none";
            weatherInfo.innerHTML = `<p style="color:#ff6b6b; margin-top:50px;">City name not found!</p>`;
            console.error("Xəta:", error);
        });

}
searchIcon.addEventListener('click', () => {
    searchWeather()


})
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchWeather();
    }
});
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
        console.log("Geolocation dəstəklənmir.");
    }
}

function success(position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    loader.style.display = "block"
    weatherInfo.innerHTML = "";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.name || data.name === "Cherni Gorod") {
                data.name = "Baku";
            }
            ShowWeather(data)
        })
        .catch(error => {
            loader.style.display = "none";
            weatherInfo.innerHTML = `<p style="color:#ff6b6b; margin-top:50px;">City name not found!</p>`;
            console.error("Xəta:", error);
        });
}
function error() {
    weatherInfo.innerHTML = `<p style="color:#ffd93d; margin-top:50px;">Location access denied. Please search manually.</p>`;
}

function ShowWeather(data) {
    console.log(data);
    loader.style.display = "none";
    const temp = Math.round(data.main.temp)
    const name = data.name
    const weatherMain = data.weather[0].main;
    const icons = {
        Clear: "images/icon-sunny.webp",
        Clouds: "images/icon-partly-cloudy.webp",
        Rain: "images/icon-rain.webp",
        Snow: "images/icon-snow.webp",
        Drizzle: "images/icon-drizzle.webp",
        Thunderstorm: "images/icon-storm.webp",
        Fog: "images/icon-overcast.webp",
        Mist: "images/icon-overcast.webp",
        Overcast: "images/icon-overcast.webp"
    };
    const iconUrl = icons[weatherMain] || "images/icon-sunny.webp";

    weatherInfo.innerHTML = `<div class=" weather-info-image"><img src="${iconUrl}" alt="${weatherMain}"></div>
                     <div class=" weather-info-1"><h2>${temp}°C</h2><h2>${name}</h2></div>
                     <div class=" weather-info-2"> 
                     <div>humidity <h2> ${data.main.humidity}</h2><img src="images/weather.png" alt=""></div>
                     <div>wind speed<h2> ${data.wind.speed}</h2><img src="images/wind.png" alt=""></div>
                    </div>`


}
searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();
    suggestions.innerHTML = "";

    if (!value) {
        suggestions.style.display = "none";
        return;
    }


    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=3&appid=${apiKey}`)
        .then(res => res.json())
        .then(cities => {
            cities.forEach(city => {
                const div = document.createElement("div");
                div.textContent = `${city.name}, ${city.country}`;
                div.classList.add("suggestion-item");
                div.addEventListener("click", () => {
                    searchInput.value = city.name;
                    suggestions.innerHTML = "";
                    suggestions.style.display = "none";
                    searchWeather();
                });
                suggestions.appendChild(div);
            });

            suggestions.style.display = cities.length ? "block" : "none";
        });
});
document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
    }
});