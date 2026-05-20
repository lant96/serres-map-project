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
  const markersRef = useRef([]);

  const hotspots = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const setSelectedHotspotId = useAppStore((s) => s.setSelectedHotspotId);

  // =========================
  // INIT MAP
  // =========================
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.5489, 41.089],
      zoom: 17,
    });

    map.current.on("load", () => {
      // =========================
      // 1. SERRES BLOCKS (fill)
      // =========================
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

      // =========================
      // 2. BUILDINGS (fill)
      // =========================
      map.current.addSource("buildings", {
        type: "geojson",
        data: "/data/buildings-merarhias_02.geojson",
      });

      map.current.addLayer({
        id: "buildings-outline",
        type: "fill",
        source: "buildings",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3,
        },
      });

      // =========================
      // BUILDING CLICK HANDLER
      // =========================
      map.current.on("click", "buildings-outline", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const gisId = feature.properties?.gis_id;

        console.log("Clicked GIS ID:", gisId);

      });

      map.current.on("mouseenter", "buildings-outline", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "buildings-outline", () => {
        map.current.getCanvas().style.cursor = "";
      });



      // =========================
      // 3. OTTOMAN MARKET
      // =========================
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
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // =========================
  // HOTSPOTS (DOM MARKERS - STABLE)
  // =========================
  useEffect(() => {
    if (!map.current) return;

    // remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      activeFilter === "all"
        ? hotspots
        : hotspots.filter((h) => h.type === activeFilter);

    filtered.forEach((hotspot) => {
      const el = document.createElement("div");

      el.style.width = "18px";
      el.style.height = "18px";
      el.style.backgroundColor = "#aa3bff";
      el.style.border = "2px solid white";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

      el.addEventListener("click", () => {
        setSelectedHotspotId(hotspot.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hotspot.lng, hotspot.lat])
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [hotspots, activeFilter]);

  // =========================
  // LAYER TOGGLES
  // =========================
  const toggleLayer = (layerId, visible) => {
    if (!map.current) return;

    map.current.setLayoutProperty(
      layerId,
      "visibility",
      visible ? "visible" : "none"
    );
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }}/>
      <MapControls toggleLayer={toggleLayer} />
    </div>
  );
}