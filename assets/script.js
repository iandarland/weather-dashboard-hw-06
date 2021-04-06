var searches = JSON.parse(localStorage.getItem('savedSearches'))|| [];
var cityInfo = $('#city-search').val()

// function to store searches in local storage and ensure that there are no duplicates
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

//funciton populates previous searches below search input box
var populateSearches = function(){
    for (i = 0; i < searches.length; i++){
        $('.button-factory').append(`
        <button class='prev weatherbox btn btn-primary m-1'>${searches[i]}</button>
        `)
    }
};

// function to fetch first API to retrieve lat and long for next fetch
var getCurrentWeather = function (cityInfo) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInfo + '&units=imperial&appid=d6e26b91ae63785bc530ad091f38b6c1';
    
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

// Function to fetch data from onecall to retrieve current weather and 5 day forecast
// Function also calls displayCurrent and display5day functions 
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

// function that populates jumbotron with current weather info
var displayCurrent = function(info, cityInfo){
    $('.jumbotron').append(`
            <div class= 'weatherbox ml-1'>
            <h2 class= 'text-center'>${cityInfo}</h2>
            <p class='text-center'>${info.current.weather[0].main}<img src ='http://openweathermap.org/img/wn/${info.current.weather[0].icon}.png'></p>
            <h3>${moment().format('dddd M / D')}</h3>
            <p>Current Temp: ${parseInt(info.current.temp)}°F</p>
            <p>Humidity: ${info.current.humidity}%</p>
            <p>Wind Speed: ${info.current.wind_speed}mph</p>
            <p>UV Index: <span class= 'uvi'>${info.current.uvi}</span></p>
            </div>
    `);
    if($('.uvi').text() < 3){
        $('.uvi').css('background-color', 'green')
    }else if($('uvi').text() < 6){
        $('.uvi').attr('style', 'background-color: yellow; color: black !important')
    }else{
        $('.uvi').css('background-color', 'red')
    };
    console.log($('.uvi').text())
};

//function displays 5 cards for 5 day forecast changes display information for .toggle class
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


// function tells dynamically created previous search buttons what functions to call
var prevButtonHandler = function(event) {
    cityInfo = $(this).text();
    getCurrentWeather(cityInfo);
    $('.weatherbox').remove();
    populateSearches();
};

//function tells search button which functions to call stops user with alert if nothing is entered
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

// assigns button funtionality
$('.btn').on('click', clickEventHandler);
$('.button-factory').on('click', '.prev', prevButtonHandler);
