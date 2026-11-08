// frontend/app/utils/geocoding.utils.ts

// returns a readable address for the coordinates,
// or a coordinate label if the address could not be fetched

export const getAddressFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
    );

    const data = await response.json();

    return data?.display_name || UI_TEXT.map.location(lat, lon);
  } catch (error) {
    console.error('Failed to fetch address:', error);
    return UI_TEXT.map.location(lat, lon);
  }
};
