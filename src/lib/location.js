/**
 * Gets the current latitude and longitude using the browser's Geolocation API.
 */
export const getLatLong = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ Latitude: null, Longitude: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
          Accuracy: position.coords.accuracy,
          Altitude: position.coords.altitude,
          AltitudeAccuracy: position.coords.altitudeAccuracy,
          Heading: position.coords.heading,
          Speed: position.coords.speed,
          Timestamp: new Date(position.timestamp).toISOString(),
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        resolve({ Latitude: null, Longitude: null });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Gets the live location once.
 */
export const getLiveLocationOnce = async () => {
  return await getLatLong();
};

/**
 * Resolves the current location.
 * Triggers the browser permission prompt, and only proceeds to the API call
 * if the user grants permission and coordinates are successfully obtained.
 */
export const resolveCurrentLocation = async ({
  dispatch,
  locationDataAction,
  geoLocationGetAction,
}) => {
  // 1. Trigger the browser's geolocation prompt
  const loc = await getLatLong();

  // 2. Only proceed if the user allowed (loc.Latitude is present)
  if (loc && loc.Latitude) {
    // Update the Redux store so rtk-base-query picks up the coordinates
    dispatch(locationDataAction(loc));

    // 3. Now call the API to get normalized location data
    try {
      const geoGetResponse = await geoLocationGetAction({ Action: "Get" });
      return geoGetResponse?.Return?.Geo_Location || null;
    } catch (err) {
      console.error("Failed to get normalized geo location:", err);
      return null;
    }
  }

  // If user denied or coordinates failed, return null
  return null;
};
