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

export interface ExtractMetadataOptions {
  enableReverseGeocode?: boolean;
}

// In-memory cache to avoid redundant Nominatim requests and respect rate limits
const geocodeCache = new Map<string, string>();

function parseExifDate(rawDate: string): string | null {
  const match = rawDate.match(/(\d{4})[:-](\d{2})[:-](\d{2})[T\s](\d{2}):(\d{2})/);
  if (match) {
    const [, y, m, d, h, min] = match;
    return `${y}-${m}-${d}T${h}:${min}`;
  }
  return null;
}

function formatLocalDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export async function extractImageMetadata(
  file: File,
  options: ExtractMetadataOptions = { enableReverseGeocode: true },
): Promise<ExtractedImageMetadata> {
  const result: ExtractedImageMetadata = {};

  try {
    const buffer = await file.arrayBuffer();
    const tags = ExifReader.load(buffer, { expanded: true });

    // 1. Taken date from EXIF / XMP
    const xmp = (tags as { xmp?: Record<string, { description?: string }> }).xmp;

    const rawDate =
      tags.exif?.DateTimeOriginal?.description ||
      tags.exif?.DateTimeDigitized?.description ||
      tags.exif?.DateTime?.description ||
      xmp?.DateCreated?.description ||
      xmp?.CreateDate?.description;

    if (rawDate) {
      const parsed = parseExifDate(rawDate);
      if (parsed) {
        result.takenAt = parsed;
      }
    }

    if (!result.takenAt && file.lastModified) {
      result.takenAt = formatLocalDate(new Date(file.lastModified));
    }

    // 2. GPS coordinates
    const lat = tags.gps?.Latitude;
    const lon = tags.gps?.Longitude;

    if (
      typeof lat === 'number' &&
      !Number.isNaN(lat) &&
      typeof lon === 'number' &&
      !Number.isNaN(lon)
    ) {
      result.latitude = lat;
      result.longitude = lon;

      // 3. Optional Reverse Geocoding with caching
      if (options.enableReverseGeocode) {
        const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        const cachedLocation = geocodeCache.get(cacheKey);

        if (cachedLocation) {
          result.locationName = cachedLocation;
        } else {
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

              const resolvedName = shortName || geoRes.display_name;
              result.locationName = resolvedName;
              geocodeCache.set(cacheKey, resolvedName);
            }
          } catch (geoErr) {
            console.warn('[EXIF] Reverse geocoding failed:', geoErr);
          }
        }
      }
    }
  } catch {
    if (file.lastModified) {
      result.takenAt = formatLocalDate(new Date(file.lastModified));
    }
  }

  return result;
}
