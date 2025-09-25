export const getGoogleMapsUrl = (hospital) => {
  const { latitude, longitude } = hospital.location;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};

export const getCoordinatesString = (hospital) => {
  const { latitude, longitude } = hospital.location;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};