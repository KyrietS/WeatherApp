// Ikony tylko dla dnia
// https://developer.accuweather.com/weather-icons
var icon = {
    1: 'icon-sun',
    2: 'icon-sun',
    3: 'icon-cloud-sun',
    4: 'icon-cloud-sun',
    5: 'icon-fog-sun',
    6: 'icon-cloud-sun',
    7: 'icon-clouds',
    8: 'icon-clouds',
    9: 'icon-na',
    10: 'icon-na',
    11: 'icon-fog',
    12: 'icon-rain',
    13: 'icon-rain',
    14: 'icon-rain',
    15: 'icon-hail',
    16: 'icon-hail',
    17: 'icon-hail',
    18: 'icon-hail',
    19: 'icon-windy-rain',
    20: 'icon-windy-rain',
    20: 'icon-windy-rain',
    21: 'icon-windy-rain',
    22: 'icon-snow',
    23: 'icon-snow-heavy',
    24: 'icon-snowflake',
    25: 'icon-rain',
    26: 'icon-rain',
    27: 'icon-na',
    28: 'icon-na',
    29: 'icon-rain',
    30: 'icon-temperature',
    31: 'icon-snowflake',
    32: 'icon-wind',
}

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

// Funkcja uruchamiana przy starcie strony, pobiera 
// dane (tymczasowo mockupResponse) i uzupełnia poszczególne dni informacjami
(async function(){

    let apiKey = 'q4yfgRGEhyRygj2fDKAZA02kiOUDkaPP'
    let locationId = '273125';
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
    makeCharts(mockupResponse);
})()

//wykresiki
function makeCharts(data){
    var params = {
        // A labels array that can contain any sort of values
        labels: [],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [],[]
        ]
    };
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for(let i=0; i<5;i++){
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
                    return value[0]+value[1]+value[2];
                }
            }
        }]
    ];
    new Chartist.Line('#temperature_graph', params, options, responsiveOptions);
}
