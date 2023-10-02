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
const headerImage = document.getElementById("weather-image");
// Today weather image type variable
const todayImage = document.getElementById("today-image")
// Yesterdays weather image type vraiable
const yesterdayImage = document.getElementById("yesterday-image")
// Tomorrows weather image type vraiable
const tomorrowImage = document.getElementById("tomorrow-image")

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
   // const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&current_weather=true&forecast_days=1`);
    const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&current_weather=true&timezone=auto&past_days=1&forecast_days=3`)

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
function headerDisplayWeather (weatherData) {
    // Set the headerTemp id to a const
    const headerTemp = document.getElementById("headerTemp");
    // Change the text content of the headerTemp id to the current temp
    headerTemp.textContent = `${weatherData.current_weather.temperature}  	\xB0C`;
    // Call weather image type setter
    weatherImageSetter("header", weatherData.current_weather.weathercode)
    // Case correction on inputted value to a variable
    const locationName = caseFixer(inputBox.value)
    // Add user location to header
    locationLabel.textContent += locationName;
    // Remove input box
    inputBox.style.display = "none";
};

// Body weather displaying function. Multi-purpose, i.e. can be used for different days
function bodyDisplay (day, weatherData) {
    // Variable to load information depending on the if statement result
    let dayIndex = 1;
    let theDay = "";

    // If statement to decide which day the information is being loaded for
    if (day === "yesterday") {
        dayIndex = 0;
        theDay = "yesterday";
    } else if (day === "tomorrow") {
        dayIndex = 2;
        theDay = "tomorrow";
    } else if (day === "today") {
        theDay = "today";
    }
    
    //Variable to shorten data name
    const data = weatherData.daily;
    // Variables declared for each info HTML location
    // Set text content to appropriate API info
    weatherImageSetter(`${theDay}`, data.weathercode[dayIndex]);
    const maxTemp = document.getElementById(`${theDay}-max-temp`);
    maxTemp.textContent = data.temperature_2m_max[dayIndex];
    const minTemp = document.getElementById(`${theDay}-min-temp`);
    minTemp.textContent = data.temperature_2m_min[dayIndex];
    const maxApTemp = document.getElementById(`${theDay}-max-a-temp`);
    maxApTemp.textContent = data.apparent_temperature_max[dayIndex];
    const minApTemp = document.getElementById(`${theDay}-min-a-temp`);
    minApTemp.textContent = data.apparent_temperature_min[dayIndex];
    const rainChance = document.getElementById(`${theDay}-rain-chance`);
    rainChance.textContent = data.precipitation_probability_max[dayIndex];
    const windSpeed = document.getElementById(`${theDay}-wind-speed`);
    windSpeed.textContent = data.windspeed_10m_max[dayIndex];
    const sunrise = document.getElementById(`${theDay}-sunrise`);
    sunrise.textContent = data.sunrise[dayIndex].substr(11,5);
    const sunset = document.getElementById(`${theDay}-sunset`);
    sunset.textContent = data.sunset[dayIndex].substr(11,5);
};

function weatherImageSetter (imageLocal, weatherCode) {
    // Variables to use when deciding which image src is updated
    let image

    // Switch statement to decide which image to update
    switch (imageLocal) {
        case "header":
            image = headerImage;
            break;
        case "today":
            image = todayImage;
            break;
        case "yesterday":
            image = yesterdayImage;
            break;
        case "tomorrow":
            image = tomorrowImage;
            break;
    }
    // Sets the img src to a png
    // Switch function to set image depending on the weather code
    switch (weatherCode) {
        // Sunny
        case 0:
            image.src = "sun.png";
            break;
        // Cloudy
        case 1:
        case 2:
        case 3:
            image.src = "partly-cloudy-day.png";
            break;
        // Foggy or Hazay
        case 45:
        case 48:
            image.src = "haze.png";
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
            image.src = "rain.png";
            break;
        // Snowing
        case 71:
        case 73:
        case 75:
        case 85:
        case 86:
            image.src = "snow.png";
            break;
        // Hail
        case 77:
            image.src = "hail.png";
            break;
        // Storm
        case 95:
        case 96:
        case 99:
            image.src = "storm.png";
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
    headerDisplayWeather(weatherData);
    await bodyDisplay("today", weatherData);
    await bodyDisplay("yesterday", weatherData);
    await bodyDisplay("tomorrow", weatherData);
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