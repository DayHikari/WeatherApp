// // Variable location
// Header label variable
const locationLabel = document.getElementById("location-label");
// Header location input variable
const inputBox = document.getElementById("location-input");
// Header submit button variable
const submit = document.getElementById("submit");
// Header redo image tag variable
const redo = document.getElementById("redo");
// Header weather image type variable
const weatherImage = document.getElementById("weather-image");

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
    // Call weather image type setter
    weatherImageSetter(weatherData.current_weather.weathercode)
    // Case correction on inputted value to a variable
    const locationName = caseFixer(inputBox.value)
    // Add user location to header
    locationLabel.textContent += locationName;
    // Remove input box
    inputBox.style.display = "none";
}

function weatherImageSetter (weatherCode) {
    // Sets the img src to a png
    // Switch function to set image depending on the weather code
    switch (weatherCode) {
        // Sunny
        case 0:
            weatherImage.src = "sun.png";
            break;
        // Cloudy
        case 1:
        case 2:
        case 3:
            weatherImage.src = "partly-cloudy-day.png";
            break;
        // Foggy or Hazay
        case 45:
        case 48:
            weatherImage.src = "haze.png";
            break;
        // Raining
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
        // Snowing
        case 71:
        case 73:
        case 75:
        case 85:
        case 86:
            weatherImage.src = "snow.png";
            break;
        // Hail
        case 77:
            weatherImage.src = "hail.png";
            break;
        // Storm
        case 95:
        case 96:
        case 99:
            weatherImage.src = "storm.png";
            break;
    }
}

// Function to put proper case on user input
function caseFixer (location) {
    // Convert string to an array all in lower case
    const letterArray = location.toLowerCase().split("");
    // Set the first letter in the array to uppercase
    letterArray[0] = letterArray[0].toUpperCase();
    // Join the array into a string with no commas and return
    return letterArray.join("");
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

// // Event listeners
// Submit button event listener to take in user input
submit.addEventListener("click", async function () {
    // If function to return an alert if user had not inputted a location.
    if (inputBox.value === "") {
        alert("Please input a location");
        return;
    }
    // Calls the callAndDisplay function with user location
    await callAndDisplay(inputBox.value);
    // Resets the inputted value
    inputBox.value = "";
    // Change submit to re-submit
    submit.style.display = "none";
    // Make redo inline
    redo.style.display = "inline";
    // // Add redo image src
    // redo.src = "redo.png";
})

// Redo button event listener to allow new location
redo.addEventListener("click"), function () {
    // // Remove redo image src
    // redo.src = "";
    // Un-display redo
    redo.style.disply = "none";
    // Change header text back, removing user location
    locationLabel.textContent = "Location: ";
    // Un-remove input box
    inputBox.style.display = "inline"
    // Un-remove submit button
    submit.style.display = "inline"
}




// // Testing
// localGen("Bedford");
// weatherFetch(['53.46723', '-2.68166']);
// await callAndDisplay("Bedford");