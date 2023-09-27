// Variable location

// Location generating function
async function localGen (userInput) {
    const response = await fetch (`https://geocoding-api.open-meteo.com/v1/search?name=${userInput}&count=1&language=en&format=json`);
    const localData = await response.json();
    // console.log(localData)
    const latiLong = [localData.results[0].latitude.toString(), localData.results[0].longitude.toString()]    
    return latiLong;
}

// Weather fetching function
async function weatherFetch(latiLong) {
    const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&current_weather=true&forecast_days=1`);

    if (!response.ok) {
        alert(`Request error. Status: ${response.status}`);
        console.error(`status: ${response.status}`);
        console.error(`text: ${await response.text()}`);
        return;
    }

    const weatherData = await response.json();
    return weatherData;
}

// Display function
function displayWeather (weatherData) {
    // Set the headerTemp id to a const
    const headerTemp = document.getElementById("headerTemp");
    // Change the text content of the headerTemp id to the current temp
    headerTemp.textContent = `${weatherData.current_weather.temperature}`;

    // Create a const for the weather-image img tag
    const weatherImage = document.getElementById("weather-image");
    // Sets the img src to a png
    weatherImage.src = "partly-cloudy-day.png";
}

// Call and display function
async function callAndDisplay (userInput) {
    // Using user inputted location, generate latitude and longitude and se to latiLong.
    const latiLong = await localGen(userInput);
    // Put user location latiLong into the weatherFetch function to generate weather data.
    const weatherData = await weatherFetch(latiLong);
    // Calls the display function to update the DOM with user weather
    displayWeather(weatherData);
}

// Event listeners
const userLocal = document.getElementById("user-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", async function () {
    // If function to return an alert if user had not inputted a location.
    if (userLocal.value === "") {
        alert("Please input a location");
        return;
    }
    // Calls the callAndDisplay function with user location
    await callAndDisplay(userLocal.value);
    // Resets the inputted value
    userLocal.value = "";
})




// // Testing
// localGen("Bedford");
// weatherFetch(['53.46723', '-2.68166']);
// await callAndDisplay("Bedford");