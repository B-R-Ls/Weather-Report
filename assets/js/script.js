var searchinput = $('#search');
var clickinput = $('#clickinput');
var citylist = $('#citylist')

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
        url: 'http://api.openweathermap.org/geo/1.0/direct?q='+ event.target.lastChild.data +'&appid=e9e30400559d99c2dce675aec0e4ad08',
        method: 'GET',
    }).then(function (response) {
        // console.log('AJAX Response \n-------------');
        // console.log(response);
        var lat = response[0].lat;
        var lon = response[0].lon;
        // console.log(lat, lon)
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon=' + lon + '&appid=e9e30400559d99c2dce675aec0e4ad08',
            method: 'GET',
        }).then(function (response) {
            console.log('AJAX Response \n-------------');
            // console.log(response);
            console.log(response.list)
            for (var i = 0; i < 5; i++ ) {
                var x = 8 * [i];
                var temp = response.list[x].main.temp;
                var wind = response.list[x].wind.speed;
                var humid = response.list[x].main.humidity;
                var weather = response.list[x].weather[0].main
                console.log(temp, wind, humid, weather);
                if (i === 0 ) {

                } else {

                }
            }
        });
    });
// clear clouds rain 
    

});





// citylist.on('click', function(event) {
//     var element = event.target;

//     if (element === )
// });

init();