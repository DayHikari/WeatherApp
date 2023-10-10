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
const todayImage = document.getElementById("today-image");

// Yesterdays weather image type vraiable
const yesterdayImage = document.getElementById("yesterday-image");

// Tomorrows weather image type vraiable
const tomorrowImage = document.getElementById("tomorrow-image");

// 7 day forecast div listener
const sevenDayDiv = document.querySelectorAll(".sevenDays");

// Submitted variable
let submitted = 0;

// // Location and weather data generating functions
// Location generating function
async function localGen(userInput) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${userInput}&count=1&language=en&format=json`
  );

  const localData = await response.json();

  // console.log(localData)
  const latiLong = [
    localData.results[0].latitude.toString(),
    localData.results[0].longitude.toString(),
  ];

  return latiLong;
}

// Weather fetching function
async function weatherFetch(latiLong) {
  // const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&current_weather=true&forecast_days=1`);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&current_weather=true&timezone=auto&past_days=1`
  );

    // Error handling
  if (!response.ok) {
    alert(`Request error. Status: ${response.status}`);

    console.error(`status: ${response.status}`);

    console.error(`text: ${await response.text()}`);

    return;
  }

  // Make data readable
  const weatherData = await response.json();

    // Return data
  return weatherData;
}

// Function to fetch the hourly weather information
async function hourlyWeatherFetch (latiLong) {
    // Set the fetch value to variable
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latiLong[0]}&longitude=${latiLong[1]}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode&daily=sunrise,sunset&timezone=auto`);

    //Error handling
    if (!response.ok) {
        alert(`Request error. Status: ${response.status}`);
    
        console.error(`status: ${response.status}`);
    
        console.error(`text: ${await response.text()}`);
    
        return;
      }

    // Make data readble
    const hourlyData = await response.json();

    // Return the data
    return hourlyData;
}

// // Header
// Header display function
function headerDisplayWeather(weatherData) {
  // Set the headerTemp id to a const
  const headerTemp = document.getElementById("headerTemp");

  // Change the text content of the headerTemp id to the current temp
  headerTemp.textContent = `${weatherData.current_weather.temperature}  	\xB0C`;

  // Call weather image type setter
  headerImage.src = weatherImageSetter(weatherData.current_weather.weathercode);

  // Case correction on inputted value to a variable
  const locationName = caseFixer(inputBox.value);

  // Add user location to header
  locationLabel.textContent += locationName;

  // Remove input box
  inputBox.style.display = "none";
}

// // Main body
// Body weather displaying function. Multi-purpose, i.e. can be used for different days
function bodyDisplay(day, weatherData) {
  // Variable to load information depending on the if statement result
  let dayIndex = 1;
  let theDay = "";
  //Variable to shorten data name
  const data = weatherData.daily;

  // If statement to decide which day the information is being loaded for
  if (day === "yesterday") {
    dayIndex = 0;
    theDay = "yesterday";
    yesterdayImage.src = weatherImageSetter(data.weathercode[dayIndex]);
  } else if (day === "tomorrow") {
    dayIndex = 2;
    theDay = "tomorrow";
    tomorrowImage.src = weatherImageSetter(data.weathercode[dayIndex]);
  } else if (day === "today") {
    theDay = "today";
    todayImage.src = weatherImageSetter(data.weathercode[dayIndex]);
  }

  // Variables declared for each info HTML location
  // Set text content to appropriate API info

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
  sunrise.textContent = data.sunrise[dayIndex].substr(11, 5);

  const sunset = document.getElementById(`${theDay}-sunset`);
  sunset.textContent = data.sunset[dayIndex].substr(11, 5);
}

// // 7 Day forecast
// Function to set the 7 day forecast boxes
async function dailyForecastDisplay(weatherData) {
  // Declare variable to daily data
  const daily = weatherData.daily;
  const info = Object.keys(daily);

  // For loop to interate through daily
  for (let i = 0; i < info.length; i++) {
    // For loop to interate through each dataset in daily
    for (let j = 1; j < daily[info[i]].length; j++) {
      // DOM manipulation of the forecast boxes to increase height
      const div = document.getElementById(`day${j}-div`);
      div.style.height = "120px";

      // Switch statement to set DOM depending on dataset
      switch (info[i]) {
        case "time":
          const day = document.getElementById(`day${j}-date`);
          day.textContent = daily[info[i]][j];
          break;
        case "weathercode":
          const image = document.getElementById(`day${j}-image`);
          image.src = `${await weatherImageSetter(daily[info[i]][j])}`;
          image.style.display = "block";
          break;
        case "temperature_2m_min":
          const temp = document.getElementById(`day${j}-temp`);
          temp.textContent = `Temp: ${daily[info[i]][j]} / ${
            daily[info[i - 1]][j]
          } \xB0C`;
          break;
        case "precipitation_probability_max":
          const rain = document.getElementById(`day${j}-rain`);
          rain.textContent = `Rain Chance: ${daily[info[i]][j]}%`;
          break;
        default:
          continue;
      }
    }
  }
}

// Function to set the hourly information for the selected date
async function hourlyDisplay(day, hourlyData) {
    // Set date to the box date
    document.getElementById("overview-date").textContent = hourlyData.daily.time[day];

    // Set sunrise time
    const test = document.querySelector("#sunrise-time");
    console.log(test);
    console.log(document.getElementById("sunrise-time"))
    document.getElementById("sunrise-time").textContent = `${hourlyData.daily.sunrise[day].substr(11, 5)}`;
    
    // Set sunset time
    document.getElementById("overview-sunset-time").textContent = hourlyData.daily.sunset[day].substr(11, 5);

    // Set hourly temp using for loop
    for (let i = 0; i < 24; i++) {
        // Setting the temp values
        document.getElementById(`temp${i}`).textContent = hourlyData.hourly.temperature_2m[day * 24 + i];

        // Setting the apparent temp values
        document.getElementById(`atemp${i}`).textContent = hourlyData.hourly.apparent_temperature[day * 24 + i];

        // Setting the rain chance
        document.getElementById(`rainchance${i}`).textContent = hourlyData.hourly.precipitation_probability[day * 24 + i];

        // Setting the weather image
        document.getElementById(`weatherimage${i}`).src = weatherImageSetter(hourlyData.hourly.weathercode[day * 24 + i]);
    }
}

// // Weather image setter
// Function to set the src of image tags to the appropriate weather image
function weatherImageSetter(weatherCode) {
  // Variables to use when deciding which image src is updated
  let source;

  // // Switch statement to decide which image to update
  // switch (imageLocal) {
  //     case "header":
  //         image = headerImage;
  //         break;
  //     case "today":
  //         image = todayImage;
  //         break;
  //     case "yesterday":
  //         image = yesterdayImage;
  //         break;
  //     case "tomorrow":
  //         image = tomorrowImage;
  //         break;
  //     default:
  //         break;
  // };

  // Sets the img src to a png
  // Switch function to set image depending on the weather code
  switch (weatherCode) {
    // Sunny
    case 0:
      source = "sun.png";
      break;
    // Cloudy
    case 1:
    case 2:
    case 3:
      source = "partly-cloudy-day.png";
      break;
    // Foggy or Hazay
    case 45:
    case 48:
      source = "haze.png";
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
      source = "rain.png";
      break;
    // Snowing
    case 71:
    case 73:
    case 75:
    case 85:
    case 86:
      source = "snow.png";
      break;
    // Hail
    case 77:
      source = "hail.png";
      break;
    // Storm
    case 95:
    case 96:
    case 99:
      source = "storm.png";
      break;
  }
  return source;
}

// // Case fixer for header
// Function to put proper case on user input
function caseFixer(location) {
  // Variable for the final concatted name
  let correctName = "";

  // Variable for the location name split at any spaces
  let nameArray = [];

  // If statement to split the location name at spaces and assign to nameArray, or just assign the location name.
  if (location.indexOf(" ") >= 0) {
    nameArray = location.toLowerCase().split(" ");
  } else {
    nameArray = [location.toLowerCase()];
  }

  // For loop to cycle through any/all indexes in nameArray
  for (let i = 0; i < nameArray.length; i++) {
    // If statement so that the first location word is added straight to correctName variable after have the case corrected
    if (i === 0) {
      // Splits the first word into letter
      const letterArray = nameArray[i].split("");

      // Changes first letter to a capital letter
      letterArray[0] = letterArray[0].toUpperCase();

      // Sets correct name to the re-joined first word of the location which now has correct cases
      correctName = letterArray.join("");
    } else {
      /* Else section is to perform the same as above but adding a space at the beginning of the word*/
      // Splits the current index word to letter in letterArray
      const letterArray = nameArray[i].split("");

      // Changes the first letter in the array to capital
      letterArray[0] = letterArray[0].toUpperCase();

      // Concats the corrected word onto the correctName variable with a space to separate words.
      correctName += ` ${letterArray.join("")}`;
    }
  }

  // Return the concatted case correct name
  return correctName;
}

// // Call and display functions
// Call and display function
async function callAndDisplay(userInput) {
  // Using user inputted location, generate latitude and longitude and se to latiLong.
  const latiLong = await localGen(userInput);

  // Put user location latiLong into the weatherFetch function to generate weather data.
  const weatherData = await weatherFetch(latiLong);

  // Calls the display function to update the DOM with user weather
  headerDisplayWeather(weatherData);

  await bodyDisplay("today", weatherData);

  await bodyDisplay("yesterday", weatherData);

  await bodyDisplay("tomorrow", weatherData);

  await dailyForecastDisplay(weatherData);
};

async function hourlyCallAndDisplay (day) {
    // Create array variable containing latitude and longitude
    const latiLong = await localGen(inputBox.value);

    // Feed latiLong into data fetch function
    const  hourlyData = await hourlyWeatherFetch(latiLong);

    //Call the display function
    await hourlyDisplay(day, hourlyData);
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

  // Change submit to re-submit
  submit.style.display = "none";

  // Make redo inline
  redo.style.display = "inline";

  // Change submitted value
  submitted = 1;
});

// Redo button event listener to allow new location
redo.addEventListener("click", function () {
  // Resets the inputted value
  inputBox.value = "";

  // Un-display redo
  redo.style.disply = "none";

  // Change header text back, removing user location
  locationLabel.textContent = "Location: ";

  // Un-remove input box
  inputBox.style.display = "inline";

  // Un-remove submit button
  submit.style.display = "inline";

  // Change submitted value
  submitted = 0;
});

// Event listener for the 7 day forecast boxes (mouser over)
// The sevenDayDiv is an array of elements. The .forEach is a built in function which will perform a function for each element in the array.
sevenDayDiv.forEach(function (elem) {
  // This adds a "mouseenter" event listener for each element in the array
  elem.addEventListener("mouseenter", function () {
    // This if prevents the function performing before weatherdata has been found
    if (submitted === 1) {
      // Set the box height to 250px
      elem.style.height = "250px";

      // Initiates a variable to the character at index 3 of the id of the event element. This is the box number.
      const boxNum = elem.id.charAt(3);

      // This selects all hid class elements of the same number as the event element and then for each element sets the display to block to be viewed.
      document
        .querySelectorAll(`.hid${boxNum}`)
        .forEach((elem) => (elem.style.display = "block"));
    }
  });
});

// Event listener for forecast box click
sevenDayDiv.forEach(function (elem) {
    elem.addEventListener("click", async function () {
      if (submitted === 1) {
        // Set the day variable to elem id at 3 but -1 to account for "0"
        const day = elem.id.charAt(3) - 1;
        
        // Call the call and display function
        await hourlyCallAndDisplay(day);
      }
    });
  });

// Event listener for "mouseleave".
// Same as "mouseenter" but opposite effect.

sevenDayDiv.forEach(function (elem) {
  elem.addEventListener("mouseleave", function () {
    if (submitted === 1) {
      elem.style.height = "120px";

      const boxNum = elem.id.charAt(3);

      document
        .querySelectorAll(`.hid${boxNum}`)
        .forEach((elem) => (elem.style.display = "none"));
    }
  });
});

// // Testing
// localGen("Bedford");
// weatherFetch(['53.46723', '-2.68166']);
// await callAndDisplay("Bedford");
