import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Circle,
} from "@react-google-maps/api";

const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bengaluru vibes ✨

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0b1221" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0b1221" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec5ff" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1c2b45" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0f172a" }],
    },
  ],
};

const DeliveryMap = ({ order }) => {
  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const [driverLocation, setDriverLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleKey || "",
    id: "delivery-map-core",
  });

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) =>
        setDriverLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      if (watcher && navigator.geolocation) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, []);

  const dropOffLocation = useMemo(() => {
    if (!order?.deliveryLocation?.coordinates) return null;
    const [lng, lat] = order.deliveryLocation.coordinates;
    return { lat, lng };
  }, [order]);

  const mapCenter = dropOffLocation || driverLocation || defaultCenter;

  if (!googleKey) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
          Live route
        </p>
        <p className="text-gray-400 text-sm">
          Add <code className="bg-black/30 px-1 rounded">VITE_GOOGLE_MAPS_KEY</code> to
          enable the neon navigation map.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1224] p-6 shadow-2xl">
      <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
        Live route visual
      </p>
      <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={14}
            options={mapOptions}
          >
            {driverLocation && (
              <>
                <Marker
                  position={driverLocation}
                  icon={{
                    path: "M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z",
                    fillColor: "#34d399",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 1,
                    anchor: { x: 12, y: 24 },
                  }}
                />
                <Circle
                  center={driverLocation}
                  radius={200}
                  options={{
                    strokeColor: "#34d399",
                    strokeOpacity: 0.2,
                    strokeWeight: 1,
                    fillColor: "#34d399",
                    fillOpacity: 0.08,
                  }}
                />
              </>
            )}
            {dropOffLocation && (
              <Marker
                position={dropOffLocation}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  fillColor: "#38bdf8",
                  fillOpacity: 1,
                  strokeColor: "#bae6fd",
                  strokeWeight: 2,
                  scale: 7,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Initializing neon grid...
          </div>
        )}
      </div>
      {order?.customer?.name && (
        <p className="text-xs text-gray-500 mt-3">
          Navigating to {order.customer.name} · tap an order to refocus the map.
        </p>
      )}
    </section>
  );
};

export default DeliveryMap;
