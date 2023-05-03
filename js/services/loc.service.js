import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js';

const LOCATION_KEY = 'location-db';

_createLocations();

export const locService = {
  query,
  get,
  remove,
  save,
  saveLocation,
  createDemoLocations,
  getLocs,
};

function query() {
  return storageService.query(LOCATION_KEY).then((locations) => {
    return locations;
  });
}
function getLocs() {
  return storageService.query(LOCATION_KEY).then((locations) => {
    return locations;
  });
}

function get(locationId) {
  return storageService.get(LOCATION_KEY, locationId).then((res) => console.log('here', res));
}

function remove(locationId) {
  return storageService.remove(LOCATION_KEY, locationId);
}

function save(location) {
  if (location.id) {
    return storageService.put(LOCATION_KEY, location);
  } else {
    return storageService.post(LOCATION_KEY, location);
  }
}

function saveLocation(name = 'New place', lat = 0, lng = 0) {
  const location = {
    id: utilService.makeId(),
    name,
    lat,
    lng,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  save(location);
}

function createDemoLocations() {
  const locations = [
    { id: utilService.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: utilService.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
    { id: utilService.makeId(), name: 'LostCity', lat: 35.1001, lng: -106.6706 },
    { id: utilService.makeId(), name: 'City of the Dead', lat: 29.9823, lng: 31.1342 },
    { id: utilService.makeId(), name: 'Abandoned Island', lat: 1.3542, lng: 103.9915 },
  ];
  return utilService.saveToStorage(LOCATION_KEY, locations);
}

function _createLocations() {
  let locations = utilService.loadFromStorage(LOCATION_KEY);
  if (!locations || !locations.length) {
    createDemoLocations();
  }
}
