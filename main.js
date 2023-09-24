//Variable location

//Location generating function
async function localGen (userInput) {
    const response = await fetch (`https://geocoding-api.open-meteo.com/v1/search?name=${userInput}&count=1&language=en&format=json`);
    const localData = await response.json();
    // console.log(localData)
    const lati = localData.results[0].latitude;    
    const long = localData.results[0].longitude;
    return lati.toString(), long.toString();
}

localGen("Haydock");