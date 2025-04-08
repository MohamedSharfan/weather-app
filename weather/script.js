const searchbtn = document.querySelector('.search-btn');
const cityInput = document.querySelector('.city-input');

const weatherInfoSection = document.querySelector('.weather_info');
const searchCitySection = document.querySelector('.search_city_info');
const notfoundSection = document.querySelector('.notfound_info');

const countryTxt = document.querySelector('.country_txt');
const date = document.querySelector('.current_date_txt');
const weatherImg = document.querySelector('.weather_summery');
const tempTxt = document.querySelector('.temp_txt');
const weatherTxt = document.querySelector('.weather_txt');
const humaidity = document.querySelector('.humidity_value'); 
const wind = document.querySelector('.wind_value');

const forecast = document.querySelector('.forcast_container');

const apiKey = '';

searchbtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});
cityInput.addEventListener('keydown', (event) => {
    if(event.key =='Enter' && cityInput.value.trim() != '' ){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl);

    return response.json();
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'atmosphere.svg';
    if(id <= 800) return 'clear.svg';
    else return 'clouds.svg';

    console.log(id);
    
}

function currentDate() {
    const currentD = new Date();
    const option ={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentD.toLocaleDateString('en-GB', option); 
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    
    if(weatherData.cod != 200){
        showDisplaySection(notfoundSection);
        return;
    }

    const {
        name : country,
        main : {temp, humidity},
        weather : [{id, main}],
        wind : {speed}
    } = weatherData

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    weatherTxt.textContent = main;
    humaidity.textContent = humidity + '%';
    wind.textContent = speed + 'M/s';

    date.textContent = currentDate();
    weatherImg.src =`./assets/weather/${getWeatherIcon(id)}`;

    await updateForcastInfo(city);

    showDisplaySection(weatherInfoSection);
}

async function updateForcastInfo(city) {
    const forcastData = await getFetchData('forecast', city);
    
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecast.innerHTML = ''
    
    forcastData.list.forEach(forecastWeather  => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForcastItem(forecastWeather);
            
        }
        
    } )
    
    
}

function updateForcastItem(weatherData) {
    const {
        dt_txt: date,
        weather:[{id}],
        main : {temp}
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day:'2-digit',
        month:'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption );

    const forecastItem =`
        <div class="forcast_box">
            <h5 class="forcast_date">${dateResult}</h5>
            <img src="./assets/weather/${getWeatherIcon(id)}" alt="" class="forcast_img">
            <h4 class="forcast">${Math.round(temp)}°C</h4>
        </div>
    `;
    forecast.insertAdjacentHTML('beforeend', forecastItem);
}



function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notfoundSection]
    .forEach(section => {
        section.style.display='none';
    });
    section.style.display = 'flex';
}
