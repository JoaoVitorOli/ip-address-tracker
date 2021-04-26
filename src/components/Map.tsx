import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import Leaflet from "leaflet";

import iconLocation from "../../public/icon-location.svg";

import 'leaflet/dist/leaflet.css'

const mapIcon = Leaflet.icon({
  iconUrl: iconLocation,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
});

export default function Map(coord) {
  return (
    <div
      style={{ width: "100%", height: "100%" }}
    >
      <MapContainer
        center={[coord.coord.latitude, coord.coord.longitude]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          icon={mapIcon}
          position={[coord.coord.latitude, coord.coord.longitude]}
        />
      </MapContainer>
    </div>
  );
}
