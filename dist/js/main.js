import CurrentLocation from "./CurrentLocation.js";

import {addSpinner} from "./domFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
// add listeners
const geoButton = document.getElementById("getLocation");
geoButton.addEventListener("click", getGeoWeather);
}

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
    if (event && event.type === "click") {
      const mapIcon = document.querySelector(".fa-location-dot");
      addSpinner(mapIcon);
    }
    // if (!navigator.geolocation) return geoError();
    // navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  };