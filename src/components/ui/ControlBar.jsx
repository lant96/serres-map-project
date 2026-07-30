import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/controlBar.css";
import "./InfoModal.jsx";
import InfoModal from "./InfoModal.jsx";

const EyeOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const EyeClosed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 20.71 15.68M1 1L23 23"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LayersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MAP_LAYERS = [
  { key: "buildings-layer",       label: "Κτίρια μελέτης"},
  { key: "market-outline",        label: "Αγορά"},
  { key: "serres-blocks-fill",    label: "Τοπογραφικός χάρτης 1925"},
  { key: "hotspot-markers-layer", label: "Φωτογραφίες"},
];

const SCENE_LAYERS = [
  { key: "topografiko", label: "Τοπογραφικός χάρτης 1925"},
  { key: "buildings",   label: "Επιπλέον κτίρια"},
  { key: "model",       label: "Κτίρια μελέτης"},
  { key: "neo_sxedio",  label: "Νέα χάραξη"},
  { key: "images",      label: "Φωτογραφίες"},
];

export default function ControlBar() {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  const mapVisibility    = useAppStore((s) => s.mapVisibility);
  const toggleMapLayer   = useAppStore((s) => s.toggleMapLayer);
  const sceneVisibility  = useAppStore((s) => s.sceneVisibility);
  const toggleSceneLayer = useAppStore((s) => s.toggleSceneLayer);

  const [layersOpen, setLayersOpen] = useState(false);
  const popoverRef = useRef(null);
  const buttonRef  = useRef(null);

  const layers     = viewMode === "map" ? MAP_LAYERS    : SCENE_LAYERS;
  const visibility = viewMode === "map" ? mapVisibility  : sceneVisibility;
  const onToggle   = viewMode === "map" ? toggleMapLayer : toggleSceneLayer;

  // Close popover on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        buttonRef.current  && !buttonRef.current.contains(e.target)
      ) {
        setLayersOpen(false);
      }
    }
    if (layersOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [layersOpen]);

  // Close popover when switching view mode
  useEffect(() => { setLayersOpen(false); }, [viewMode]);

  return (
    <div className="control-bar-wrapper">

      {/* Layers popover — expands upward, above the bar */}
      {layersOpen && (
        <div className="control-popover" ref={popoverRef}>
          {layers.map(({ key, label }) => {
            const visible = visibility[key] ?? true;
            return (
              <button
                key={key}
                className={`control-popover-item ${visible ? "active" : "hidden"}`}
                onClick={() => onToggle(key)}
              >
                <span className="control-popover-icon">
                  {visible ? <EyeOpen /> : <EyeClosed />}
                </span>
                <span className="control-popover-label">{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bar — view toggle + layers button */}
      <div className="control-bar">

        <div className="control-bar-section">
          <button
            className={`control-bar-btn ${viewMode === "map" ? "active" : ""}`}
            onClick={() => setViewMode("map")}
          >
            Map
          </button>
          <button
            className={`control-bar-btn ${viewMode === "3d" ? "active" : ""}`}
            onClick={() => setViewMode("3d")}
          >
            3D
          </button>
        </div>

        <div className="control-bar-divider" />

        <button
          ref={buttonRef}
          className={`control-bar-btn control-bar-btn--layers ${layersOpen ? "active" : ""}`}
          onClick={() => setLayersOpen((v) => !v)}
        >
          <LayersIcon />
          Layers
        </button>

        <div className="control-bar-divider" />

        <InfoModal/>

      </div>
    </div>
  );
}
