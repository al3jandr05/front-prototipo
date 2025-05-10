import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix íconos rotos de leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Mapa = ({ coordenadas, direccion }) => {
    return (
        <MapContainer
            center={coordenadas}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordenadas}>
                <Popup>{direccion}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default Mapa;
