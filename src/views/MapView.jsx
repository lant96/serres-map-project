import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useAppStore } from "../store/useAppStore";
import MapControls from "../components/MapControls";
import "../map-controls.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Cache markers in a dictionary keyed by hotspot ID for easy reference manipulation
  const markersRef = useRef({});

  // Keeps a reference to hotspots to safely avoid stale closure traps during map interaction
  const hotspotsRef = useRef([]);

  const hotspots = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const selectedBuildingId = useAppStore((s) => s.selectedBuildingId);
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const setSelection = useAppStore((s) => s.setSelection);

  // Keep the hotspots reference up to date
  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  // ==========================================
  // 1. LIFECYCLE: INIT MAP (Runs EXACTLY ONCE)
  // ==========================================
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.5489, 41.089],
      zoom: 17,
    });

    map.current.on("load", () => {
      // Serres Blocks Context Layer
      map.current.addSource("serres-blocks", {
        type: "geojson",
        data: "/data/serres-blocks.geojson",
      });

      map.current.addLayer({
        id: "serres-blocks-fill",
        type: "fill",
        source: "serres-blocks",
        paint: {
          "fill-color": "#c4a484",
          "fill-opacity": 0.25,
        },
      });

      // Building Footprints Layer
      map.current.addSource("buildings", {
        type: "geojson",
        data: "/data/buildings-merarhias_02.geojson",
      });

      map.current.addLayer({
        id: "buildings-layer",
        type: "fill",
        source: "buildings",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3, // Calculated dynamically via runtime useEffect hook below
        },
      });

      // Ottoman Market Outline Reference Layer
      map.current.addSource("market", {
        type: "geojson",
        data: "/data/ottoman-market.geojson",
      });

      map.current.addLayer({
        id: "market-outline",
        type: "line",
        source: "market",
        paint: {
          "line-color": "#3a3a3a",
          "line-width": 0.5,
        },
      });

      // ==========================================
      // MAPCLICK ROUTERS
      // ==========================================
      
      // Handle polygon click
      map.current.on("click", "buildings-layer", (e) => {
        const gisId = e.features?.[0]?.properties?.gis_id;
        if (!gisId) return;

        const matchedHotspot = hotspotsRef.current.find((h) => String(h.gis_id) === String(gisId));
        
        if (matchedHotspot) {
          setSelection("hotspot", matchedHotspot.id);
        } else {
          setSelection("building", gisId);
        }
      });

      // Handle background click (Deselection)
      map.current.on("click", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["buildings-layer"],
        });

        if (features.length === 0) {
          setSelection("clear");
        }
      });

      // Cursor adjustments
      map.current.on("mouseenter", "buildings-layer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "buildings-layer", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ==========================================
  // 2. LIFECYCLE: HOTSPOT MARKER MANIFESTATION
  // ==========================================
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers cleanly before rebuilding
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const filtered =
      activeFilter === "all"
        ? hotspots
        : hotspots.filter((h) => h.type === activeFilter);

    filtered.forEach((h) => {
      if (h.type === "building" || !Number.isFinite(h.lng) || !Number.isFinite(h.lat)) return;

      const el = document.createElement("div");
      el.className = "hotspot-marker"; 

      // FIXED: Inline styles added as a guaranteed fallback against unimported global CSS rules
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid #ffffff";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.transition = "transform 0.15s ease, background-color 0.15s ease";

      // Apply primary classification coloring
      if (h.type === "image") el.style.backgroundColor = "#ff4d4d";
      else if (h.type === "publication") el.style.backgroundColor = "#888888";
      else el.style.backgroundColor = "#aa3bff";

      el.addEventListener("click", (e) => {
        e.stopPropagation(); // Restrains global map canvas reset logic from firing
        setSelection("hotspot", h.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([h.lng, h.lat])
        .addTo(map.current);

      markersRef.current[h.id] = marker;
    });
  }, [hotspots, activeFilter]);

  // ==========================================
  // 3. LIFECYCLE: REACTIVE VIEW CONTROLLER
  // ==========================================
  useEffect(() => {
    if (!map.current || !map.current.getLayer("buildings-layer")) return;

    // FIXED: Standardize lookup checks to plain strings to bypass database type mismatches
    const currentHotspot = hotspots.find((h) => String(h.id) === String(selectedHotspotId));
    const activeGisId = selectedBuildingId || currentHotspot?.gis_id || "";

    // A. Dynamic Polygon Highlight Expression
    map.current.setPaintProperty("buildings-layer", "fill-opacity", [
      "case",
      ["==", ["get", "gis_id"], activeGisId],
      0.6, // Selected building opacity state
      0.3, // Default idle footprint state
    ]);

    // B. Synchronized Map Marker Scaling
    Object.keys(markersRef.current).forEach((id) => {
      const markerElement = markersRef.current[id].getElement();
      
      if (String(id) === String(selectedHotspotId)) {
        markerElement.style.transform = "scale(1.4)";
        markerElement.style.borderColor = "#000000";
      } else {
        markerElement.style.transform = "scale(1)";
        markerElement.style.borderColor = "#ffffff";
      }
    });
  }, [selectedBuildingId, selectedHotspotId, hotspots]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <MapControls />
    </div>
  );
}