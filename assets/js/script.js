var searchinput = $('#search');
var clickinput = $('#clickinput');
var citylist = $('#citylist');
var maincard = $('#mainCard');
var subCards = $('#subCards');

var cities = [];

function renderCities() {
    citylist.innerHTML = '';

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var button = $('<button>');
        button.text(city);
        button.attr("class", "my-2 w-100 btn btn-primary border border-dark");
        button.attr('type', 'button')
        button.attr("id", "city" + i)

        // var exit = $('<button>');
        // exit.text('X');
        // exit.attr('class', "")

        // button.append(exit);
        citylist.append(button);
    }
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem('cities'));

    if (storedCities !== null) {
        cities = storedCities;
    }

    renderCities();
}

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

clickinput.on("click", function(event) {
    event.preventDefault();

    if (searchinput.val() === '') {
        return;
    }

    cities.push(searchinput.val());

    storeCities();
    renderCities();
});

citylist.on('click', function(event) {
    console.log(event.target.lastChild.data)

    $.ajax({
        url: 'https://api.openweathermap.org/geo/1.0/direct?q='+ event.target.lastChild.data +'&appid=e9e30400559d99c2dce675aec0e4ad08',
        method: 'GET',
    }).then(function (response) {

        var lat = response[0].lat;
        var lon = response[0].lon;

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon=' + lon + '&appid=e9e30400559d99c2dce675aec0e4ad08',
            method: 'GET',
        }).then(function (response) {

            for (var i = 0; i < 5; i++ ) {
                var x = 8 * [i];
                var temp = Math.round((((response.list[x].main.temp - 273.15) * 9)/5) + 32);
                var wind = response.list[x].wind.speed;
                var humid = response.list[x].main.humidity;
                var weather = response.list[x].weather[0].main;
                var date = response.list[x].dt_txt
                console.log(temp, wind, humid, weather, date);

                if (weather === 'Clear') {
                    weather = '☀️';
                } else if (weather === 'Rain'){
                    weather = '🌧️';
                } else {
                    weather = '☁️';
                }

                if (i === 0 ) {
                    var card = $('<section>')
                    var header = $('<p>');
                    var headtemp = $('<p>');
                    var headwind = $('<p>');
                    var headhumid = $('<p>');

                    header.text(event.target.lastChild.data + ' ' + date + ' ' + weather);
                    headtemp.text('Temp: ' + temp + '°F');
                    headwind.text('Wind: ' + wind + ' MPH');
                    headhumid.text('Humidity: ' + humid + '%');

                    $(card).addClass('w-90 border border-dark m-3 p-3');
                    $(header).addClass('h2');

                    maincard.append(card);
                    card.append(header);
                    card.append(headtemp);
                    card.append(headwind);
                    card.append(headhumid);
                } else {
                    var subcard = $('<section>');
                    var subdate = $('<p>');
                    var subweather = $('<p>');
                    var subtemp = $('<p>');
                    var subwind = $('<p>');
                    var subhumid = $('<p>');

                    subdate.text(date);
                    subweather.text(weather);
                    subtemp.text('Temp: ' + temp + '°F');
                    subwind.text('Wind: ' + wind + ' MPH');
                    subhumid.text('Humidity: ' + humid + '%');

                    $(subcard).addClass('col-2 border border-dark m-5 p-3');
                    $(subdate).addClass('font-weight-bold');

                    subCards.append(subcard);
                    subcard.append(subdate);
                    subcard.append(subweather);
                    subcard.append(subtemp);
                    subcard.append(subwind);
                    subcard.append(subhumid);
                }
            }
        });
    });
    
});

init();