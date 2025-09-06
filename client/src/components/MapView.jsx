import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom train icon
const trainIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/15304/15304228.png",
  iconSize: [25, 15],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const MapView = ({ trainData, center, zoom }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        center || [20.5937, 78.9629],
        zoom || 5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    // Clear old markers
    markersRef.current.forEach((marker) =>
      mapInstance.current.removeLayer(marker)
    );
    markersRef.current = [];

    // Add markers for trains
    if (trainData && trainData.length > 0) {
      trainData.forEach((train) => {
        if (train.lat && train.lng) {
          const marker = L.marker([train.lat, train.lng], { icon: trainIcon })
            .addTo(mapInstance.current)
            .bindPopup(`
              <div style="font-size: 14px; line-height: 1.4;">
                <b>${train.train_number || "N/A"}</b><br/>
                <b>Name:</b> ${train.train_name || "N/A"}<br/>
                <b>Status:</b> ${train.current_status || "Unknown"}<br/>
                <b>Speed:</b> ${train.speed || "N/A"} km/h<br/>
                <b>Delay:</b> ${train.delay || 0} minutes
              </div>
            `);

          markersRef.current.push(marker);
        }
      });

      // Adjust view
      if (markersRef.current.length > 1) {
        const group = new L.featureGroup(markersRef.current);
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      } else if (markersRef.current.length === 1) {
        mapInstance.current.setView(
          [trainData[0].lat, trainData[0].lng],
          12
        );
      }
    }
  }, [trainData, center, zoom]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

export default MapView;
