const proxy_url = "https://cors-anywhere.herokuapp.com/";
const distance_endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
const distance_key = 'AIzaSyCsSmpSIyOGrGLN8aNOgYPQo_1dackFSDU';

async function findNearest(event) {
    event.preventDefault();
    const location = document.querySelector('#location').value;
    
    for(venue of venue_items) {
        var request_url = distance_endpoint + 'key=' + distance_key + '&origins=' + encodeURIComponent(location) + '&destinations=' + encodeURIComponent(venue['address']);
        await fetch(proxy_url + request_url).then(onResponse).then(onJSON);
    }

    var nearest_venue = venue_items[0].address;
    var nearest_distance = venue_items[0].distance;
    for(i = 1; i < venue_items.length; i++) {
        if(venue_items[i].distance < nearest_distance) {
            nearest_distance = venue_items[i].distance;
            nearest_venue = venue_items[i].address;
        }
    }

    for(venue of venues) {
        if(venue.dataset.address === nearest_venue) {
            venue.classList.remove('hidden');
        }
        else {
            venue.classList.add('hidden');
        }
    }
}

function onResponse(response) {
    return response.json();
}

function onJSON(json) {
    for(venue of venue_items) {
        if(venue['address'] === json.destination_addresses[0]) {
            venue['distance'] = json.rows[0].elements[0].distance.value;
            break;
        }
    }
}

// Main
let venues = document.querySelectorAll('#venues article');
let venue_items = [];
for(venue of venues) {
   venue_items.push({'address': venue.dataset.address});
}
const find_nearest = document.querySelector('#find_nearest');
find_nearest.addEventListener('submit', findNearest);
