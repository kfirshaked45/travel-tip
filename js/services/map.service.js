export const mapService = {
  initMap,
  addMarker,
  panTo,
};

// Var that is used throughout this Module (not global)
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  const myLatlng = { lat, lng };

  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: myLatlng,
      zoom: 15,
    });
    console.log('Map!', gMap);
    let infoWindow = new google.maps.InfoWindow({
      content: 'Click the map to get Lat/Lng!',
      position: myLatlng,
    });
    infoWindow.open(gMap);
    // Configure the click listener.
    gMap.addListener('click', (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
      const jsonString = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      const obj = JSON.parse(jsonString);
      console.log(obj);
      infoWindow.open(gMap);
    });

    window.initMap = initMap;
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyD6s2kFKCSfe2fHRdykw-TkOLJftyQo2q0'; //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
