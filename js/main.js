const mockupResponse = require('./mockup');
const Chartist = require('chartist');
const icon = require('./icons');

// Funkcja uzupełnia informację dla danego dnia
function fillDayInfo( dayIndex, data ) {

    // Złapanie odpowiedniego div'a z dniem
    const day = document.querySelectorAll(".day")[dayIndex];
    // Złapanie odpowiedniego obiektu JSON z dniem
    const forecast = data.DailyForecasts[dayIndex];
    // Nazwa dnia
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(forecast.Date);
    const dayName = dayIndex == 0 ? "Today" : days[date.getDay()];
    day.querySelector('h2').textContent = dayName;

    // Temperatura
    const temperature = forecast.Temperature.Maximum.Value;
    day.querySelector('.temperature').textContent = Math.round(temperature) + '°C';
    
    // Ikona
    const iconId = forecast.Day.Icon;
    day.querySelector('.icon').className = 'icon ' + icon[iconId];

    // Opis
    day.querySelector('.forecast').textContent = forecast.Day.ShortPhrase;
}
let locationId = '273125';
// Funkcja uruchamiana przy starcie strony, pobiera 
// dane (tymczasowo mockupResponse) i uzupełnia poszczególne dni informacjami
async function refresh(){
    console.log(locationId)
    let apiKey = 'q4yfgRGEhyRygj2fDKAZA02kiOUDkaPP'
    let additions = '&details=true&metric=true';

    // let response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationId}?apikey=${apiKey}${additions}`);
    // let data = await response.json();
    // let str = JSON.stringify(data);
    // console.log(data);
    // document.querySelector('#json').innerHTML = str;

    // let x = mockupResponse.Headline.Text;

    for( let i = 0; i < 5; i++ ) {
        fillDayInfo( i, mockupResponse );
    }
    fillDetailsInfo(mockupResponse);
    makeCharts(mockupResponse);
}
refresh();
//szukajka lokacji
async function getLocation(e){
    e.preventDefault();
    let apiKey = 'drOPfTFPJtMpmZP8HhGBAmXmfx5wMytH'
    let additions = '&details=true&metric=true';
    const city = document.querySelector("#input-location").value;
    const gl = async () => {
        let response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`);
        let data = await response.json();
        try {
             locationId = data[0].Key;
        } catch (error) {
            console.log('Wrong city')
        }
    }
    await gl()
    refresh();  
}
document.querySelector("#form-location").addEventListener("submit", getLocation);
//wykresiki
function makeCharts(data){
    makeTemperatureChart(data);
    makeRainChart(data);
}
function makeTemperatureChart(data){
        var params = {
            labels: [],
            series: [
                [],
                []
            ]
        };
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (let i = 0; i < 5; i++) {
            let forecast = data.DailyForecasts[i];
            let date = new Date(forecast.Date);
            params.labels.push(days[date.getDay()]);
            params.series[0].push(forecast.Temperature.Maximum.Value);
            params.series[1].push(forecast.RealFeelTemperature.Maximum.Value);
        }


        var options = {
            showPoint: false,
            //lineSmooth: false,
            axisX: {
                //showGrid: false
            },
            axisY: {
                onlyInteger: true,
                labelInterpolationFnc: function (value) {
                    return value + ' °C';
                },
            }
        };
        var responsiveOptions = [
            ['screen and (min-width: 641px) and (max-width: 1024px)', {
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value;
                    }
                }
            }],
            ['screen and (max-width: 640px)', {
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0] + value[1] + value[2];
                    }
                }
            }]
        ];
        new Chartist.Line('#temperature_graph', params, options, responsiveOptions);
}
function makeRainChart(data) {
    var params = {
        labels: [],
        series: [
            [],
            []
        ]
    };
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < 5; i++) {
        let forecast = data.DailyForecasts[i];
        let date = new Date(forecast.Date);
        params.labels.push(days[date.getDay()]);
        params.series[0].push(forecast.Day.RainProbability);
        params.series[1].push(forecast.Night.RainProbability);
    }


    var options = {
        seriesBarDistance: 15,
        showPoint: false,
        axisY: {
            onlyInteger: true,
            labelInterpolationFnc: function (value) {
                return value + '%';
            },
        }
    };
    var responsiveOptions = [
        ['screen and (min-width: 641px) and (max-width: 1024px)', {
            seriesBarDistance: 10,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value;
                }
            }
        }],
        ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value[0] + value[1] + value[2];
                }
            }
        }]
    ];
    new Chartist.Bar('#rain_graph', params, options, responsiveOptions);
}
//klikanie dni
function changeSelectedDay(e) {
    if (!e.currentTarget.classList.contains("selected")) {
        document.querySelector(".selected").classList.remove("selected");
        e.currentTarget.classList.add("selected");
    }
    fillDetailsInfo(mockupResponse);
}
document.querySelector(".day-1").addEventListener("click", changeSelectedDay)
document.querySelector(".day-2").addEventListener("click", changeSelectedDay)
document.querySelector(".day-3").addEventListener("click", changeSelectedDay)
document.querySelector(".day-4").addEventListener("click", changeSelectedDay)
document.querySelector(".day-5").addEventListener("click", changeSelectedDay)
//wypełnianie szczegółow
function fillDetailsInfo(data){
    // Złapanie odpowiedniego div'a z dniem
    const days = document.querySelectorAll(".day");
    let dayIndex = 0;
    for(let i=0; i<days.length;i++){
        if(days[i].classList.contains("selected")){
            dayIndex = i;
        }
    }
    // Złapanie odpowiedniego obiektu JSON z dniem
    const forecast = data.DailyForecasts[dayIndex];
    // Tablica kafelków ze szczegółami
    const tiles = document.querySelectorAll('.day-info');
    // Jakość powietrza
    const quality = forecast.AirAndPollen[0].Category;
    tiles[0].querySelector('p').textContent = quality;

    // Prędkość wiatru
    const windSpeed = forecast.Day.Wind.Speed.Value;
    tiles[1].querySelector('p').textContent = Math.round(windSpeed)+" km/h";

    // Prawdopodobieństwo opadów
    const rainProbability = forecast.Day.PrecipitationProbability;
    tiles[2].querySelector('p').textContent = rainProbability+"%";
}