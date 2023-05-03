import { locService } from './services/loc.service.js';
import { utilService } from './services/util.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.searchInput = searchInput;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onSearch() {
  const address = document.querySelector('.search-input');
  if (!address.value) return;

  const debouncedOnInput = utilService.debounce(() => {
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
  }, 500);

  address.addEventListener('input', debouncedOnInput);
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    let strHtml = '';
    locs.forEach((place) => {
      strHtml += `<div>${place.name}${place.lat}${place.lng}<button onclick="locService.get('${place.id}')">GO!</button><button onclick="handleDelete('${place.id}')">Delete!</button></div>`;
    });
    document.querySelector('.locations-container').innerHTML = strHtml;
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
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
