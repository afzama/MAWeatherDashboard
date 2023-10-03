const apiKey = "10216d4aaed49c4ee7392d040f6d98e3";
const searchHistory = localStorage.getItem('searchhistory')?.split(',') || [];
const searchHistoryElement = document.getElementById("search-history");

//fetch the weather for a searched city, add to search history, and display weather data
function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            updateWeatherInfo(data);
            addToSearchHistory(data.cityName);
            displaySearchHistory();
        })
        .catch(error => console.log("Error fetching weather data: ", error));
}
//update the weather data on page under its respective headings
function updateWeatherInfo(data) {
    document.getElementById("city-name").innerText = data.name;
    const todayDate = new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById("icon-0").innerHTML = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">`;
    document.getElementById("date-0").innerText = "Date: " + new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById("temp-0").innerText = "Temperature: " + (data.main.temp - 273.15).toFixed(2) + "°C";
    document.getElementById("wind-0").innerText = "Wind: " + data.wind.speed + " m/s";
    document.getElementById("humid-0").innerText = "Humidity: " + data.main.humidity + "%";
}
//Add searched city to the search history
function addToSearchHistory(data, cityName) {
    searchHistory.push(cityName);
    localStorage.setItem('searchhistory', searchHistory);

    // Display weather icon
    const iconElement = document.getElementById("icon-0");
    if (data.weather[0] && data.weather[0].icon) {
        const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        iconElement.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
    }
}

function displaySearchHistory() {
    const searchHistoryElement = document.getElementById("search-history");
    if (searchHistoryElement) {
        searchHistoryElement.innerHTML = ""; // Clear previous content
        // Display each city in the search history
        searchHistory.forEach(city => {
            const button = document.createElement("button");
            button.innerText = city;
            button.addEventListener("click", () => {
                fetchWeatherData(city);
                displayFiveDayForecast(city);
            });
            searchHistoryElement.appendChild(button);
        });
    } else {
        console.error("Element with ID 'search-history' not found.");
    }
}


//retrieve weather forecast data for next 5 days
function displayFiveDayForecast(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDays = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            const forecastContainer = document.getElementById("forecast-cards");

            for (let i = 0; i < forecastDays.length; i++) {
                const card = document.createElement("div");
                card.classList.add("card");
                const dateId = `date-${i + 1}`;
                const date = new Date(forecastDays[i].dt * 1000).toLocaleDateString();
                card.innerHTML = `
                    <div class="card-body" id="${dateId}">Date: ${date}</div>
                    <h2 class="selectcity">City: ${cityName}</h2>
                    <p class="card-text" id="temp">Temperature: ${(forecastDays[i].main.temp - 273.15).toFixed(2)}°C</p>
                    <p class="card-text" id="wind">Wind: ${forecastDays[i].wind.speed} m/s</p>
                    <p class="card-text" id="humid">Humidity: ${forecastDays[i].main.humidity}%</p>
                `;
                // Display weather icon for each day
                const iconElement = document.createElement("div");
                iconElement.classList.add("weather-icon");
                if (forecastDays[i].weather[0] && forecastDays[i].weather[0].icon) {
                    const iconUrl = `https://openweathermap.org/img/w/${forecastDays[i].weather[0].icon}.png`;
                    iconElement.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
                    card.appendChild(iconElement);
                }
                forecastContainer.appendChild(card);
            }
        })
        .catch(error => console.log("Error fetching forecast data: ", error));
}
document.querySelector("#search-button").addEventListener("click", function () {
    const city = document.getElementById("citysearch").value;
    fetchWeatherData(city);
    displayFiveDayForecast(city);
});

// Initial display of search history
displaySearchHistory();
