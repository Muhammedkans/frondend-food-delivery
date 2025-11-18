// src/pages/Delivery/LiveTracking.jsx
import React, { useEffect, useRef } from "react";
import deliveryApi from "../../api/deliveryApi";
import socket, { connectSocket, disconnectSocket, safeEmit } from "../../utils/socket";
import { toast } from "react-hot-toast";

/**
 * Driver Live Tracking component
 *
 * Props:
 *  - isOnline (boolean) : start tracking when true
 *  - orderId? (string) : optional current active order id (if you want to tie location to an order)
 *
 * How to use:
 *  <LiveTracking isOnline={isOnline} orderId={activeOrderId} />
 *
 * Notes:
 *  - Requires user to allow location permission in browser.
 *  - Uses watchPosition for real-time updates (best for mobile).
 *  - Also calls deliveryApi.updateLocation({ lat, lng }) to keep backend in sync.
 */

const LiveTracking = ({ isOnline = false, orderId = null }) => {
  const watchIdRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    // Connect socket when component mounts (but don't start emitting until isOnline true)
    if (!connectedRef.current) {
      connectSocket(); // uses cookies for auth by default
      connectedRef.current = true;
    }

    return () => {
      // cleanup on unmount
      stopTracking();
      // disconnect socket only if you want global disconnect here; often better to persist socket across pages
      // disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOnline) {
      startTracking();
    } else {
      stopTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const startTracking = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported in this browser");
      return;
    }

    // if already watching, don't re-register
    if (watchIdRef.current != null) return;

    const success = async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // 1) emit via socket
      safeEmit("driver-location", { lat, lng, orderId });

      // 2) call REST endpoint to persist (optional)
      try {
        await deliveryApi.updateLocation({ lat, lng });
      } catch (err) {
        // optional: ignore or show non-intrusive warning
        // console.warn("Failed to sync location via REST:", err);
      }
    };

    const error = (err) => {
      console.warn("Geolocation error:", err);
      if (err.code === 1) {
        toast.error("Location permission denied. Enable GPS to share live location.");
      } else {
        toast.error("Unable to get location. Check GPS.");
      }
    };

    // Use watchPosition for frequent updates (best for mobile)
    // Optional options: highAccuracy and reasonable timeout
    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000, // ms
      timeout: 10000,
    };

    const id = navigator.geolocation.watchPosition(success, error, options);
    watchIdRef.current = id;
    // quick toast
    // toast.success("Live tracking started");
  };

  const stopTracking = () => {
    if (watchIdRef.current != null) {
      try {
        navigator.geolocation.clearWatch(watchIdRef.current);
      } catch (e) {}
      watchIdRef.current = null;
    }
    // Optionally notify server that driver went offline / stopped sharing
    safeEmit("driver-location-stop", { orderId });
    // toast.success("Live tracking stopped");
  };

  return null; // invisible component (no UI)
};

export default LiveTracking;


