import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function LocationMap({ latitude, longitude, markerText }) {
    return (
        <MapContainer style={{height: "300px"}} center={[latitude, longitude]} zoom={5} scrollWheelZoom={true}>
            <ChangeView center={[latitude, longitude]} zoom={5}/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
                <Popup>
                    {markerText}
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default LocationMap;