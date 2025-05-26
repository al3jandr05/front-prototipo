import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useState
} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/mapa.css';

// Fix íconos rotos de leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapController = forwardRef(({ center }, ref) => {
    const map = useMap();
    const [isUserInteraction, setIsUserInteraction] = useState(false);

    useImperativeHandle(ref, () => ({
        flyToMarker: (position) => {
            setIsUserInteraction(true);
            map.flyTo(position, 15, {
                duration: 0.5
            });
            setTimeout(() => setIsUserInteraction(false), 500);
        }
    }));

    useEffect(() => {
        if (!isUserInteraction && center) {
            map.flyTo(center);
        }
    }, [center, map, isUserInteraction]);

    return null;
});

const PriorityLegendControl = ({ map }) => {
    useEffect(() => {
        if (!map) return;

        const legend = L.control({ position: 'topright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'priority-legend-control');
            div.innerHTML = `
                <div class="legend-header">
                    <h4>Niveles de Prioridades</h4>
                </div>
                <div class="legend-content">
                    <div class="legend-item">
                        <div class="legend-color-circle" style="background-color: #dc3545;"></div>
                        <span>Alta</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color-circle" style="background-color: #fd7e14;"></div>
                        <span>Media</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color-circle" style="background-color: #28a745;"></div>
                        <span>Baja</span>
                    </div>
                </div>
            `;

            // Evitar que los clics en la leyenda interfieran con el mapa
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);

            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
};

// Función para crear iconos
const crearIcono = (prioridad) => {
    let color;

    switch(prioridad?.toLowerCase()) {
        case 'alto': color = '#dc3545'; break;
        case 'medio': color = '#fd7e14'; break;
        case 'bajo': color = '#28a745'; break;
        default: color = '#6c757d';
    }

    return new L.DivIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
    });
};

const MapBoundsAdjuster = ({ markers, disabled }) => {
    const map = useMap();

    useEffect(() => {
        if (!disabled && markers.length > 0) {
            const bounds = L.latLngBounds(
                markers.map(marker => marker.position)
            );
            map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: 0.5
            });
        }
    }, [markers, map, disabled]);

    return null;
};

const getColorByPriority = (priority) => {
    switch(priority?.toLowerCase()) {
        case 'alto': return '#dc3545';
        case 'medio': return '#fd7e14';
        case 'bajo': return '#28a745';
        default: return '#6c757d';
    }
};

const Mapa = forwardRef(({ coordenadas, markers = [], onPopupAction }, ref) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [userInteracted, setUserInteracted] = useState(false);

    return (
        <div style={{ position: 'relative' , height: '100%'}}>
            <MapContainer
                center={coordenadas}
                zoom={10}
                scrollWheelZoom={true}
                style={{
                    height: "100%",
                    width: "100%",
                    minHeight: "500px"
                }}
                whenCreated={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        icon={crearIcono(marker.prioridad)}
                        eventHandlers={{
                            click: () => setUserInteracted(true)
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="popup-content">
                                <h4>{marker.direccion || 'Ubicación Emergencia'}</h4>
                                <p><strong>Prioridad:</strong>
                                    <span style={{ color: getColorByPriority(marker.prioridad) }}>
                                        {marker.prioridad}
                                    </span>
                                </p>
                                <p><strong>Detalle:</strong> {marker.detalle}</p>
                                <p><strong>Solicitado por:</strong> {marker.voluntario}</p>
                                <p><strong>Fecha:</strong> {marker.fecha}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapController ref={ref} center={coordenadas} />
                <MapBoundsAdjuster markers={markers} disabled={userInteracted} />
                {mapInstance && <PriorityLegendControl map={mapInstance} />}
            </MapContainer>
        </div>
    );
});

export default Mapa;