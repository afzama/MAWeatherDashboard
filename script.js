const apiKey = "10216d4aaed49c4ee7392d040f6d98e3";
const searchHistory = [];

function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={10216d4aaed49c4ee7392d040f6d98e3}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            addToSearchHistory(cityName);
            displaySearchHistory();
        })
        .catch(error => console.log("Error fetching weather data: ", error));
}
function updateWeatherInfo(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("date").innerText = "Date: " + new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById("temp").innerText = "Temperature: " + data.main.temp + "°C";
    document.getElementById("wind").innerText = "Wind: " + data.wind.speed + " m/s";
    document.getElementById("humid").innerText = "Humidity: " + data.main.humidity + "%";
}

function addToSearchHistory(cityName) {
    // Add the city to the search history array
    searchHistory.push(cityName);
}

function displaySearchHistory() {
    const searchHistoryElement = document.getElementById("search-history");
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
}

document.querySelector("button").addEventListener("click", function () {
    const city = document.getElementById("citysearch").value;
    fetchWeatherData(city);
});

// Initial display of search history
displaySearchHistory();

// Event listener for the Search button
document.querySelector("button").addEventListener("click", function () {
    const city = document.getElementById("citysearch").value;
    fetchWeatherData(city);
});

// Call fetchWeatherData function for an initial city (e.g., Atlanta)
fetchWeatherData("Atlanta");