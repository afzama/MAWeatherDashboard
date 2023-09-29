var url = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=10216d4aaed49c4ee7392d040f6d98e3"
fetch(url).then(function (res) {
    return res.json()
}).then(function (data) {
    console.log(data)
})
console.log("Hello City Traverlers");
