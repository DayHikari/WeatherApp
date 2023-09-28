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
    // Switch function to set image depending on the weather code
    switch (weatherData.current_weather.weathercode) {
        case 0:
            weatherImage.src = "sun.png";
            break;
        case 1:
        case 2:
        case 3:
            weatherImage.src = "partly-cloudy-day.png";
            break;
        case 45:
        case 48:
            weatherImage.src = "haze.png";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            weatherImage.src = "rain.png";
            break;
        case 71:
        case 73:
        case 75:
        case 85:
        case 86:
            weatherImage.src = "snow.png";
            break;
        case 77:
            weatherImage.src = "hail.png";
            break;
        case 95:
        case 96:
        case 99:
            weatherImage.src = "storm.png";
            break;
    }

    // Add user location to header
    const locationTitle = document.getElementById("user-input-local")
    const inputBox = document.getElementById("user-location");
    locationTitle.textContent = inputBox.value;
    // Remove input box
    inputBox.style.display = "none";
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