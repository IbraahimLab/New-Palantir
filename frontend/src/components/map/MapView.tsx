import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { api } from '../../services/api';
import L from 'leaflet';

// Fix for default leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView: React.FC = () => {
    const { selectedEntity } = useInvestigationStore();
    const [sightings, setSightings] = useState<any[]>([]);

    useEffect(() => {
        const fetchSightings = async () => {
            if (!selectedEntity) return;
            try {
                const response = await api.getSightings(selectedEntity.type, selectedEntity.id);
                setSightings(response.data);
            } catch (error) {
                console.error('Failed to fetch sightings:', error);
            }
        };

        fetchSightings();
    }, [selectedEntity]);

    if (!selectedEntity) {
        return <div className="flex-center h-full text-muted">Select an entity to view geographic history</div>;
    }

    const positions = sightings.map(s => [s.latitude, s.longitude] as L.LatLngTuple);
    const center: L.LatLngTuple = positions.length > 0 ? positions[0] : [2.0469, 45.3182]; // Mogadishu default

    return (
        <div className="map-container" style={{ height: '100%', width: '100%' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', background: '#0f1419' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {sightings.map((s, idx) => (
                    <Marker key={idx} position={[s.latitude, s.longitude] as L.LatLngTuple}>
                        <Popup>
                            <div className="popup-content mono text-xs">
                                <strong>{s.location_name}</strong><br />
                                {new Date(s.timestamp).toLocaleString()}<br />
                                {s.details && <span>{s.details}</span>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {positions.length > 1 && (
                    <Polyline positions={positions} color="#3b82f6" weight={3} opacity={0.6} dashArray="5, 10" />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;
