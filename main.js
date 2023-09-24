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
    const lati = latiLong[0];
    const long = latiLong[1];
    const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current_weather=true&forecast_days=1`);

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
 

// Call and display function
// async function callAndDisplay (userInput) {

// }

// Testing
// localGen("Haydock");
// weatherFetch(['53.46723', '-2.68166'])