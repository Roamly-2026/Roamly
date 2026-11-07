// frontend/app/utils/exif.utils.ts
import ExifReader from 'exifreader';

interface NominatimReverseResponse {
  display_name?: string;
  address?: {
    road?: string;
    pedestrian?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
  };
}

export interface ExtractedImageMetadata {
  takenAt?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export async function extractImageMetadata(file: File): Promise<ExtractedImageMetadata> {
  const result: ExtractedImageMetadata = {};

  try {
    const buffer = await file.arrayBuffer();
    const tags = ExifReader.load(buffer, { expanded: true });

    console.log('[EXIF Debug] All tags found:', tags);

    const dateTag =
      tags.exif?.DateTimeOriginal || tags.exif?.DateTime || tags.exif?.['Date Created'];
    if (dateTag?.description) {
      const parts = dateTag.description.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2})/);
      if (parts) {
        const [, year, month, day, hour, minute] = parts;
        result.takenAt = `${year}-${month}-${day}T${hour}:${minute}`;
      }
    }

    const lat = tags.gps?.Latitude;
    const lon = tags.gps?.Longitude;

    if (typeof lat === 'number' && typeof lon === 'number') {
      result.latitude = lat;
      result.longitude = lon;

      try {
        const geoRes = await $fetch<NominatimReverseResponse>(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'RoamlyApp/1.0',
            },
          },
        );

        if (geoRes?.display_name) {
          const addr = geoRes.address;
          const shortName = [
            addr?.road || addr?.pedestrian || addr?.suburb,
            addr?.city || addr?.town || addr?.village,
          ]
            .filter(Boolean)
            .join(', ');

          result.locationName = shortName || geoRes.display_name;
        }
      } catch (geoErr) {
        console.warn('[EXIF] Reverse geocoding failed:', geoErr);
      }
    } else {
      console.warn('[EXIF] No GPS coordinates found in this image');
    }
  } catch (err) {
    console.error('[EXIF] Failed to parse tags:', err);
  }

  console.log('[EXIF Debug] Extracted result:', result);
  return result;
}
