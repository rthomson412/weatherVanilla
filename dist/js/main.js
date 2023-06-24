import {
  setLocationObject, getHomeLocation, getWeatherFromCoords
} from "./dataFunctions.js";

import CurrentLocation from "./CurrentLocation.js";

import { addSpinner, displayError, updateScreenReaderConfirmation } from "./domFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);
  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);
  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPref);
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);
}

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
  if (event && event.type === "click") {
    const mapIcon = document.querySelector(".fa-location-dot");
    addSpinner(mapIcon);
  }
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "Geolocation not supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
  };
  setLocationObject(currentLoc, myCoordsObj);
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError(
      "No Home Location Saved.",
      "Sorry. Please save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-house");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit
    };
    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-bookmark");
    addSpinner(saveIcon);
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit()
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.getName()} as home location.`
    );
  }
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  if (weatherJson) updateDisplay(weatherJson, locationObj);
};