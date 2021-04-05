var searches = JSON.parse(localStorage.getItem('savedSearches'))|| [];
var cityInfo = $('#city-search').val()

var storeSearches = function(){
    var cityInfo = $('#city-search').val();
    searches.push(cityInfo)
    var unique = [];
    $.each(searches, function(i, el){
        if($.inArray(el, unique) === -1) unique.push(el);
    });
    searches = unique
    localStorage.setItem("savedSearches", JSON.stringify(searches))
}

var populateSearches = function(){
    for (i = 0; i < searches.length; i++){
        $('.button-factory').append(`
        <button class='prev weatherbox btn btn-primary m-1'>${searches[i]}</button>
        `)
    }
};

var getCurrentWeather = function (cityInfo) {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityInfo + '&units=imperial&appid=d6e26b91ae63785bc530ad091f38b6c1';
    
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data)
            getUvi(data);        
            });
        } else {
            $('#5-day-display').append(`<div class='weatherbox'>'Error: '${response.statusText}</div>`);
        };
    })
    // .catch(function (error) {
    // alert('Sorry! we\'r having trouble connecting to our servers. Try again soon');
    // });
};


var getUvi = function(latLonData){
    var x = latLonData.coord.lat;
    var y = latLonData.coord.lon;
    console.log(y)
    var latLonApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ x +'&lon='+ y +'&units=imperial&exclude=hourly,minutely&appid=d6e26b91ae63785bc530ad091f38b6c1';
    
    fetch(latLonApi)
    .then(function (oneResponse){
        if (oneResponse.ok) {
            console.log(oneResponse)
            oneResponse.json()
            .then(function (oneData) {
                console.log(oneData)
                displayCurrent(oneData, cityInfo);
                display5day(oneData);
            });
        }else{
            $('#5-day-display').append(`<div class='weatherbox'>'Error: '${response.statusText}</div>`);
        }
    })
    .catch(function (error) {
        alert('Sorry! we\'r having trouble connecting to our servers. Try again soon');
        $('#5-day-display').append(`<div class='weatherbox'>Sorry! we\'r having trouble connecting to our servers. Try again soon'</div>`)
    });
}

var displayCurrent = function(info, cityInfo){
    $('.jumbotron').append(`
            <div class= 'weatherbox ml-1'>
            <h2 class= 'text-center'>${cityInfo}</h2>
            <h3>${moment().format('dddd M / D')}</h3>
            <p>${info.current.weather[0].main}<img src ='http://openweathermap.org/img/wn/${info.current.weather[0].icon}.png'></p>
            <p>Current Temp: ${parseInt(info.current.temp)}°F</p>
            <p>Humidity: ${info.current.humidity}</p>
            <p>Wind Speed: ${info.current.wind_speed}mph</p>
            <p>UV Index: <span class= 'uvi'>${info.current.uvi}</span></p>
            </div>
    `);
    if($('.uvi').val() < 3){
        $('.uvi').css('background-color', 'green')
    }else if($('uvi').val() < 6){
        $('.uvi').css('background-color', 'yellow')
    }else{
        $('.uvi').css('background-color', 'red')
    };
    
};
var display5day = function(upcoming){
    for(i = 1; i < 6; i++){
        $('#5-day-display').append(`
        <div class='d-flex flex-column col-12 col-md-5 col-xl-3 weatherbox card m-1 rounded text-center'>
            <h3 class='card-header rounded-bottom'>${moment().add(i, 'days').format('dddd M/D')} <img src='http://openweathermap.org/img/wn/${upcoming.daily[i].weather[0].icon}.png'></h3>
            <div class='card-body'>
                <p class= 'card-text'>Temp: ${parseInt(upcoming.daily[i].temp.max)}°F / ${parseInt(upcoming.daily[i].temp.min)}°F</p>
                <p class= 'card-text'>Wind Speed: ${upcoming.daily[i].wind_speed}mph</p>
                <p class= 'card-text'>Humidity: ${upcoming.daily[i].humidity}%</p>
            </div>
        </div>
        `)
    }
    $('.toggle').css('display', 'block')
}



var prevButtonHandler = function(event) {
    cityInfo = $(this).text();
    getCurrentWeather(cityInfo);
    $('.weatherbox').remove();
    populateSearches();
};

var clickEventHandler = function(event){
    event.preventDefault();
    cityInfo = $('#city-search').val();
    if(cityInfo === ""){
        alert('Please enter the name of a city')
        return
    }
    $('.weatherbox').remove();
    getCurrentWeather(cityInfo);
    storeSearches();
    populateSearches();
};

$('.btn').on('click', clickEventHandler);
$('.button-factory').on('click', '.prev', prevButtonHandler);