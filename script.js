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
            addToSearchHistory(data.name);
            displaySearchHistory();
        })
        .catch(error => console.log("Error fetching weather data: ", error));
}

function updateWeatherInfo(data) {
    document.getElementById("city-name").innerText = data.name;
    const todayDate = new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById("date-0").innerText = "Date: " + new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById("temp-0").innerText = "Temperature: " + data.main.temp + "°C";
    document.getElementById("wind-0").innerText = "Wind: " + data.wind.speed + " m/s";
    document.getElementById("humid-0").innerText = "Humidity: " + data.main.humidity + "%";
}

function addToSearchHistory(cityName) {
    // Add the city to the search history array
    searchHistory.push(cityName);
    localStorage.setItem('searchhistory', searchHistory);
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
                    <p class="card-text" id="temp">Temperature: ${forecastDays[i].main.temp}°C</p>
                    <p class="card-text" id="wind">Wind: ${forecastDays[i].wind.speed} m/s</p>
                    <p class="card-text" id="humid">Humidity: ${forecastDays[i].main.humidity}%</p>
                `;
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
