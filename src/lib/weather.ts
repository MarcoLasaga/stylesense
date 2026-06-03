/**
 * Weather context client using Open-Meteo (free, no API key).
 * Provides advanced weather intelligence: humidity, wind, UV index,
 * and short-term rain probability.
 */
import { WeatherContext } from './types';

interface GeoPos { lat: number; lon: number; city?: string }

export async function getCurrentPosition(): Promise<GeoPos> {
  return new Promise((resolve) => {
    const fallback: GeoPos = { lat: 14.5995, lon: 120.9842, city: 'Manila' };
    if (!('geolocation' in navigator)) return resolve(fallback);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(fallback),
      { timeout: 5000 }
    );
  });
}

function classifyTemp(t: number): WeatherContext['condition'] {
  if (t >= 30) return 'hot';
  if (t >= 24) return 'warm';
  if (t >= 17) return 'mild';
  if (t >= 10) return 'cool';
  return 'cold';
}

function classifyPrecip(code: number): WeatherContext['precipitation'] {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'rain';
  return 'none';
}

const CODE_DESC: Record<number, string> = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy rain showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
};

export async function fetchWeather(pos?: GeoPos): Promise<WeatherContext> {
  const p = pos ?? await getCurrentPosition();
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}` +
      `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,uv_index` +
      `&hourly=precipitation_probability&timezone=auto&forecast_days=1`;
    const res = await fetch(url);
    const json = await res.json();
    const t = json?.current?.temperature_2m ?? 22;
    const code = json?.current?.weather_code ?? 0;
    const humidity = json?.current?.relative_humidity_2m;
    const windKph = json?.current?.wind_speed_10m;
    const uv = json?.current?.uv_index;
    const probs: number[] = json?.hourly?.precipitation_probability ?? [];
    const rainProb = probs.length ? Math.max(...probs.slice(0, 6)) : undefined;

    return {
      tempC: Math.round(t),
      condition: classifyTemp(t),
      precipitation: classifyPrecip(code),
      description: CODE_DESC[code] ?? 'Clear',
      city: p.city,
      humidity: humidity !== undefined ? Math.round(humidity) : undefined,
      windKph: windKph !== undefined ? Math.round(windKph) : undefined,
      rainProbability: rainProb !== undefined ? Math.round(rainProb) : undefined,
      uvIndex: uv !== undefined ? Math.round(uv) : undefined,
    };
  } catch {
    return { tempC: 22, condition: 'mild', precipitation: 'none', description: 'Mild weather', city: p.city };
  }
}

/** Cache weather for 30 minutes in sessionStorage. */
export async function getWeatherCached(): Promise<WeatherContext> {
  const KEY = 'ss_weather_cache';
  try {
    const cached = sessionStorage.getItem(KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.t < 30 * 60 * 1000) return parsed.data;
    }
  } catch { /* ignore */ }
  const data = await fetchWeather();
  try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

// ── Smart weather-driven outfit advice ──────────────────────
export interface WeatherAdvice {
  headline: string;
  tips: string[];
}

export function getWeatherAdvice(w: WeatherContext): WeatherAdvice {
  const tips: string[] = [];
  const headline = `${w.tempC}°C · ${w.description}`;

  if (w.condition === 'hot') tips.push('Choose breathable fabrics like cotton or linen.');
  if (w.condition === 'cold') tips.push('Layer up — wool or knit pieces will keep you warm.');
  if (w.condition === 'cool') tips.push('A light jacket or knit layer is ideal.');

  if ((w.rainProbability ?? 0) >= 50 || w.precipitation === 'rain') {
    tips.push('High rain chance — pack a water-resistant jacket.');
  }
  if ((w.uvIndex ?? 0) >= 7) {
    tips.push('UV index is high — consider long sleeves or a hat.');
  }
  if ((w.humidity ?? 0) >= 80) {
    tips.push('Humid air — favor loose-fitting, breathable pieces.');
  }
  if ((w.windKph ?? 0) >= 25) {
    tips.push('Windy conditions — a fitted outer layer beats loose fabrics.');
  }

  return { headline, tips };
}
