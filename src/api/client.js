/**
 * All HTTP calls to the accident-api backend live here.
 * Every function returns parsed JSON or throws an Error with the
 * backend's { message } body so callers can show it directly.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function get(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  }
  const url = `${BASE_URL}${path}${query.toString() ? `?${query}` : ''}`;

  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || `Request failed (${res.status})`);
  return body;
}

// --- Regions -----------------------------------------------------------
export const getRegions = (params) => get('/regions', params);
export const getRegion = (ags) => get(`/regions/${ags}`);

// --- Accidents -----------------------------------------------------------
export const getAccidents = (params) => get('/accidents', params);

// --- Aggregates -----------------------------------------------------------
export const getAggregateAccidents = (params) => get('/aggregates/accidents', params);
export const getEarliestYear = (params) => get('/aggregates/earliest-year', params);
export const getRatePer10000 = (params) => get('/aggregates/rate-per-10000', params);
export const getZeroAccidents = (params) => get('/aggregates/zero-accidents', params);
export const getTrend = (params) => get('/aggregates/trend', params);

// --- Metadata -----------------------------------------------------------
export const getSources = () => get('/metadata/sources');
export const getIndicators = () => get('/metadata/indicators');
export const getTestQuestions = () => get('/metadata/test-questions');

export { BASE_URL };
