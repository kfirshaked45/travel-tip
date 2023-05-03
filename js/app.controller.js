import { locService } from './services/loc.service.js';

import { mapService } from './services/map.service.js';

let isAddMarker = false;

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onPanToUserPos = onPanToUserPos;
window.onRemoveLoc = onRemoveLoc;
window.onGoToLoc = onGoToLoc;
window.handleMarker = handleMarker;
window.showWeather = showWeather;
window.onCopyLink = onCopyLink;
window.onShowWeather = onShowWeather;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));

  const urlParams = new URLSearchParams(window.location.search);
  const lat = urlParams.get('lat');
  const lng = urlParams.get('lng');

  if (lat && lng) {
    const center = { lat: parseFloat(lat), lng: parseFloat(lng) };
    mapService.setMapCenter(center);
  }
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function handleMarker() {
  isAddMarker = !isAddMarker;
}

function onAddMarker(obj) {
  console.log(isAddMarker);
  if (isAddMarker) {
    mapService.addMarker({ lat: obj.lat, lng: obj.lng });
  }
}

function onSearch() {
  const form = document.querySelector('.search-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const address = document.querySelector('.search-input');
    if (!address.value) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address.value }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const name = results[0].formatted_address;
        locService.saveLocation(name, lat, lng);
        mapService.panTo(lat, lng);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  });
}
function onRemoveLoc(locId) {
  locService.remove(locId).then(onGetLocs);
}

function onGoToLoc(locId) {
  locService.get(locId);
}
function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    let strHtml = '';
    locs.forEach((place) => {
      strHtml += `
        <div>
          ${place.name}${place.lat}${place.lng}
          <button onclick="onGoToLoc('${place.id}')">GO!</button>
          <button onclick="onRemoveLoc('${place.id}')">Delete!</button>
        </div>
      `;
    });
    document.querySelector('.locations-container').innerHTML = strHtml;
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log(pos);
      console.log('User position is:', pos.coords);
      document.querySelector('.user-pos').innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onPanTo() {
  console.log('Panning the Map');
  mapService.panTo(35.6895, 139.6917);
}
function onPanToUserPos() {
  getPosition()
    .then((pos) => {
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function showWeather(lat, lng) {
  const API_KEY = 'ec881ceb9792c250aac88a33111d570d';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`;

  axios
    .get(url)
    .then((response) => {
      console.log(response.data.weather[0].description);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}
function onCopyLink() {
  const lat = mapService.getMapCenter().lat.toFixed(2);
  const lng = mapService.getMapCenter().lng.toFixed(2);
  const link = `https://kfirshaked45.github.io/travel-tip/index.html?lat=${lat}&lng=${lng}`;

  navigator.clipboard
    .writeText(link)
    .then(() => {
      console.log('Link copied to clipboard:', link);
    })
    .catch((err) => {
      console.error('Failed to copy link:', err);
    });
}
function onShowWeather(lat, lng) {
  mapService.showWeather(lat, lng);
}
