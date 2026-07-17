/**
 * Plots accident points on an OpenStreetMap base layer.
 * Markers cluster automatically at low zoom so a few hundred points
 * stay legible instead of overlapping into a solid blob.
 */
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { categoryColor, categoryLabel, weekdayLabel } from '../utils/format';

const GERMANY_CENTER = [51.1657, 10.4515];

export default function AccidentMap({ accidents }) {
  return (
    <div className="map-container">
      <MapContainer center={GERMANY_CENTER} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {accidents.filter((a) => a.lat && a.lon).map((a) => (
            <CircleMarker
              key={a.accident_id}
              center={[a.lat, a.lon]}
              radius={6}
              pathOptions={{
                color: categoryColor(a.category),
                fillColor: categoryColor(a.category),
                fillOpacity: 0.85,
                weight: 1,
              }}
            >
              <Popup>
                <strong>{categoryLabel(a.category)}</strong><br />
                {a.year}-{String(a.month).padStart(2, '0')}, {weekdayLabel(a.weekday)}, {a.hour}:00<br />
                District: {a.district_ags || '—'}<br />
                {a.is_bicycle && 'Bicycle · '}
                {a.is_pedestrian && 'Pedestrian · '}
                {a.is_car && 'Car · '}
                {a.is_motorcycle && 'Motorcycle · '}
                {a.is_truck && 'Truck'}
              </Popup>
            </CircleMarker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <div className="legend">
        <span><span className="swatch" style={{ background: '#ff4d4d' }} />Fatal</span>
        <span><span className="swatch" style={{ background: '#ffb74d' }} />Serious injury</span>
        <span><span className="swatch" style={{ background: '#4ade80' }} />Light injury</span>
      </div>
    </div>
  );
}
