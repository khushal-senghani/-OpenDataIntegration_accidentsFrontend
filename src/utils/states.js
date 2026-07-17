/** Mirrors backend src/config/states.js so dropdowns match the API's AGS codes. */
export const STATES = [
  { ags: '01', name: 'Schleswig-Holstein' },
  { ags: '02', name: 'Hamburg' },
  { ags: '03', name: 'Niedersachsen' },
  { ags: '04', name: 'Bremen' },
  { ags: '05', name: 'Nordrhein-Westfalen' },
  { ags: '06', name: 'Hessen' },
  { ags: '07', name: 'Rheinland-Pfalz' },
  { ags: '08', name: 'Baden-Württemberg' },
  { ags: '09', name: 'Bayern' },
  { ags: '10', name: 'Saarland' },
  { ags: '11', name: 'Berlin' },
  { ags: '12', name: 'Brandenburg' },
  { ags: '13', name: 'Mecklenburg-Vorpommern' },
  { ags: '14', name: 'Sachsen' },
  { ags: '15', name: 'Sachsen-Anhalt' },
  { ags: '16', name: 'Thüringen' },
];

export const CATEGORIES = [
  { value: '', label: 'Any severity' },
  { value: '1', label: 'Fatal' },
  { value: '2', label: 'Serious injury' },
  { value: '3', label: 'Light injury' },
];

export const PARTICIPANT_FLAGS = [
  { key: 'bicycle', label: 'Bicycle' },
  { key: 'car', label: 'Car' },
  { key: 'pedestrian', label: 'Pedestrian' },
  { key: 'motorcycle', label: 'Motorcycle' },
  { key: 'truck', label: 'Truck' },
];
